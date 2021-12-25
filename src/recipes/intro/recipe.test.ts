import { log, LogLevel } from 'libx.js/build/modules/log';
import { helpers } from 'libx.js/build/helpers';
import { Recipe_Intro as Recipe } from './solution';

// run
// $ yarn test src/recipes/intro/recipe.test.ts

log.filterLevel = LogLevel.Fatal;

beforeEach(() => {});

describe('Recipe: Intro', () => {
    test('Test case: example - basic', async () => {
        const recipe = new Recipe();
        await recipe.setup();
        await recipe.run();
        await recipe.matrix.request('/test');
        await helpers.delay(1200);
        const journal = recipe.getJournal();
        expect(journal).toEqual(['ctor', 'setup:start', 'setup:end', 'run:completed', 'request', 'mq-11', 'db-11']);
        await recipe.shutdown();
    });
});
