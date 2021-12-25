import { log } from 'libx.js/build/modules/log';
import { node } from 'libx.js/build/node';
import { BaseRecipe, ModuleOptions as BaseRecipeOptions } from 'dojo-sdk/build/BaseRecipe';
import { DiskPersistencyManager } from 'dojo-sdk/build/DB/PersistencyManagers/Disk';
import { MemoryPersistencyManager } from 'dojo-sdk/build/DB/PersistencyManagers/Memory';
import { SchedulerTypes } from 'dojo-sdk/build/Scheduler/CronScheduler';
import { BaseService } from 'dojo-sdk/build/Servicer/BaseService';
import { IRequest, IResponse, ResponseTypes } from 'dojo-sdk/build/Servicer/Request';
import { ServiceProxy } from 'dojo-sdk/build/Servicer/ServiceProxy';

// run: `$ node build/recipes/intro/solution.js or `$ yarn test src/recipes/intro`
export class Recipe_Intro extends BaseRecipe {
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
        const db = await this.matrix.addDB(new MemoryPersistencyManager(), initData, { continuosWrite: true });

        this.matrix.addScheduler(
            '*/1 * * * * *',
            async () => {
                const content = await db.get('myCol', '112233');
                log.v('tick', content);
                thisRecipe.journal.emit('db-' + content.b);
                db.delete('myCol', '112233');
            },
            SchedulerTypes.Recurring
        );

        const mq = await this.matrix.addMQ('queue1', {
            treat: (item) => {
                log.v('This is my consumer treating item: ', item.payload.b);
                thisRecipe.journal.emit('mq-' + item.payload.b);
                db.insert('myCol', { _id: '112233', ...item.payload });
            },
        });

        const thisRecipe = this;
        this.matrix.addService(
            '/test',
            () =>
                new (class extends BaseService {
                    async handle(req: IRequest, res: IResponse) {
                        log.v('Service:', req);
                        thisRecipe.journal.emit('request');
                        mq.enqueue({ a: `hello!? from ${this.identifier}`, b: 11 });
                        res.body = 'message was enqueued';
                        res.type = ResponseTypes.OK;
                        return res;
                    }
                })(),
            1,
            10
        );

        this.journal.emit('setup:end');
    }

    public async run() {
        log.v('run!');
        this.journal.emit('run:completed');
    }
}

// Run this interactively if executed via `$ node build/recipes/intro`
if (node.isCalledDirectly()) {
    node.catchErrors();
    (async () => {
        const recipe = new Recipe_Intro();
        await recipe.setup();
        recipe.run();

        const proxyServer = new ServiceProxy(recipe.matrix, { port: 3000 }); // pass calls through: http://localhost:3000/test?q=1
        await proxyServer.init();

        await node.prompts.waitForAnyKey('Press any key to finish this recipe...', false);

        log.i('Report: ', recipe.getJournal());
        process.exit(0); // force exit, required if run with `waitForAnyKey`
    })();
}
