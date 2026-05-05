describe('Jest sanity check', () => {
    it('runs and reports success', () => {
        expect(1 + 1).toBe(2);
    });

    it('can import from src/', () => {
        const queries = require('../src/models/queries.model');
        expect(typeof queries.getProducts).toBe('function');
    });
});
