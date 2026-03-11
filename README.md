# Karyotyping Laboratory Simulator

An interactive 2D virtual laboratory simulator for human karyotyping, designed for medical students learning cytogenetics.

## Features

- **Laboratory Workflow Simulation**: Perform the complete karyotype preparation workflow from sample to analysis
- **Step-by-Step Guidance**: Enforced biological order with educational feedback
- **Chromosome Assembly**: Drag-and-drop interface to pair chromosomes (1–22 + sex chromosomes)
- **Diagnostic Results**: Learn about conditions like 46,XX / 46,XY, Trisomy 21, Turner syndrome, Klinefelter syndrome
- **Training & Exam Modes**: With or without hints

## Project Structure

```
karyotype-lab-simulator/
├── index.html          # Landing page (mode selection)
├── simulation.html      # Laboratory workspace
├── karyotype.html      # Chromosome analysis
├── styles.css          # Main stylesheet
├── main.js             # Entry point
├── simulation.js       # Lab workflow logic
├── karyotype.js        # Chromosome assembly logic
├── images/             # Lab equipment placeholders
├── reagents/           # Reagent placeholders
└── chromosomes/        # Chromosome placeholders
```

## How to Run

Open `index.html` in a modern web browser. No build step or server required—works as static files.

## Workflow Steps

1. **Sample Preparation** – Transfer cells from petri dish to culture flask
2. **Cell Culture** – Place flask in incubator (cells multiply)
3. **Colchicine** – Arrest mitosis in metaphase
4. **Hypotonic Treatment** – Swell cells; use centrifuge
5. **Fixation** – Preserve cells with fixative
6. **Staining** – Apply G-banding stain
7. **Microscope** – Analyze slide and proceed to karyotype assembly

## Technologies

- HTML5, CSS3, JavaScript (vanilla, no frameworks)
- Responsive layout
- CSS animations for lab processes

## License

Educational use.
