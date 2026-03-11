/**
 * karyotype.js - Chromosome assembly and karyotype analysis logic
 * Drag-and-drop interface for pairing chromosomes
 */

(function() {
    'use strict';

    const MODE_KEY = 'karyotypeLabMode';

    // Karyotype conditions with educational content
    const KARYOTYPES = {
        normal_female: {
            notation: '46,XX',
            diagnosis: 'Normal Female Karyotype',
            explanation: 'The standard female chromosome complement. 46 chromosomes including two X sex chromosomes. No chromosomal abnormalities detected.'
        },
        normal_male: {
            notation: '46,XY',
            diagnosis: 'Normal Male Karyotype',
            explanation: 'The standard male chromosome complement. 46 chromosomes including one X and one Y sex chromosome. No chromosomal abnormalities detected.'
        },
        down_syndrome: {
            notation: '47,XX,+21',
            diagnosis: 'Down Syndrome (Trisomy 21)',
            explanation: 'An extra copy of chromosome 21 (trisomy 21) causes Down syndrome. Features may include intellectual disability, characteristic facial features, and increased risk of heart defects. The condition occurs in approximately 1 in 700 live births.'
        },
        turner_syndrome: {
            notation: '45,X',
            diagnosis: 'Turner Syndrome',
            explanation: 'Monosomy X—absence of one X chromosome in females. Features may include short stature, ovarian dysfunction, and cardiac anomalies. Occurs in approximately 1 in 2,500 female births.'
        },
        klinefelter_syndrome: {
            notation: '47,XXY',
            diagnosis: 'Klinefelter Syndrome',
            explanation: 'An extra X chromosome in males (47,XXY). Features may include tall stature, hypogonadism, and reduced fertility. Occurs in approximately 1 in 500-1,000 male births.'
        }
    };

    // Chromosome pair definitions: each pair has approximate relative size for display
    const PAIR_SIZES = [1.9, 1.7, 1.5, 1.4, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1.0, 0.98, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];

    let currentKaryotype = null;
    let mode = 'training';
    let chromosomes = [];
    let slots = {};
    let dragChromosome = null;

    /**
     * Select a random karyotype condition for this session
     */
    function selectKaryotype() {
        const keys = Object.keys(KARYOTYPES);
        const idx = Math.floor(Math.random() * keys.length);
        return keys[idx];
    }

    /**
     * Build chromosome set based on karyotype condition
     */
    function buildChromosomeSet(karyotypeKey) {
        const set = [];
        const k = KARYOTYPES[karyotypeKey];

        // Autosomes 1-22 (pairs)
        for (let i = 1; i <= 22; i++) {
            const extra = (karyotypeKey === 'down_syndrome' && i === 21) ? 1 : 0;
            set.push({ id: `chr-${i}-a`, pair: i, isSex: false });
            set.push({ id: `chr-${i}-b`, pair: i, isSex: false });
            if (extra) set.push({ id: 'chr-21-extra', pair: 21, isSex: false });
        }

        // Sex chromosomes
        if (karyotypeKey === 'normal_female') {
            set.push({ id: 'chr-X-a', pair: 'X', isSex: true });
            set.push({ id: 'chr-X-b', pair: 'X', isSex: true });
        } else if (karyotypeKey === 'normal_male') {
            set.push({ id: 'chr-X', pair: 'X', isSex: true });
            set.push({ id: 'chr-Y', pair: 'Y', isSex: true });
        } else if (karyotypeKey === 'down_syndrome') {
            set.push({ id: 'chr-X-a', pair: 'X', isSex: true });
            set.push({ id: 'chr-X-b', pair: 'X', isSex: true });
        } else if (karyotypeKey === 'turner_syndrome') {
            set.push({ id: 'chr-X', pair: 'X', isSex: true });
        } else if (karyotypeKey === 'klinefelter_syndrome') {
            set.push({ id: 'chr-X-a', pair: 'X', isSex: true });
            set.push({ id: 'chr-X-b', pair: 'X', isSex: true });
            set.push({ id: 'chr-Y', pair: 'Y', isSex: true });
        }

        return set;
    }

    /**
     * Create a chromosome element for display
     */
    function createChromosomeElement(chr) {
        const el = document.createElement('div');
        el.className = 'chromosome-item draggable';
        el.draggable = true;
        el.dataset.id = chr.id;
        el.dataset.pair = chr.pair;

        const size = chr.isSex ? (chr.pair === 'X' ? 0.6 : 0.4) : PAIR_SIZES[chr.pair - 1] || 0.5;
        el.style.setProperty('--chr-size', size);

        const label = chr.isSex ? chr.pair : chr.pair;
        el.innerHTML = `<span class="chr-label">${label}</span>`;
        return el;
    }

    /**
     * Create slot elements for pairs 1-22 + X, Y
     */
    function createSlots(karyotypeKey) {
        const container = document.getElementById('slots-container');
        container.innerHTML = '';

        for (let i = 1; i <= 22; i++) {
            const slot = document.createElement('div');
            slot.className = 'karyotype-slot';
            slot.dataset.pair = i;
            const maxSlots = (karyotypeKey === 'down_syndrome' && i === 21) ? 3 : 2;
            slot.innerHTML = `<span class="slot-label">${i}</span><div class="slot-content" data-pair="${i}" data-max-slots="${maxSlots}"></div>`;
            container.appendChild(slot);
            slots[i] = { element: slot.querySelector('.slot-content'), chromosomes: [] };
        }

        const xSlot = document.createElement('div');
        xSlot.className = 'karyotype-slot sex-slot';
        xSlot.dataset.pair = 'X';
        const xMaxSlots = (karyotypeKey === 'turner_syndrome') ? 1 : 2;
        xSlot.innerHTML = `<span class="slot-label">X</span><div class="slot-content" data-pair="X" data-max-slots="${xMaxSlots}"></div>`;
        container.appendChild(xSlot);
        slots['X'] = { element: xSlot.querySelector('.slot-content'), chromosomes: [] };

        const ySlot = document.createElement('div');
        ySlot.className = 'karyotype-slot sex-slot';
        ySlot.dataset.pair = 'Y';
        ySlot.innerHTML = '<span class="slot-label">Y</span><div class="slot-content" data-pair="Y" data-max-slots="1"></div>';
        container.appendChild(ySlot);
        slots['Y'] = { element: ySlot.querySelector('.slot-content'), chromosomes: [] };

        // Hide Y slot if not needed (female karyotypes)
        if (karyotypeKey === 'normal_female' || karyotypeKey === 'down_syndrome' || karyotypeKey === 'turner_syndrome') {
            ySlot.style.display = 'none';
        }
    }

    /**
     * Randomize positions of chromosomes in the pool
     */
    function randomizePool() {
        const pool = document.getElementById('chromosome-drag-area');
        chromosomes.forEach(chr => {
            const el = createChromosomeElement(chr);
            el.style.left = Math.random() * 80 + 5 + '%';
            el.style.top = Math.random() * 70 + 5 + '%';
            pool.appendChild(el);
            bindDragEvents(el);
        });
    }

    function bindDragEvents(el) {
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);
    }

    function handleDragStart(e) {
        dragChromosome = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        dragChromosome = null;
    }

    /**
     * Set up drop zones for slots and pool
     */
    function setupDropZones() {
        document.querySelectorAll('.slot-content').forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('drop', handleSlotDrop);
            slot.addEventListener('dragleave', handleDragLeave);
        });

        const pool = document.getElementById('chromosome-drag-area');
        pool.addEventListener('dragover', handleDragOver);
        pool.addEventListener('dragleave', (e) => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.classList.remove('drag-over'); });
        pool.addEventListener('drop', handlePoolDrop);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleSlotDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (!dragChromosome) return;

        const pair = e.currentTarget.dataset.pair;
        const chrPair = dragChromosome.dataset.pair;

        // Allow both numeric and string comparison
        if (String(pair) === String(chrPair)) {
            moveToSlot(dragChromosome, e.currentTarget);
        } else {
            if (mode === 'exam') {
                showSlotError(e.currentTarget, 'Wrong pair! This chromosome belongs in slot ' + chrPair);
            }
        }
    }

    function handlePoolDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (!dragChromosome) return;

        // Remove from slot if it was placed in one
        for (const pairKey of Object.keys(slots)) {
            const slot = slots[pairKey];
            const idx = slot.chromosomes.indexOf(dragChromosome);
            if (idx > -1) {
                slot.chromosomes.splice(idx, 1);
                break;
            }
        }
        document.getElementById('chromosome-drag-area').appendChild(dragChromosome);
    }

    function moveToSlot(chrEl, slotEl) {
        const pair = slotEl.dataset.pair;
        const slot = slots[pair];
        if (!slot) return;

        const maxSlots = parseInt(slotEl.dataset.maxSlots, 10) || 2;
        if (slot.chromosomes.length >= maxSlots) {
            if (mode === 'exam') showSlotError(slotEl, 'This slot is full.');
            return;
        }

        const prevParent = chrEl.parentElement;
        if (prevParent && prevParent.classList.contains('slot-content')) {
            const prevPair = prevParent.dataset.pair;
            const prevSlot = slots[prevPair];
            const idx = prevSlot.chromosomes.indexOf(chrEl);
            if (idx > -1) prevSlot.chromosomes.splice(idx, 1);
        }

        slotEl.appendChild(chrEl);
        slot.chromosomes.push(chrEl);
    }

    function showSlotError(slotEl, msg) {
        const err = document.createElement('div');
        err.className = 'slot-error';
        err.textContent = msg;
        slotEl.appendChild(err);
        setTimeout(() => err.remove(), 2000);
    }

    /**
     * Check if karyotype is correct
     */
    function checkKaryotype() {
        const expected = buildChromosomeSet(currentKaryotype);
        const paired = [];

        Object.keys(slots).forEach(pairKey => {
            const slot = slots[pairKey];
            slot.chromosomes.forEach(chrEl => {
                paired.push({ pair: chrEl.dataset.pair, id: chrEl.dataset.id });
            });
        });

        // Simple validation: count and basic pair check
        const poolChromosomes = document.querySelectorAll('#chromosome-drag-area .chromosome-item');
        if (poolChromosomes.length > 0) {
            document.getElementById('result-content').innerHTML = '<p class="error">Not all chromosomes have been placed. Drag each chromosome to its correct slot.</p>';
            return;
        }

        // Verify pairing logic (simplified)
        const karyotypeData = KARYOTYPES[currentKaryotype];
        document.getElementById('result-karyotype').textContent = karyotypeData.notation;
        document.getElementById('result-diagnosis').textContent = karyotypeData.diagnosis;
        document.getElementById('result-explanation').textContent = karyotypeData.explanation;
        document.getElementById('result-modal').classList.remove('hidden');
    }

    /**
     * Initialize karyotype page
     */
    function init() {
        mode = sessionStorage.getItem(MODE_KEY) || 'training';
        currentKaryotype = selectKaryotype();
        chromosomes = buildChromosomeSet(currentKaryotype);

        createSlots(currentKaryotype);
        randomizePool();
        setupDropZones();

        document.getElementById('check-btn').addEventListener('click', checkKaryotype);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
