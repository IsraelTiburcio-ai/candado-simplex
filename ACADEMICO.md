# Candado Simplex · trazabilidad académica

Fuente consultada: **GYM 5_251128_083844.pdf**, Gimnasio 5, páginas 27–29 (numeración impresa y del archivo). El documento no se redistribuye.

## Convención aplicada

- P₁, P₂ y P₃ son niveles jerárquicos, no valores numéricos. Hay un renglón **zⱼ − cⱼ** por nivel.
- Paso 1: comenzar con k = 1.
- Paso 2: revisar primero el lado derecho del nivel activo. Si vale cero, ir al paso 6.
- Paso 3: entre los coeficientes positivos del nivel actual, descartar columnas con **cualquier negativo en un nivel superior**; elegir el positivo mayor restante. Todos los empates máximos son válidos.
- Sin positivo admisible: paso 6, aunque el lado derecho siga siendo positivo. Eso no significa que todas las metas estén alcanzadas.
- Paso 4: mínimo bᵢ/aᵢⱼ entre divisores estrictamente positivos. Se admiten todos los mínimos empatados.
- Paso 5: Gauss-Jordan. Paso 6: k ← k + 1; al superar el último nivel, detenerse.

La entrada aquí usa **positivos** con la convención de minimización zⱼ − cⱼ del cuadernillo. No se importa una regla de entrada negativa de otra presentación del Simplex. La razón mínima y Gauss-Jordan sí siguen el procedimiento normal indicado por la profesora.

## Modelo original de cámaras, página 28

Minimizar lexicográficamente: (d₁⁺ + d₂⁺; 30d₃⁻ + 40d₄⁻; d₅⁻).

```text
2x₁ + 4x₂ + d₁⁻ − d₁⁺ = 80
3x₁ + 3x₂ + d₂⁻ − d₂⁺ = 80
x₁ + d₃⁻ − d₃⁺ = 10
x₂ + d₄⁻ − d₄⁺ = 10
30x₁ + 40x₂ + d₅⁻ − d₅⁺ = 1200
Todas las variables ≥ 0.
```

La base inicial es (d₁⁻, d₂⁻, d₃⁻, d₄⁻, d₅⁻); solución (80,80,10,10,1200). Sus evaluaciones tienen lados derechos (0,700,1200). `src/math.js` conserva las doce columnas originales y las cinco restricciones; la interfaz muestra solamente un extracto, claramente etiquetado. En los retos de salida se muestran **las cinco filas** y la columna de entrada para no omitir ningún candidato de razón mínima.

## Reconstrucción verificada

| Estado | Entra / sale para llegar a él | Valores de P₁, P₂, P₃ |
|---|---|---|
| Inicial | — | 0, 700, 1200 |
| 1 | x₂ / d₄⁻ | 0, 300, 800 |
| 2 | x₁ / d₃⁻ | 0, 0, 500 |
| 3 | d₄⁺ / d₁⁻ | 0, 0, 300 |
| 4 | d₃⁺ / d₂⁻ | 0, 0, 800/3 |

Resultado: x₁ = x₂ = 40/3, d₃⁺ = d₄⁺ = 10/3, d₅⁻ = 800/3. Coincide con la tabla final de p. 29, salvo su redondeo decimal. La frase «Después de tres iteraciones» de esa página no coincide con los **cuatro pivotes** necesarios desde la base inicial siguiendo la regla escrita. El juego usa la reconstrucción algebraica, no ese conteo.

## Banco: 20 escenarios

Cada partida elige uno de cuatro escenarios para cada tipo A, B, C, D y E, en ese orden. Los datos incluyen nivel activo, coeficientes, columnas, candidatos admisibles, todas las respuestas correctas, justificación y regla. Los casos reales incluyen además base, restricciones y solución completa.

- **A1–A4:** inicio en P₁, paso a P₂, paso a P₃ y permanencia en P₂.
- **B1–B4:** cuatro **ejercicios conceptuales de selección**, etiquetados como tales; no se afirma que sean tablas alcanzables. B1 es el ejemplo solicitado (0,−2,0)/(4,5,−1); B2 admite empate; B3 protege dos niveles; B4 compara positivos admisibles.
- **C1–C4:** extractos de la tabla final auténtica. Los negativos de P₁ bloquean los positivos de d₁⁺ y d₂⁺ en P₃. C3 admite ambas respuestas.
- **D1–D4:** los cuatro pivotes reconstruidos. Razones mínimas respectivas: 10, 10, 10, 10/3. Se excluyen ceros y negativos.
- **E1–E4:** meta alcanzada en P₁, permanencia en P₂, terminación de P₃ sin candidato aunque persista desviación, meta alcanzada en P₂.

## Verificación reproducible

`npm test` invierte independientemente cada base original B para reconstruir B⁻¹A y B⁻¹b, verifica factibilidad y recalcula zⱼ − cⱼ. Comprueba respuestas, empates, negativos superiores, razón mínima, protección tras cada pivote y criterio de avance. No valida tablas conceptuales como iteraciones reales.

`npm run qa` ejecuta cinco partidas en Chromium con los tamaños indicados, teclado, tacto emulado, audio, replay, movimiento reducido, análisis axe y comprobación de overflow. Véase `QA.md` para el resultado realmente ejecutado.
