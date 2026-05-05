/**
 * Catálogo de queries migradas a la tabla KRC_QUERY (SCENARIO='K').
 *
 * Este fichero es la fuente de verdad para el mapeo:
 *   QUERY_CODE → función de queries.model.ts (fallback)
 *
 * Se usa tanto en runtime (queriesLoader) como en los scripts de migración.
 */
import * as Querys from './queries.model';

export type Entry = {
    code: string;
    fnName: string;
    args?: [number, string];
    name: string;
    description: string;
    functionality: string;
};

export const ENTRIES: Entry[] = [
    {
        code: 'GETPROD',
        fnName: 'getProducts',
        name: 'Catálogo completo de productos (top 10)',
        description: 'SELECT con todos los JOINs sobre KRC_PRODUCT, limitado a PRODUCT_ID <= 10',
        functionality: 'Catálogo demo',
    },
    {
        code: 'GTPRODAVL',
        fnName: 'queryGetProductsAvailable',
        name: 'Productos disponibles con stock',
        description: 'SELECT productos disponibles agregando QUANTITY > 0 sobre KRC_PRODUCT_AVAIL',
        functionality: 'Productos disponibles (genérico)',
    },
    {
        code: 'GTPRODAVPT',
        fnName: 'queryGetProductsAvailableWithPartnerId',
        name: 'Productos disponibles para partner',
        description: 'SELECT productos disponibles filtrados por PARTNER_ID = $1 (partner 1 + partner del usuario)',
        functionality: 'Listado tras login',
    },
    {
        code: 'GTPRODAVNP',
        fnName: 'queryGetProductsAvailableWithOutPartnerId',
        name: 'Productos disponibles sin login',
        description: 'SELECT productos disponibles del partner por defecto (PARTNER_ID = 1)',
        functionality: 'Listado sin login',
    },
    {
        code: 'GTPRODAVPR',
        fnName: 'getProductAvailWithProductId',
        name: 'Detalle de producto disponible',
        description: 'SELECT producto disponible filtrado por PRODUCT_ID = $1',
        functionality: 'Detalle de producto',
    },
    {
        code: 'GTPRCHSEQ',
        fnName: 'queryPurchaseSequence',
        name: 'Siguiente valor de SEQ_PURCHASE',
        description: 'Devuelve nextval de SEQ_PURCHASE y la fecha actual',
        functionality: 'Crear nueva compra',
    },
    {
        code: 'GTPRCHUSR',
        fnName: 'queryGetPurchaseByUserId',
        name: 'Compras del usuario',
        description: 'Lista compras del usuario o las que pueda ver según PARTNER_ID/ROLE',
        functionality: 'Pantalla "Mis compras"',
    },
    {
        code: 'GTPRCHLN',
        fnName: 'queryGetPurchaseLinesByOrderId',
        name: 'Líneas de compra por order_id',
        description: 'SELECT líneas de la compra filtradas por ORDER_ID + PROVIDER_NAME + USER_ID',
        functionality: 'Detalle de compra',
    },
    {
        code: 'GTSTPRCH',
        fnName: 'queryGetStatusPurchase',
        name: 'Estado consolidado de compra',
        description: 'Devuelve el ALL_STATUS resumido de una compra',
        functionality: 'Cabecera detalle compra',
    },
    {
        code: 'UPDPRCHST',
        fnName: 'queryUpdatePurchaseState',
        name: 'Cambiar estado de cabecera de compra',
        description: 'UPDATE STATUS_ID en KRC_PURCHASE para una compra completa',
        functionality: 'Acciones de compra',
    },
    {
        code: 'UPDPLNST',
        fnName: 'queryUpdatePurchaseLineState',
        name: 'Cambiar estado de línea de compra',
        description: 'UPDATE STATUS_ID en KRC_PURCHASE para una línea concreta',
        functionality: 'Acciones de línea',
    },
    {
        code: 'UPDPL1B',
        fnName: 'queryUpdatePurchaseLine',
        args: [1, 'BUYER'],
        name: 'Modificar línea: precio+cantidad (BUYER)',
        description: 'UPDATE precio y cantidad por el comprador, escribe en REMARK_BUYER',
        functionality: 'Edición de línea por comprador',
    },
    {
        code: 'UPDPL1S',
        fnName: 'queryUpdatePurchaseLine',
        args: [1, 'SELLER'],
        name: 'Modificar línea: precio+cantidad (SELLER)',
        description: 'UPDATE precio y cantidad por el vendedor, escribe en REMARK_SELLER',
        functionality: 'Edición de línea por vendedor',
    },
    {
        code: 'UPDPL2B',
        fnName: 'queryUpdatePurchaseLine',
        args: [2, 'BUYER'],
        name: 'Modificar línea: solo precio (BUYER)',
        description: 'UPDATE solo precio por el comprador',
        functionality: 'Edición de línea por comprador',
    },
    {
        code: 'UPDPL2S',
        fnName: 'queryUpdatePurchaseLine',
        args: [2, 'SELLER'],
        name: 'Modificar línea: solo precio (SELLER)',
        description: 'UPDATE solo precio por el vendedor',
        functionality: 'Edición de línea por vendedor',
    },
    {
        code: 'UPDPL3B',
        fnName: 'queryUpdatePurchaseLine',
        args: [3, 'BUYER'],
        name: 'Modificar línea: solo cantidad (BUYER)',
        description: 'UPDATE solo cantidad por el comprador',
        functionality: 'Edición de línea por comprador',
    },
    {
        code: 'UPDPL3S',
        fnName: 'queryUpdatePurchaseLine',
        args: [3, 'SELLER'],
        name: 'Modificar línea: solo cantidad (SELLER)',
        description: 'UPDATE solo cantidad por el vendedor',
        functionality: 'Edición de línea por vendedor',
    },
    {
        code: 'STTRNSTO',
        fnName: 'getStatusToTransitionTo',
        name: 'Estados destino permitidos',
        description: 'Lista DESTINATION_STATUS_ID a los que el usuario puede transicionar la compra',
        functionality: 'Botones de acción',
    },
    {
        code: 'GTBANPRQT',
        fnName: 'getBanPriceUndBanQuantityValues',
        name: 'BAN_PRICE / BAN_QUANTITY de un estado',
        description: 'SELECT flags de bloqueo de precio/cantidad para un estado destino',
        functionality: 'Edición de línea',
    },
    {
        code: 'INSPRCH',
        fnName: 'queryInsertPurchased',
        name: 'Insertar línea de compra',
        description: 'INSERT en KRC_PURCHASE (línea de compra inicial)',
        functionality: 'Confirmar compra',
    },
    {
        code: 'GTDFLOGAD',
        fnName: 'getDefaultLogisticAddress',
        name: 'Dirección logística por defecto del usuario',
        description: 'SELECT KRC_ADDRESS con ADDR_TYPE=L y STATUS_ID=D (default)',
        functionality: 'Pantalla de dirección',
    },
    {
        code: 'GTROLEUSR',
        fnName: 'getRoleByUser',
        name: 'Rol del usuario',
        description: 'SELECT ROLE_NAME en KRR_USER_ROLE para un USER_ID',
        functionality: 'Autorización',
    },
    {
        code: 'GTADDRS',
        fnName: 'getAdresses',
        name: 'Direcciones logísticas de un PERSONE_ID',
        description: 'SELECT de todas las direcciones logísticas de la persona',
        functionality: 'Gestión de direcciones',
    },
    {
        code: 'GTTAXTYPE',
        fnName: 'getTaxType',
        name: 'Tipos de impuesto (ESP)',
        description: 'SELECT TAX_TYPE de KRC_TAX_TYPE para España',
        functionality: 'Alta de producto',
    },
    {
        code: 'GTUNITTYP',
        fnName: 'getUnitType',
        name: 'Unidades de medida',
        description: 'SELECT ID_UNIT de DMD_UNIT (CVE_UNIT > 0)',
        functionality: 'Alta de producto',
    },
    {
        code: 'GTPROVID',
        fnName: 'getProviders',
        name: 'Proveedores activos',
        description: 'SELECT proveedores activos (PERSONE_TYPE=P)',
        functionality: 'Alta de producto',
    },
    {
        code: 'GTPRTNRS',
        fnName: 'getPartners',
        name: 'Partners activos',
        description: 'SELECT partners activos (PERSONE_TYPE=R)',
        functionality: 'Alta de producto',
    },
    {
        code: 'GTPRODTYP',
        fnName: 'getProductTypes',
        name: 'Tipos de producto del partner',
        description: 'SELECT PRODUCT_TYPE filtrado por PARTNER_ID = $1',
        functionality: 'Alta de producto',
    },
    {
        code: 'INSPROD',
        fnName: 'queryInsertNewProduct',
        name: 'Insertar nuevo producto',
        description: 'INSERT en KRC_PRODUCT con todos los campos',
        functionality: 'Alta de producto',
    },
    {
        code: 'GTPRODSEQ',
        fnName: 'queryNewProductSequence',
        name: 'Siguiente valor de SEQ_PRODUCT',
        description: 'Devuelve nextval de SEQ_PRODUCT y la fecha actual',
        functionality: 'Crear nuevo producto',
    },
    {
        code: 'GTSHIFTS',
        fnName: 'getShifts',
        name: 'Turnos del partner',
        description: 'SELECT SHIFT_ID de KRC_SHIFT filtrado por PARTNER_ID = $1',
        functionality: 'Configuración partner',
    },
];

export function resolveSql(entry: Entry): string {
    if (entry.args) {
        return Querys.queryUpdatePurchaseLine(entry.args[0], entry.args[1]);
    }
    const fn = (Querys as Record<string, unknown>)[entry.fnName];
    if (typeof fn !== 'function') {
        throw new Error(`Function ${entry.fnName} not found in queries.model`);
    }
    return (fn as () => string)();
}
