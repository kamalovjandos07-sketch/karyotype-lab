/**
 * main.js - Entry point for Karyotyping Lab Simulator
 * Handles mode selection and navigation to simulation
 */

(function() {
    'use strict';

    const MODE_KEY = 'karyotypeLabMode';
    const TRAINING = 'training';
    const EXAM = 'exam';

    /**
     * Initialize the landing page
     */
    function init() {
        const modeCards = document.querySelectorAll('.mode-card');
        const startBtn = document.getElementById('start-btn');

        // Mode selection
        modeCards.forEach(card => {
            card.addEventListener('click', () => selectMode(card, modeCards, startBtn));
        });

        // Start simulation
        startBtn.addEventListener('click', startSimulation);

        // Highlight first mode by default for UX
        if (modeCards.length > 0) {
            modeCards[0].classList.add('selected');
            startBtn.textContent = 'Start Training Mode';
            startBtn.disabled = false;
        }
    }

    /**
     * Select learning mode and update UI
     */
    function selectMode(clickedCard, allCards, startBtn) {
        allCards.forEach(c => c.classList.remove('selected'));
        clickedCard.classList.add('selected');

        const mode = clickedCard.dataset.mode;
        startBtn.disabled = false;

        if (mode === TRAINING) {
            startBtn.textContent = 'Start Training Mode';
        } else {
            startBtn.textContent = 'Start Exam Mode';
        }
    }

    /**
     * Navigate to simulation with selected mode
     */
    function startSimulation() {
        const selectedCard = document.querySelector('.mode-card.selected');
        if (!selectedCard) return;

        const mode = selectedCard.dataset.mode;
        sessionStorage.setItem(MODE_KEY, mode);
        window.location.href = 'simulation.html';
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
