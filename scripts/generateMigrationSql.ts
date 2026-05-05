/**
 * Genera el SQL de migración: lee las queries de src/models/queries.model.ts
 * y produce un fichero .sql con 31 INSERTs en una transacción para la tabla
 * KRC_QUERY (SCENARIO='K').
 *
 * Uso:
 *   npx ts-node scripts/generateMigrationSql.ts
 *
 * Salida:
 *   scripts/migrate_queries_to_db.sql
 */
import * as fs from 'fs';
import * as path from 'path';
import { ENTRIES, Entry, resolveSql } from '../src/models/queryEntries';

function escapeSqlLiteral(s: string): string {
    return s.replace(/'/g, "''");
}

function buildInsert(entry: Entry): string {
    const sql = resolveSql(entry);
    const code = escapeSqlLiteral(entry.code);
    const query = escapeSqlLiteral(sql);
    const name = escapeSqlLiteral(entry.name);
    const description = escapeSqlLiteral(entry.description);
    const functionality = escapeSqlLiteral(entry.functionality);

    return [
        `-- ${entry.code} → ${entry.fnName}${entry.args ? `(${entry.args[0]}, '${entry.args[1]}')` : '()'}`,
        `INSERT INTO KRC_QUERY (`,
        `    QUERY_CODE, QUERY, NAME, DESCRIPTION, STATUS_ID,`,
        `    CREATE_DATE, EFF_DATE, EXP_DATE, MODIFY_DATE, STATUS_DATE,`,
        `    USER_CREATE_ID, USER_MODIFY_ID, SCENARIO, PARTNER_ID, UNIT, FUNCTIONALITY`,
        `) VALUES (`,
        `    '${code}',`,
        `    '${query}',`,
        `    '${name}',`,
        `    '${description}',`,
        `    'A',`,
        `    NOW(), CURRENT_DATE(), NULL, NULL, CURRENT_DATE(),`,
        `    1, NULL, 'K', 0, 'APP', '${functionality}'`,
        `);`,
    ].join('\n');
}

function main(): void {
    const lines: string[] = [];
    lines.push('-- =====================================================================');
    lines.push('-- Migración de queries: queries.model.ts → KRC_QUERY (SCENARIO=K)');
    lines.push(`-- Generado: ${new Date().toISOString()}`);
    lines.push(`-- Total INSERTs: ${ENTRIES.length}`);
    lines.push('-- ');
    lines.push('-- IMPORTANTE: revisar la salida del SELECT final ANTES de hacer COMMIT.');
    lines.push('-- Si k_count != 31, ejecutar ROLLBACK en lugar de COMMIT.');
    lines.push('-- =====================================================================');
    lines.push('');
    lines.push('START TRANSACTION;');
    lines.push('');

    for (const entry of ENTRIES) {
        lines.push(buildInsert(entry));
        lines.push('');
    }

    lines.push('-- ===== Validación =====');
    lines.push("SELECT COUNT(*) AS k_count FROM KRC_QUERY WHERE SCENARIO = 'K';");
    lines.push('');
    lines.push('-- Si k_count = 31 → ejecutar:  COMMIT;');
    lines.push('-- Si k_count != 31 → ejecutar: ROLLBACK;');

    const outPath = path.join(__dirname, 'migrate_queries_to_db.sql');
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

    console.log(`Generated: ${outPath}`);
    console.log(`Total INSERTs: ${ENTRIES.length}`);
    console.log(`Codes: ${ENTRIES.map((e) => e.code).join(', ')}`);
}

if (require.main === module) {
    main();
}
