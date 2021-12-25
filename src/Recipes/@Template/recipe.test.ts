import { log, LogLevel } from 'libx.js/build/modules/log';
import { Recipe_Name as Recipe } from '.';

// run
// $ yarn test src/recipes/<recipe-name>/recipe.test.ts

log.filterLevel = LogLevel.Fatal;

beforeEach(() => {});

describe('Recipe: <recipe-name>', () => {
    test('Test case: <recipe-test-case> - basic', async () => {
        const recipe = new Recipe();
        await recipe.setup();
        await recipe.run();
        await recipe.matrix.request('/test');
        const journal = recipe.getJournal();
        expect(journal).toEqual(['ctor', 'setup:start', 'setup:end', 'run:completed', 'request']);
        await recipe.shutdown();
    });
});
