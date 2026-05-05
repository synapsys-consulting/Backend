import * as dotenv from 'dotenv';
import { QueryTypes, Sequelize } from 'sequelize';
import * as Querys from '../src/models/queries.model';

dotenv.config();

const SQL_TYPE_RE = /^\s*(SELECT|UPDATE|DELETE|INSERT|CALL)\b/i;
const EXPLAINABLE = new Set(['SELECT', 'UPDATE', 'DELETE']);

function detectSqlType(sql: string): string {
    const m = sql.match(SQL_TYPE_RE);
    return m ? m[1].toUpperCase() : 'UNKNOWN';
}

function substitutePlaceholders(sql: string): string {
    // Sequelize uses $1, $2, ... — replace with literal 1 so MariaDB can parse it.
    // EXPLAIN does not execute the statement, so type mismatches don't matter.
    return sql.replace(/\$\d+/g, '1');
}

type QueryEntry = {
    code: string;
    fnName: string;
    sql: string;
};

function collectQueries(): QueryEntry[] {
    const entries: QueryEntry[] = [];

    const simple: Array<[string, string]> = [
        ['GETPROD', 'getProducts'],
        ['GETPRODTAG', 'getProductsWithTags'],
        ['GTPRODAVL', 'queryGetProductsAvailable'],
        ['GTPRODAVPT', 'queryGetProductsAvailableWithPartnerId'],
        ['GTPRDAVPC', 'queryGetProductsAvailableWithPartnerIdProcedureCall'],
        ['GTPRODAVNP', 'queryGetProductsAvailableWithOutPartnerId'],
        ['GTPRODAVPR', 'getProductAvailWithProductId'],
        ['GTPRCHSEQ', 'queryPurchaseSequence'],
        ['GTPRCHUSRO', 'queryGetPurchaseByUserIdOldVersion'],
        ['GTPRCHUSR', 'queryGetPurchaseByUserId'],
        ['GTPRCHLNO', 'queryGetPurchaseLinesByOrderIdOld'],
        ['GTPRCHLN', 'queryGetPurchaseLinesByOrderId'],
        ['GTSTPRCH', 'queryGetStatusPurchase'],
        ['UPDPRCHST', 'queryUpdatePurchaseState'],
        ['UPDPLNST', 'queryUpdatePurchaseLineState'],
        ['STTRNSTODP', 'getStatusToTransitionToDeprecated'],
        ['STTRNSTO', 'getStatusToTransitionTo'],
        ['GTBANPRQT', 'getBanPriceUndBanQuantityValues'],
        ['INSPRCH', 'queryInsertPurchased'],
        ['GTTRNSEQ', 'queryTransactionsSequence'],
        ['INSTRN', 'querySaveTransaction'],
        ['UPDPRDAVL', 'updateProductsAvail'],
        ['INSMRKTRN', 'addMarkedPruductsToTransactions'],
        ['GTMRKTRN', 'queryMarkedPruductsToTransactions'],
        ['UPDSTKAVL', 'updateStockProductAvail'],
        ['GTDFLOGAD', 'getDefaultLogisticAddress'],
        ['GTDFLOGPR', 'getDefaultLogisticAddressByPersoneId'],
        ['GTROLEUSR', 'getRoleByUser'],
        ['GTADDRS', 'getAdresses'],
        ['GTTAXTYPE', 'getTaxType'],
        ['GTUNITTYP', 'getUnitType'],
        ['GTPROVID', 'getProviders'],
        ['GTPRTNRS', 'getPartners'],
        ['GTPRODTYP', 'getProductTypes'],
        ['INSPROD', 'queryInsertNewProduct'],
        ['GTPRODSEQ', 'queryNewProductSequence'],
        ['GTSHIFTS', 'getShifts'],
    ];

    for (const [code, fnName] of simple) {
        const fn = (Querys as Record<string, unknown>)[fnName] as () => string;
        entries.push({ code, fnName, sql: fn() });
    }

    const upl = Querys.queryUpdatePurchaseLine;
    const variants: Array<[string, number, string]> = [
        ['UPDPL1B', 1, 'BUYER'],
        ['UPDPL1S', 1, 'SELLER'],
        ['UPDPL2B', 2, 'BUYER'],
        ['UPDPL2S', 2, 'SELLER'],
        ['UPDPL3B', 3, 'BUYER'],
        ['UPDPL3S', 3, 'SELLER'],
    ];
    for (const [code, c, role] of variants) {
        entries.push({
            code,
            fnName: `queryUpdatePurchaseLine(${c},'${role}')`,
            sql: upl(c, role),
        });
    }

    return entries;
}

describe('queries.model.ts — EXPLAIN against live database (level 2)', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        if (!process.env.DB || !process.env.USUARIO || !process.env.HOST) {
            throw new Error(
                'Required env vars (DB, USUARIO, HOST) not set. Make sure .env is configured before running this test.',
            );
        }

        sequelize = new Sequelize(
            process.env.DB,
            process.env.USUARIO,
            process.env.PASSWORD,
            {
                host: process.env.HOST,
                dialect: 'mariadb',
                logging: false,
                pool: { max: 2, min: 0, acquire: 30000, idle: 10000 },
            },
        );

        await sequelize.authenticate();
    }, 30000);

    afterAll(async () => {
        if (sequelize) {
            await sequelize.close();
        }
    });

    const allQueries = collectQueries();

    describe.each(allQueries)('$code ($fnName)', ({ sql }) => {
        const type = detectSqlType(sql);

        if (!EXPLAINABLE.has(type)) {
            // INSERT and CALL do not support EXPLAIN safely. Document the skip.
            it.skip(`is ${type}; EXPLAIN not supported, skipping`, () => {
                /* skipped */
            });
            return;
        }

        it(`is ${type} and EXPLAIN parses without error`, async () => {
            const explainSql = `EXPLAIN ${substitutePlaceholders(sql)}`;
            const result = await sequelize.query(explainSql, {
                type: QueryTypes.SELECT,
                raw: true,
            });
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });
});
