import { log } from 'libx.js/build/modules/log';
import { node } from 'libx.js/build/node';
import { BaseRecipe, ModuleOptions as BaseRecipeOptions } from 'dojo-sdk/build/BaseRecipe';
import { DiskPersistencyManager } from 'dojo-sdk/build/DB/PersistencyManagers/Disk';
import { MemoryPersistencyManager } from 'dojo-sdk/build/DB/PersistencyManagers/Memory';
import { SchedulerTypes } from 'dojo-sdk/build/Scheduler/CronScheduler';
import { BaseService } from 'dojo-sdk/build/Servicer/BaseService';
import { IRequest, IResponse, ResponseTypes } from 'dojo-sdk/build/Servicer/Request';

// run: `$ node build/recipes/<recipeName> or `$ yarn test src/recipes/<recipeName>`
export class Recipe_Name extends BaseRecipe {
    public problemStatement = `
    ========================================
    This is where you describe the challenge.
    ========================================
    `;

    public constructor(options?: Partial<BaseRecipeOptions>) {
        super(options);

        this.journal.emit('ctor');
    }

    public async setup(): Promise<void> {
        this.journal.emit('setup:start');

        const initData = {
            col: {
                '618230709af3ade104bee1ff': {
                    a: 100,
                    _id: '618230709af3ade104bee1ff',
                },
            },
        };
        await this.matrix.addDB(new MemoryPersistencyManager(), initData, { continuosWrite: true });

        this.matrix.addScheduler(
            '*/5 * * * * *',
            async () => {
                log.i('tick');
            },
            SchedulerTypes.Recurring
        );

        const thisRecipe = this;
        this.matrix.addService(
            '/test',
            () =>
                new (class extends BaseService {
                    async handle(req: IRequest, res: IResponse) {
                        log.i('Service:', req);
                        thisRecipe.journal.emit('request');
                        res.body = { a: `hello!? from ${this.identifier}` };
                        res.type = ResponseTypes.OK;
                        return res;
                    }
                })(),
            1,
            10
        );

        // this.matrix.setupServiceProxy(); // pass calls through: http://localhost:3000/test?q=1

        this.journal.emit('setup:end');
    }

    public async run() {
        log.v('run!');
        this.journal.emit('run:completed');
    }
}

// Run this interactively if executed via `$ node build/Recipes/<recipe-name>/`
if (node.isCalledDirectly()) {
    node.catchErrors();
    (async () => {
        const recipe = new Recipe_Name();
        await recipe.setup();
        recipe.run();

        await node.prompts.waitForAnyKey('Press any key to finish this recipe...', false);

        log.i('Report: ', recipe.getJournal());
        process.exit(0); // force exit, required if run with `waitForAnyKey`
    })();
}
