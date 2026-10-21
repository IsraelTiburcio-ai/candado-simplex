# CANDADO SIMPLEX

**Protege las prioridades.** Microjuego de Optimización I, HTML/CSS/JavaScript vanilla, sin backend.

- 20 escenarios: 16 extractos derivados del modelo del cuadernillo y 4 ejercicios conceptuales etiquetados.
- 5 retos por partida, sin límite forzado. Objetivo de lectura y decisión: 70–120 segundos.
- Interacción con niveles, columnas y filas de una tabla HTML accesible. Teclado con Tab/Enter/Espacio.
- Audio sintetizado opcional, foco visible y movimiento reducido.
- Tabla completa y algoritmo en `src/math.js`; banco en `src/data.js`; presentación en `src/ui.js`; partida en `src/app.js`.

## Uso local y QA

```sh
npm ci
npm test
npm start
# En otra terminal:
npx playwright install chromium
npm run qa
```

Abrir http://localhost:4289. La publicación utiliza GitHub Pages con Actions desde `main`. No requiere compilación. Las fuentes web tienen alternativas locales.

Consulta [la trazabilidad académica](ACADEMICO.md) y [el reporte de pruebas](QA.md).
