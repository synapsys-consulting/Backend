/**
 * Unit tests for queriesLoader.
 *
 * No conecta a BD: solo verifica el fallback (cache vacío → resolveSql),
 * el helper getUpdatePurchaseLineCode, y el manejo de códigos desconocidos.
 */
import {
    getQuery,
    getUpdatePurchaseLineCode,
    getCacheStatus,
    _resetCacheForTesting,
} from '../src/models/queriesLoader';
import { ENTRIES, resolveSql } from '../src/models/queryEntries';
import * as Querys from '../src/models/queries.model';

describe('queriesLoader (sin BD)', () => {
    beforeEach(() => {
        _resetCacheForTesting();
    });

    describe('getQuery() — fallback a queries.model.ts cuando cache vacío', () => {
        it.each(ENTRIES.map((e) => e.code))(
            'devuelve para %s el mismo string que la función original',
            (code) => {
                const entry = ENTRIES.find((e) => e.code === code)!;
                expect(getQuery(code)).toBe(resolveSql(entry));
            },
        );

        it('lanza error con mensaje claro si el QUERY_CODE no existe', () => {
            expect(() => getQuery('NOEXISTE')).toThrow(/QUERY_CODE desconocido: NOEXISTE/);
        });
    });

    describe('getUpdatePurchaseLineCode() — mapeo (case, role) → CODE', () => {
        it.each([
            [1, 'BUYER', 'UPDPL1B'],
            [1, 'SELLER', 'UPDPL1S'],
            [2, 'BUYER', 'UPDPL2B'],
            [2, 'SELLER', 'UPDPL2S'],
            [3, 'BUYER', 'UPDPL3B'],
            [3, 'SELLER', 'UPDPL3S'],
        ])('case=%i role=%s → %s', (c, role, expected) => {
            expect(getUpdatePurchaseLineCode(c as number, role as string)).toBe(expected);
        });

        it('caseToApply fuera de {1,2,3} cae a 1 (igual que el original)', () => {
            expect(getUpdatePurchaseLineCode(0, 'BUYER')).toBe('UPDPL1B');
            expect(getUpdatePurchaseLineCode(99, 'SELLER')).toBe('UPDPL1S');
        });

        it("userRole != 'BUYER' se trata como SELLER (igual que el original)", () => {
            expect(getUpdatePurchaseLineCode(2, 'BUYER')).toBe('UPDPL2B');
            expect(getUpdatePurchaseLineCode(2, 'SELLER')).toBe('UPDPL2S');
            expect(getUpdatePurchaseLineCode(2, 'unknown')).toBe('UPDPL2S');
            expect(getUpdatePurchaseLineCode(2, '')).toBe('UPDPL2S');
        });

        it('el código devuelto se resuelve con getQuery() y produce el mismo SQL que la función original', () => {
            for (const c of [1, 2, 3]) {
                for (const role of ['BUYER', 'SELLER']) {
                    const code = getUpdatePurchaseLineCode(c, role);
                    expect(getQuery(code)).toBe(Querys.queryUpdatePurchaseLine(c, role));
                }
            }
        });
    });

    describe('getCacheStatus()', () => {
        it("inicia en estado 'never' con tamaño 0", () => {
            const s = getCacheStatus();
            expect(s.status).toBe('never');
            expect(s.size).toBe(0);
            expect(s.error).toBeNull();
        });
    });
});
