---
name: optimizacion-sql
description: Usar cuando el usuario comparta consultas SQL o diseños de tablas y quiera revisión de calidad, mejoras de legibilidad y optimización de rendimiento (índices, joins, filtros, agregaciones, planes de ejecución).
---

# Skill: Optimización y Revisión de SQL

Revisa SQL para mejorar rendimiento, claridad y mantenibilidad sin cambiar el resultado esperado.

## Objetivo
- Detectar cuellos de botella (scans completos, joins costosos, subconsultas innecesarias).
- Proponer optimizaciones (índices, reescritura de consultas, reducción de datos procesados).
- Mejorar legibilidad (nombres, CTEs, formato, consistencia).
- Señalar riesgos de correctness (duplicados por joins, NULLs, cardinalidad, filtros).

## Entradas que necesito (si faltan, preguntarlas)
- Motor SQL (PostgreSQL, MySQL, SQL Server, BigQuery, Snowflake, SQLite, etc.).
- Esquema relevante (tablas, claves, tipos, índices existentes).
- Volumen aproximado (filas por tabla) y selectividad de filtros.
- Objetivo: latencia, coste, throughput o estabilidad.
- Si existe: EXPLAIN/EXPLAIN ANALYZE o plan de ejecución.

## Señales de ineficiencia (red flags)
- `SELECT *` en tablas grandes.
- Filtros no sargables (funciones sobre columnas en WHERE, `LIKE '%...%'` sin soporte).
- Joins sin condiciones o con claves no indexadas.
- Subconsultas correlacionadas evitables.
- Agregaciones antes de filtrar o de reducir cardinalidad.
- `DISTINCT` usado como “parche” por joins mal planteados.
- Ordenaciones (`ORDER BY`) y paginación sin índices adecuados.
- Uso de `IN`/`NOT IN` con NULLs (riesgo de resultados inesperados).

## Estrategia de optimización
1. Confirmar resultado esperado (semántica) y casos límite (NULL, duplicados).
2. Reducir filas lo antes posible (filtros, particiones, pre-aggregations).
3. Asegurar joins por claves correctas y minimizar columnas seleccionadas.
4. Reescribir para sargabilidad (evitar funciones sobre columnas filtradas).
5. Proponer índices adecuados (compuestos, cobertura, orden de columnas) o particionado cuando aplique.
6. Validar con plan de ejecución (qué cambia y por qué) y riesgos.

## Salida esperada (formato de respuesta)
- **Problemas detectados** (bullets, con impacto estimado).
- **Consulta optimizada** (SQL reescrito).
- **Índices/particionado sugeridos** (si aplica, con justificación).
- **Notas de corrección** (posibles cambios de resultado y cómo evitarlos).
- **Siguientes pasos** (medir con EXPLAIN/benchmarks).

## Restricciones
- No asumir motor SQL: si no está indicado, preguntar o dar alternativas por motor.
- No cambiar el resultado lógico sin avisar explícitamente.
- Si faltan datos (esquema/volumen), proponer hipótesis y marcarlas como supuestos.