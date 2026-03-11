/**
 * simulation.js - Laboratory workflow logic for karyotyping simulation
 * Enforces correct biological order and handles interactions
 */

(function() {
    'use strict';

    const MODE_KEY = 'karyotypeLabMode';
    const STEPS = {
        1: { name: 'Sample Preparation', instruction: 'Place a sample of cells in the culture flask. Click the petri dish, then the pipette, then the culture flask.' },
        2: { name: 'Cell Culture', instruction: 'Place the culture flask in the incubator for cells to grow and divide.' },
        3: { name: 'Colchicine', instruction: 'Add colchicine to arrest cells in metaphase. Click the colchicine bottle, then the culture flask.' },
        4: { name: 'Hypotonic Treatment', instruction: 'Add hypotonic solution to swell cells, then use the centrifuge.' },
        5: { name: 'Fixation', instruction: 'Add fixative to preserve the cells.' },
        6: { name: 'Staining', instruction: 'Apply G-banding stain to visualize chromosomes.' },
        7: { name: 'Microscope Analysis', instruction: 'Examine the slide under the microscope.' }
    };

    const HINTS = {
        1: 'Start with the petri dish (your sample source), use the pipette to transfer, then add to the culture flask.',
        2: 'The incubator provides optimal temperature (37°C) for cell growth. Place the flask inside.',
        3: 'Colchicine disrupts microtubules, stopping mitosis at metaphase when chromosomes are most visible.',
        4: 'Hypotonic solution causes water uptake; cells swell and chromosomes spread apart. Centrifuge to pellet.',
        5: 'Fixative (methanol:acetic acid) preserves cellular structure and prevents decay.',
        6: 'Trypsin-Giemsa staining creates characteristic G-bands for chromosome identification.',
        7: 'Click the microscope to analyze your prepared slide.'
    };

    const EXPLANATIONS = {
        colchicine: 'Colchicine inhibits spindle formation, arresting cells in metaphase—the ideal stage for karyotype analysis because chromosomes are fully condensed and visible.',
        hypotonic: 'Hypotonic treatment causes water to enter cells by osmosis. The cells swell and burst, releasing and spreading chromosomes for easier observation.',
        fixative: 'Fixative (typically 3:1 methanol:acetic acid) preserves cellular structures and prevents further degradation.',
        stain: 'G-banding uses trypsin and Giemsa stain to produce characteristic light and dark bands on chromosomes, enabling identification of each pair.'
    };

    let currentStep = 1;
    let mode = 'training';
    let flaskState = { hasSample: false, inIncubator: false, cultured: false, hasColchicine: false, hasHypotonic: false, hasFixative: false, hasStain: false };
    let pipetteLoaded = null;
    let lastClicked = null;

    /**
     * Initialize simulation
     */
    function init() {
        mode = sessionStorage.getItem(MODE_KEY) || 'training';
        bindEvents();
        updateUI();
    }

    function bindEvents() {
        document.getElementById('petri-dish').addEventListener('click', () => handlePetriClick());
        document.getElementById('pipette').addEventListener('click', () => handlePipetteClick());
        document.getElementById('culture-flask').addEventListener('click', () => handleFlaskClick());
        document.getElementById('incubator').addEventListener('click', () => handleIncubatorClick());
        document.getElementById('reagent-colchicine').addEventListener('click', () => handleReagentClick('colchicine'));
        document.getElementById('reagent-hypotonic').addEventListener('click', () => handleReagentClick('hypotonic'));
        document.getElementById('reagent-fixative').addEventListener('click', () => handleReagentClick('fixative'));
        document.getElementById('reagent-stain').addEventListener('click', () => handleReagentClick('stain'));
        document.getElementById('centrifuge').addEventListener('click', () => handleCentrifugeClick());
        document.getElementById('microscope').addEventListener('click', () => handleMicroscopeClick());
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('error-close').addEventListener('click', closeError);
    }

    function updateUI() {
        document.getElementById('current-step-label').textContent = `Step ${currentStep}: ${STEPS[currentStep].name}`;
        document.getElementById('step-progress').value = currentStep;
        document.getElementById('instruction-content').innerHTML = `<p>${STEPS[currentStep].instruction}</p>`;

        const hintArea = document.getElementById('hint-area');
        if (mode === 'training' && HINTS[currentStep]) {
            hintArea.innerHTML = `<div class="hint"><strong>Hint:</strong> ${HINTS[currentStep]}</div>`;
            hintArea.classList.remove('hidden');
        } else {
            hintArea.innerHTML = '';
            hintArea.classList.add('hidden');
        }

        updateEquipmentStates();
    }

    function updateEquipmentStates() {
        const flask = document.getElementById('culture-flask');
        flask.classList.toggle('has-sample', flaskState.hasSample);
        flask.classList.toggle('in-use', flaskState.inIncubator || flaskState.cultured);
        flask.classList.toggle('has-colchicine', flaskState.hasColchicine);
        flask.classList.toggle('has-hypotonic', flaskState.hasHypotonic);
        flask.classList.toggle('has-fixative', flaskState.hasFixative);
        flask.classList.toggle('has-stain', flaskState.hasStain);

        document.getElementById('incubator').classList.toggle('active', flaskState.inIncubator);
    }

    // --- Step 1: Sample preparation ---
    function handlePetriClick() {
        if (currentStep !== 1) {
            if (mode === 'exam') showError('Follow the workflow order. Current step: ' + STEPS[currentStep].name);
            return;
        }
        pipetteLoaded = 'sample';
        lastClicked = 'petri';
        playAnimation('pipette', 'absorb');
        showFeedback('Sample aspirated into pipette. Now click the culture flask to transfer.');
    }

    function handlePipetteClick() {
        if (currentStep !== 1) return;
        if (!pipetteLoaded) {
            if (mode === 'exam') showError('First take a sample from the petri dish.');
            else showFeedback('Click the petri dish first to load the pipette with your sample.');
            return;
        }
        pipetteLoaded = null;
        showFeedback('Pipette is empty. Load from petri dish, then transfer to flask.');
    }

    function handleFlaskClick() {
        if (currentStep === 1) {
            if (pipetteLoaded === 'sample') {
                pipetteLoaded = null;
                flaskState.hasSample = true;
                advanceStep();
                playAnimation('culture-flask', 'sample-added');
                showModal('Step 1 Complete', 'Sample has been transferred to the culture flask. Cells need to grow—proceed to the incubator.');
            } else if (!flaskState.hasSample) {
                if (mode === 'exam') showError('Load the pipette from the petri dish first, then transfer to the flask.');
                else showFeedback('First use the pipette to transfer sample from the petri dish.');
            }
            return;
        }

        // Steps 3-6: add reagents to flask
        if (currentStep === 3 && lastClicked === 'colchicine') {
            addReagentToFlask('colchicine');
            return;
        }
        if (currentStep === 4 && lastClicked === 'hypotonic') {
            addReagentToFlask('hypotonic');
            return;
        }
        if (currentStep === 5 && lastClicked === 'fixative') {
            addReagentToFlask('fixative');
            return;
        }
        if (currentStep === 6 && lastClicked === 'stain') {
            addReagentToFlask('stain');
            return;
        }

        if (currentStep >= 3 && currentStep <= 6 && !lastClicked) {
            if (mode === 'exam') showError('First select the correct reagent for this step.');
            else showFeedback('Click the appropriate reagent bottle first, then the culture flask.');
        }
    }

    function addReagentToFlask(reagent) {
        flaskState['has' + reagent.charAt(0).toUpperCase() + reagent.slice(1)] = true;
        lastClicked = null;
        playAnimation('culture-flask', 'reagent-added');
        showModal('Reagent Added', EXPLANATIONS[reagent]);

        if (reagent === 'colchicine') setTimeout(() => { advanceStep(); updateUI(); }, 500);
        if (reagent === 'hypotonic') { /* Step 4 also requires centrifuge - don't advance yet */ }
        if (reagent === 'fixative') setTimeout(() => { advanceStep(); updateUI(); }, 500);
        if (reagent === 'stain') setTimeout(() => { advanceStep(); updateUI(); }, 500);
    }

    // --- Step 2: Incubator ---
    function handleIncubatorClick() {
        if (currentStep !== 2) {
            if (mode === 'exam') showError('Complete sample preparation first.');
            return;
        }
        if (!flaskState.hasSample) {
            if (mode === 'exam') showError('Place sample in the culture flask first.');
            else showFeedback('First add a sample to the culture flask.');
            return;
        }
        flaskState.inIncubator = true;
        playAnimation('incubator', 'culture-grow');
        showModal('Cell Culture', 'Cells are growing in the incubator at 37°C. Mitosis is occurring...');

        setTimeout(() => {
            flaskState.cultured = true;
            flaskState.inIncubator = false;
            advanceStep();
            updateUI();
            showModal('Culture Complete', 'Cells have divided. They are now ready for colchicine treatment to arrest them in metaphase.');
        }, 2500);
    }

    // --- Reagent clicks (Steps 3-6) ---
    function handleReagentClick(reagent) {
        const stepForReagent = { colchicine: 3, hypotonic: 4, fixative: 5, stain: 6 };
        const requiredStep = stepForReagent[reagent];

        if (currentStep !== requiredStep) {
            // Error: wrong reagent
            if (mode === 'exam') {
                showError(`Wrong reagent! At this step you need ${getReagentForStep(currentStep)}. Using ${reagent} has destroyed the cells.`);
            } else {
                showError(`That's the wrong reagent for this step. You need ${getReagentForStep(currentStep)}. Using the wrong reagent destroys the preparation.`);
            }
            return;
        }

        lastClicked = reagent;
        playAnimation('reagent-' + reagent, 'pour');
        showFeedback(`Selected ${reagent}. Now click the culture flask to add it.`);
    }

    function getReagentForStep(step) {
        const map = { 3: 'colchicine', 4: 'hypotonic', 5: 'fixative', 6: 'stain' };
        return map[step] || 'none';
    }

    // --- Step 4: Centrifuge ---
    function handleCentrifugeClick() {
        if (currentStep !== 4) {
            if (mode === 'exam') showError('Add hypotonic solution first, then use the centrifuge.');
            return;
        }
        if (!flaskState.hasHypotonic) {
            if (mode === 'exam') showError('Add hypotonic solution to the flask before centrifuging.');
            else showFeedback('Add the hypotonic solution to the culture flask first.');
            return;
        }
        playAnimation('centrifuge', 'spin');
        showModal('Centrifugation', 'The centrifuge pellets the swollen cells. Supernatant is removed; cells are resuspended for fixation.');

        setTimeout(() => {
            advanceStep();
            updateUI();
        }, 1500);
    }

    // --- Step 7: Microscope ---
    function handleMicroscopeClick() {
        if (currentStep !== 7) {
            if (mode === 'exam') showError('Complete all preparation steps before microscopy.');
            else showFeedback('Finish staining first. The microscope is used last.');
            return;
        }

        if (!flaskState.hasColchicine) {
            showError('Chromosomes cannot be observed! Colchicine was not added. Without colchicine, cells are not arrested in metaphase and chromosomes are not visible for karyotyping.');
            return;
        }
        if (!flaskState.hasHypotonic || !flaskState.hasFixative || !flaskState.hasStain) {
            showError('The preparation is incomplete. All steps (hypotonic, fixative, stain) must be completed before microscopy.');
            return;
        }

        playAnimation('microscope', 'zoom');
        showModal('Microscope Analysis', 'Observing chromosomes on the slide. Proceed to karyotype assembly...');

        setTimeout(() => {
            sessionStorage.setItem('karyotypeLabMode', mode);
            window.location.href = 'karyotype.html';
        }, 1500);
    }

    function advanceStep() {
        if (currentStep < 7) currentStep++;
        updateUI();
    }

    function playAnimation(elementId, type) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.classList.add('animating', `anim-${type}`);
        setTimeout(() => {
            el.classList.remove('animating', `anim-${type}`);
        }, 1500);
    }

    function showFeedback(text) {
        const inst = document.getElementById('instruction-content');
        const fb = document.createElement('div');
        fb.className = 'feedback';
        fb.textContent = text;
        inst.appendChild(fb);
        setTimeout(() => fb.remove(), 3000);
    }

    function showModal(title, text) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').textContent = text;
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    function showError(text) {
        document.getElementById('error-text').textContent = text;
        document.getElementById('error-overlay').classList.remove('hidden');
    }

    function closeError() {
        document.getElementById('error-overlay').classList.add('hidden');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
