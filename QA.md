# QA · CANDADO SIMPLEX

Ejecutado el 20 de octubre de 2026. Herramientas: Node 22, Python 3, Playwright/Chromium y axe-core. Las resoluciones de iPad y móviles se probaron mediante emulación de viewport y tacto en Chromium, no en dispositivos físicos ni Safari.

## Académico — PASS

- Lectura directa del PDF original, páginas 27–29.
- 20 escenarios: 16 extractos reales verificables y 4 conceptuales identificados en pantalla.
- Reconstrucción independiente por inversión de las cinco bases a partir de A y b originales.
- Reconstrucción adicional con `fractions.Fraction` de Python, sin error de redondeo: cuatro pivotes y resultado exacto 40/3, 40/3, 800/3.
- Signos zⱼ − cⱼ; máximo positivo admisible; negativos superiores; prioridad inicial; Sol. = 0; ausencia de candidato; fin de niveles.
- Razón mínima excluyendo cero/negativos y conservación de los niveles superiores después de cada pivote.
- Empates válidos completos en B2 y C3; prueba adicional de empate de razón mínima.
- Discrepancia de conteo de iteraciones del PDF documentada en `ACADEMICO.md`.

## Funcional — PASS

Cinco partidas completas ejecutadas simultáneamente con tiempo real, sin simular el reloj. Cada reto tuvo una ventana automatizada de lectura de 14 segundos. Esto verifica funcionamiento dentro de la duración objetivo; no sustituye un estudio de tiempo con estudiantes.

| Resolución | Banco recorrido | Tiempo observado | Precisión inicial | Resultado |
|---|---|---|---|---|
| 375 × 812 | A1, B1, C1, D1, E1 | 1:11 | 60% | PASS |
| 390 × 844 | A2, B2, C2, D2, E2 | 1:11 | 80% | PASS |
| 820 × 1180 | A3, B3, C3, D3, E3 | 1:12 | 80% | PASS |
| 1180 × 820 | A4, B4, C4, D4, E4 | 1:12 | 80% | PASS |
| 1440 × 900 | A1, B1, C1, D1, E1 | 1:11 | 80% | PASS |

En cada partida se provocó un error en protección y se comprobó el reintento. En 375 px se activó además el candado por el −2 del ejemplo conceptual. Ningún error abre el siguiente reto. Se comprobaron todos los estados finales y los cinco replay.

- **Sin overflow horizontal**, comprobado en todos los retos y finales.
- **Zonas táctiles ≥ 44 × 44 px**, medidas en todos los botones de tabla.
- **Teclado:** Enter para iniciar; Space para resolver los cinco retos de desktop; foco pasa a Continuar.
- **Accesibilidad:** cero infracciones axe en inicio, reto de jerarquía, reto de salida y final de las cinco resoluciones. Tabla semántica, nombres accesibles, foco y estado vivo.
- **Movimiento reducido:** activado en el contexto de 1180 × 820; reglas CSS eliminan animaciones y transiciones.
- **Audio:** activación, generación de tonos en acierto/error y desactivación ejecutadas sin excepciones; no se realizó evaluación auditiva humana.
- **Interfaz:** capturas de los 25 retos y cinco finales; inspección visual de móvil y composición iPad horizontal. Coeficientes y fracciones visibles; fila/columna seleccionadas, candados y feedback operativo.
- **Sin errores JavaScript** en las cinco sesiones.

Los artefactos locales se regeneran en `test-results/` con `npm run qa`, incluyendo `report.json` y 30 capturas. Se excluyen del despliegue y del repositorio.

## Pendientes de validación externa

- Medición pedagógica de dificultad 7–8/10 y duración con alumnos reales.
- Prueba en Safari/iPad físico y escucha humana del audio.

Estas validaciones externas no se presentan como pruebas realizadas.
