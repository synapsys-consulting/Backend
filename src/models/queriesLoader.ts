/**
 * Loader de queries de la tabla KRC_QUERY con cache en memoria y fallback
 * automático a queries.model.ts si una query no está cargada.
 *
 * Flujo:
 *   1. Al iniciar el backend (index.ts), llamar a loadQueriesFromDB(sequelize).
 *   2. Los controllers llaman a getQuery('CODE') en lugar de Querys.fnName().
 *   3. Si el cache está vacío (BD caída o aún no cargada), getQuery devuelve el
 *      string que produciría la función original — el backend nunca se rompe.
 *
 * Para refrescar el cache sin reiniciar: llamar a reloadQueries(sequelize).
 */
import { QueryTypes, Sequelize } from 'sequelize';
import { ENTRIES, Entry, resolveSql } from './queryEntries';

type LoadStatus = 'never' | 'loading' | 'loaded' | 'error';

const cache: Map<string, string> = new Map();
const ENTRY_BY_CODE: Map<string, Entry> = new Map(ENTRIES.map((e) => [e.code, e]));

let loadStatus: LoadStatus = 'never';
let lastLoadError: string | null = null;

export async function loadQueriesFromDB(sequelize: Sequelize): Promise<void> {
    loadStatus = 'loading';
    try {
        const rows = await sequelize.query<{ QUERY_CODE: string; QUERY: string }>(
            `SELECT QUERY_CODE, QUERY FROM KRC_QUERY
             WHERE SCENARIO = 'K' AND STATUS_ID = 'A'
               AND CURDATE() BETWEEN EFF_DATE AND IFNULL(EXP_DATE, '9999-12-31')`,
            { type: QueryTypes.SELECT, raw: true },
        );
        cache.clear();
        for (const r of rows) {
            cache.set(r.QUERY_CODE, r.QUERY);
        }
        loadStatus = 'loaded';
        lastLoadError = null;
        console.log(`[queriesLoader] Cargadas ${cache.size} queries desde KRC_QUERY (SCENARIO=K)`);
    } catch (err) {
        loadStatus = 'error';
        lastLoadError = (err as Error).message;
        console.error(
            '[queriesLoader] Error al cargar queries desde BD; fallback a queries.model.ts:',
            lastLoadError,
        );
    }
}

export const reloadQueries = loadQueriesFromDB;

/**
 * Devuelve la query SQL para un QUERY_CODE.
 *  1. Cache (BD).
 *  2. Fallback: ejecuta la función equivalente de queries.model.ts.
 *  3. Si el code es desconocido, lanza error.
 */
export function getQuery(code: string): string {
    const cached = cache.get(code);
    if (cached !== undefined) {
        return cached;
    }
    const entry = ENTRY_BY_CODE.get(code);
    if (!entry) {
        throw new Error(`[queriesLoader] QUERY_CODE desconocido: ${code}`);
    }
    return resolveSql(entry);
}

/**
 * Mapea (caseToApply, userRole) al QUERY_CODE correspondiente, replicando el
 * comportamiento original de queryUpdatePurchaseLine: caso fuera de {1,2,3} → 1,
 * userRole != 'BUYER' → SELLER.
 */
export function getUpdatePurchaseLineCode(caseToApply: number, userRole: string): string {
    const c = caseToApply === 1 || caseToApply === 2 || caseToApply === 3 ? caseToApply : 1;
    const r = userRole === 'BUYER' ? 'B' : 'S';
    return `UPDPL${c}${r}`;
}

export function getCacheStatus(): { status: LoadStatus; size: number; error: string | null } {
    return { status: loadStatus, size: cache.size, error: lastLoadError };
}

/**
 * Solo para tests: reset del cache.
 */
export function _resetCacheForTesting(): void {
    cache.clear();
    loadStatus = 'never';
    lastLoadError = null;
}
