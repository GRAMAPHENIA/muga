/**
 * Archivo principal de JavaScript
 * Punto de entrada para todas las funcionalidades
 */

import { initSmoothScroll } from './modules/scroll.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el scroll suave entre secciones
    initSmoothScroll();
    
    // Aquí se pueden inicializar otros módulos a medida que se vayan creando
    // Por ejemplo:
    // initAnimations();
    // initForms();
});