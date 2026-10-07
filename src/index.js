import { MiniMaple } from './miniMaple.js';

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    document.getElementById('runButton').onclick = calculateDiff;
}

function calculateDiff() {
    const expr = document.getElementById('expression').value;
    const variable = document.getElementById('variable').value;
    const container = document.getElementById('container');
    const maple = new MiniMaple();

    try {
        const result = maple.diff(expr, variable);
        container.innerHTML = `$$${result}$$`;

        if (window.MathJax) {
            MathJax.typesetPromise([container]);
        }
    } catch (e) {
        container.innerHTML = `<span style="color: red;">Error: ${e.message}</span>`;
    }
}