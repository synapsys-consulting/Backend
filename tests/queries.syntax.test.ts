import * as Querys from '../src/models/queries.model';

const simpleFunctions: string[] = [
    'getProducts',
    'getProductsWithTags',
    'queryGetProductsAvailable',
    'queryGetProductsAvailableWithPartnerId',
    'queryGetProductsAvailableWithPartnerIdProcedureCall',
    'queryGetProductsAvailableWithOutPartnerId',
    'getProductAvailWithProductId',
    'queryPurchaseSequence',
    'queryGetPurchaseByUserIdOldVersion',
    'queryGetPurchaseByUserId',
    'queryGetPurchaseByUserIdRange',
    'queryGetPurchaseLinesByOrderIdOld',
    'queryGetPurchaseLinesByOrderId',
    'queryGetStatusPurchase',
    'queryUpdatePurchaseState',
    'queryUpdatePurchaseLineState',
    'getStatusToTransitionToDeprecated',
    'getStatusToTransitionTo',
    'getBanPriceUndBanQuantityValues',
    'queryInsertPurchased',
    'queryTransactionsSequence',
    'querySaveTransaction',
    'updateProductsAvail',
    'addMarkedPruductsToTransactions',
    'queryMarkedPruductsToTransactions',
    'updateStockProductAvail',
    'getDefaultLogisticAddress',
    'getDefaultLogisticAddressByPersoneId',
    'getRoleByUser',
    'getAdresses',
    'getTaxType',
    'getUnitType',
    'getProviders',
    'getPartners',
    'getProductTypes',
    'queryInsertNewProduct',
    'queryNewProductSequence',
    'getShifts',
];

const updatePurchaseLineCases: Array<[number, string]> = [
    [1, 'BUYER'],
    [1, 'SELLER'],
    [2, 'BUYER'],
    [2, 'SELLER'],
    [3, 'BUYER'],
    [3, 'SELLER'],
    [0, 'BUYER'],
    [99, 'SELLER'],
];

const SQL_KEYWORD_RE = /\b(SELECT|INSERT|UPDATE|DELETE|CALL)\b/i;

function countChar(text: string, ch: string): number {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === ch) count++;
    }
    return count;
}

describe('queries.model.ts — syntactic validation (level 1)', () => {
    describe('Total expected exports', () => {
        it('exports the 38 simple functions plus queryUpdatePurchaseLine', () => {
            const exported = Object.keys(Querys).filter(
                (k) => typeof (Querys as Record<string, unknown>)[k] === 'function',
            );
            expect(exported.length).toBe(simpleFunctions.length + 1);
        });
    });

    describe.each(simpleFunctions)('%s', (fnName) => {
        const fn = (Querys as Record<string, unknown>)[fnName] as () => string;

        it('is exported as a function', () => {
            expect(typeof fn).toBe('function');
        });

        it('returns a non-empty string', () => {
            const sql = fn();
            expect(typeof sql).toBe('string');
            expect(sql.trim().length).toBeGreaterThan(10);
        });

        it('contains a recognized SQL keyword', () => {
            expect(SQL_KEYWORD_RE.test(fn())).toBe(true);
        });

        it('has balanced parentheses', () => {
            const sql = fn();
            expect(countChar(sql, '(')).toBe(countChar(sql, ')'));
        });

        it('has an even number of single quotes', () => {
            const sql = fn();
            expect(countChar(sql, "'") % 2).toBe(0);
        });

        it('does not contain unprintable control characters', () => {
            const sql = fn();
            // Allow tab, LF, CR; reject the rest below 0x20
            // eslint-disable-next-line no-control-regex
            expect(/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(sql)).toBe(false);
        });
    });

    describe('queryUpdatePurchaseLine (parametrized, 6 valid + 2 default cases)', () => {
        it.each(updatePurchaseLineCases)(
            'caseToApply=%i, userRole=%s produces a valid UPDATE',
            (caseToApply, userRole) => {
                const sql = Querys.queryUpdatePurchaseLine(caseToApply, userRole);

                expect(typeof sql).toBe('string');
                expect(sql.trim().length).toBeGreaterThan(10);
                expect(/^\s*UPDATE\b/i.test(sql)).toBe(true);
                expect(countChar(sql, '(')).toBe(countChar(sql, ')'));
                expect(countChar(sql, "'") % 2).toBe(0);
            },
        );

        it('uses REMARK_BUYER when userRole=BUYER and REMARK_SELLER when userRole=SELLER', () => {
            for (const caseId of [1, 2, 3]) {
                const buyerSql = Querys.queryUpdatePurchaseLine(caseId, 'BUYER');
                const sellerSql = Querys.queryUpdatePurchaseLine(caseId, 'SELLER');
                expect(buyerSql).toContain('REMARK_BUYER');
                expect(buyerSql).not.toContain('REMARK_SELLER');
                expect(sellerSql).toContain('REMARK_SELLER');
                expect(sellerSql).not.toContain('REMARK_BUYER');
            }
        });

        it('default branch (invalid caseToApply) falls back to case 1', () => {
            const fallbackBuyer = Querys.queryUpdatePurchaseLine(0, 'BUYER');
            const case1Buyer = Querys.queryUpdatePurchaseLine(1, 'BUYER');
            expect(fallbackBuyer).toBe(case1Buyer);
        });
    });
});
