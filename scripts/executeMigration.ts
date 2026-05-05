/**
 * Ejecuta la migración: inserta las 31 queries vivas en KRC_QUERY (SCENARIO='K')
 * dentro de una transacción y valida carácter a carácter antes de COMMIT.
 *
 * Si cualquier discrepancia se detecta, hace ROLLBACK automáticamente.
 *
 * Uso:
 *   npx ts-node scripts/executeMigration.ts
 *
 * Requisitos:
 *   - .env configurado con DB, USUARIO, PASSWORD, HOST.
 *   - Permisos INSERT y SELECT sobre la tabla KRC_QUERY.
 */
import * as dotenv from 'dotenv';
import { QueryTypes, Sequelize } from 'sequelize';
import { ENTRIES, resolveSql } from '../src/models/queryEntries';

dotenv.config();

const INSERT_SQL = `INSERT INTO KRC_QUERY (
    QUERY_CODE, QUERY, NAME, DESCRIPTION, STATUS_ID,
    CREATE_DATE, EFF_DATE, EXP_DATE, MODIFY_DATE, STATUS_DATE,
    USER_CREATE_ID, USER_MODIFY_ID, SCENARIO, PARTNER_ID, UNIT, FUNCTIONALITY
) VALUES (
    ?, ?, ?, ?, 'A',
    NOW(), CURRENT_DATE(), NULL, NULL, CURRENT_DATE(),
    1, NULL, 'K', 0, 'APP', ?
)`;

async function main(): Promise<void> {
    if (!process.env.DB || !process.env.USUARIO || !process.env.HOST) {
        throw new Error(
            'Variables de entorno requeridas no establecidas (DB, USUARIO, HOST). Configura .env antes de ejecutar.',
        );
    }

    const sequelize = new Sequelize(
        process.env.DB,
        process.env.USUARIO,
        process.env.PASSWORD,
        {
            host: process.env.HOST,
            dialect: 'mariadb',
            logging: false,
        },
    );

    try {
        await sequelize.authenticate();
        console.log('OK Conectado a BD');

        // Pre-check: ¿ya existen filas con SCENARIO='K'? Abortamos para no duplicar.
        const preCheck = await sequelize.query<{ k_count: number }>(
            "SELECT COUNT(*) AS k_count FROM KRC_QUERY WHERE SCENARIO = 'K'",
            { type: QueryTypes.SELECT },
        );
        if (preCheck[0].k_count > 0) {
            console.error(
                `ERR Pre-check: ya hay ${preCheck[0].k_count} filas con SCENARIO='K'. Aborto para evitar duplicados.`,
            );
            console.error(
                "    Para reintentar limpio: DELETE FROM KRC_QUERY WHERE SCENARIO='K'  (con permisos de escritura).",
            );
            process.exit(2);
        }
        console.log("OK Pre-check: 0 filas existentes con SCENARIO='K'");

        const t = await sequelize.transaction();
        try {
            // Inserción
            for (const entry of ENTRIES) {
                const sql = resolveSql(entry);
                await sequelize.query(INSERT_SQL, {
                    replacements: [entry.code, sql, entry.name, entry.description, entry.functionality],
                    transaction: t,
                    type: QueryTypes.INSERT,
                });
            }
            console.log(`OK Insertadas ${ENTRIES.length} filas (transacción abierta)`);

            // Validación carácter a carácter dentro de la misma transacción
            const rows = await sequelize.query<{ QUERY_CODE: string; QUERY: string }>(
                "SELECT QUERY_CODE, QUERY FROM KRC_QUERY WHERE SCENARIO='K' ORDER BY QUERY_CODE",
                { type: QueryTypes.SELECT, transaction: t },
            );

            if (rows.length !== ENTRIES.length) {
                throw new Error(
                    `Esperaba ${ENTRIES.length} filas tras la inserción, encontradas ${rows.length}.`,
                );
            }

            const dbMap = new Map(rows.map((r) => [r.QUERY_CODE, r.QUERY]));
            let mismatches = 0;
            for (const entry of ENTRIES) {
                const expected = resolveSql(entry);
                const actual = dbMap.get(entry.code);
                if (actual === undefined) {
                    mismatches++;
                    console.error(`ERR ${entry.code}: no se encontró en BD tras INSERT`);
                    continue;
                }
                if (actual !== expected) {
                    mismatches++;
                    console.error(
                        `ERR ${entry.code}: discrepancia (expected.length=${expected.length}, actual.length=${actual.length})`,
                    );
                    let i = 0;
                    while (
                        i < Math.min(expected.length, actual.length) &&
                        expected[i] === actual[i]
                    ) {
                        i++;
                    }
                    console.error(
                        `    primera diferencia en char ${i}:`,
                    );
                    console.error(
                        `      expected[${i}..]: ${JSON.stringify(expected.slice(i, i + 40))}`,
                    );
                    console.error(
                        `      actual[${i}..]:   ${JSON.stringify(actual.slice(i, i + 40))}`,
                    );
                }
            }

            if (mismatches > 0) {
                throw new Error(`${mismatches} discrepancias detectadas. Cancelando.`);
            }

            console.log(`OK Validación carácter a carácter: ${ENTRIES.length}/${ENTRIES.length} coinciden`);

            await t.commit();
            console.log('OK COMMIT ejecutado. Migración completada exitosamente.');
        } catch (err) {
            await t.rollback();
            console.error('ERR ROLLBACK ejecutado. Motivo:', (err as Error).message);
            process.exit(3);
        }
    } finally {
        await sequelize.close();
    }
}

main().catch((err) => {
    console.error('ERR Error fatal:', err);
    process.exit(1);
});
