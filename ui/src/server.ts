import {readFile} from "./server/files";
import path from "path"
import https from "https"
import {
    AlertKeys,
    BaseChainKeys,
    HttpsOptions,
    isAlertsOverviewInput,
    monitorablesInfoResult,
    RedisHashes,
    RedisKeys
} from "./server/types";
import {
    CouldNotRetrieveDataFromRedis,
    InvalidBaseChains,
    InvalidEndpoint,
    InvalidJsonSchema,
    MissingKeysInBody,
    RedisClientNotInitialised
} from './server/errors'
import {
    allElementsInList,
    ERR_STATUS,
    errorJson,
    getElementsNotInList,
    missingValues,
    resultJson,
    SUCCESS_STATUS
} from "./server/utils";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {
    addPostfixToKeys,
    baseChainsRedis,
    getAlertKeys,
    getBaseChainKeys,
    getRedisHashes,
    RedisInterface
} from "./server/redis"

// Import certificate files
const httpsKey: Buffer = readFile(path.join(__dirname, '../../', 'certificates',
    'key.pem'));
const httpsCert: Buffer = readFile(path.join(__dirname, '../../',
    'certificates', 'cert.pem'));
const httpsOptions: HttpsOptions = {
    key: httpsKey,
    cert: httpsCert,
};

// Server configuration
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((err: any, req: express.Request, res: express.Response,
         next: express.NextFunction) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser.
    if (err instanceof SyntaxError && 'body' in err) {
        console.error(err);
        return res.sendStatus(ERR_STATUS); // Bad request
    }

    next();
});

// Connect with Redis
const redisHost = process.env.REDIS_IP;
const redisPort = parseInt(process.env.REDIS_PORT || "6379");
const redisDB = parseInt(process.env.REDIS_DB || "10");
const redisInterface = new RedisInterface(redisHost, redisPort, redisDB);
redisInterface.connect();

// Check the redis connection every 3 seconds. If the connection was dropped,
// re-connect.
setInterval(() => {
    redisInterface.connect();
}, 3000);

// ---------------------------------------- Redis Endpoints

// This endpoint expects a list of base chains (Cosmos, Substrate, or General)
// inside the body structure.
app.post('/server/redis/monitorablesInfo',
    async (req: express.Request, res: express.Response) => {
        console.log('Received POST request for %s', req.url);
        const {baseChains} = req.body;

        // Check if some required keys are missing in the body object, if yes
        // notify the client.
        const missingKeysList: string[] = missingValues({baseChains});
        if (missingKeysList.length !== 0) {
            const err = new MissingKeysInBody(...missingKeysList);
            res.status(err.code).send(errorJson(err.message));
            return;
        }

        // Check if the passed base chains are valid
        if (Array.isArray(baseChains)) {
            if (!allElementsInList(baseChains, baseChainsRedis)) {
                const invalidBaseChains: string[] = getElementsNotInList(
                    baseChains, baseChainsRedis);
                const err = new InvalidBaseChains(...invalidBaseChains);
                res.status(err.code).send(errorJson(err.message));
                return;
            }
        } else {
            const invalidBaseChains: any[] = getElementsNotInList([baseChains],
                baseChainsRedis);
            const err = new InvalidBaseChains(...invalidBaseChains);
            res.status(err.code).send(errorJson(err.message));
            return;
        }
        // Construct the redis keys
        const baseChainKeys: BaseChainKeys = getBaseChainKeys();
        const baseChainKeysPostfix: RedisKeys = addPostfixToKeys(
            baseChainKeys, '_');
        const constructedKeys: string[] = baseChains.map(
            (baseChain: string): string => {
                return baseChainKeysPostfix.monitorables_info + baseChain
            });

        let result: monitorablesInfoResult = resultJson({});
        if (redisInterface.client) {
            redisInterface.client.mget(constructedKeys, (err, values) => {
                if (err) {
                    console.error(err);
                    const retrievalErr = new CouldNotRetrieveDataFromRedis();
                    res.status(retrievalErr.code).send(errorJson(
                        retrievalErr.message));
                    return
                }
                baseChains.forEach(
                    (baseChain: string, i: number): void => {
                        result.result[baseChain] = JSON.parse(values[i])
                    });
                res.status(SUCCESS_STATUS).send(result);
                return;
            });
        } else {
            // This is done just for the case of completion, as it is very
            // unlikely to occur.
            const err = new RedisClientNotInitialised();
            res.status(err.code).send(errorJson(err.message));
            return;
        }
    });

// This endpoint expects a list of parent ids inside the body structure.
app.post('/server/redis/alertsOverview',
    async (req: express.Request, res: express.Response) => {
        console.log('Received POST request for %s', req.url);
        const {parentIds} = req.body;
        // Check if some required keys are missing in the body object, if yes
        // notify the client.
        const missingKeysList: string[] = missingValues({parentIds});
        if (missingKeysList.length !== 0) {
            const err = new MissingKeysInBody(...missingKeysList);
            res.status(err.code).send(errorJson(err.message));
            return;
        }

        // Check if the passed dict is valid
        if (!isAlertsOverviewInput(parentIds)) {
            const err = new InvalidJsonSchema("req.body.parentIds");
            res.status(err.code).send(errorJson(err.message));
            return;
        }

        // Construct the redis keys inside a JSON object indexed by parent hash
        const parentHashKeys: { [key: string]: string[] } = {};
        const redisHashes: RedisHashes = getRedisHashes();
        const alertKeys: AlertKeys = getAlertKeys();
        const alertKeysPostfix: RedisKeys = addPostfixToKeys(alertKeys, '_');
        const redisHashesPostfix: RedisKeys = addPostfixToKeys(redisHashes,
            '_');
        // TODO: Iterate through keys, compute hash, iterate through systems
        //     : and repos array and add to the list of keys. Note iterating
        //     : through keys and array is different
        // parentIds.forEach((parentId: string, i: number): void => {
        //     keysList = []
        //     const parentHash: string = redisHashesPostfix.parent + parentId;
        //     parentIds.systems.forEach((parentId: string, i: number): void => {
        //
        //     });
        //     parentIds.repos.forEach((parentId: string, i: number): void => {
        //
        //     });
        // });


        // const constructedKeys: string[] = baseChains.map(
        //     (baseChain: string): string => {
        //         return baseChainKeysPostfix.monitorables_info + baseChain
        //     });
        // TODO: Need to check that parentIds does have parentIds or test
        //     : whether it works or not (with redis error is good).
        // TODO: Need to conduct keys before executing them, then get
        //     : client.multi object and call it a number of time with hget,
        //     : then call it with execute.
        //
        //     let result: monitorablesInfoResult = resultJson({});
        //     if (redisInterface.client) {
        //         redisInterface.client.mget(constructedKeys, (err, values) => {
        //             if (err) {
        //                 console.error(err);
        //                 const retrievalErr = new CouldNotRetrieveDataFromRedis();
        //                 res.status(retrievalErr.code).send(errorJson(
        //                     retrievalErr.message));
        //                 return
        //             }
        //             baseChains.forEach(
        //                 (baseChain: string, i: number): void => {
        //                     result.result[baseChain] = JSON.parse(values[i])
        //                 });
        //             res.status(SUCCESS_STATUS).send(result);
        //             return;
        //         });
        //     } else {
        //         // This is done just for the case of completion, as it is very
        //         // unlikely to occur.
        //         const err = new RedisClientNotInitialised();
        //         res.status(err.code).send(errorJson(err.message));
        //         return;
        //     }
    });

// ---------------------------------------- Server defaults

app.get('/server/*', async (req: express.Request, res: express.Response) => {
    console.log('Received GET request for %s', req.url);
    const err: InvalidEndpoint = new InvalidEndpoint(req.url);
    res.status(err.code).send(errorJson(err.message));
});

app.post('/server/*', async (req: express.Request, res: express.Response) => {
    console.log('Received POST request for %s', req.url);
    const err = new InvalidEndpoint(req.url);
    res.status(err.code).send(errorJson(err.message));
});

// ---------------------------------------- PANIC UI

// Return the build at the root URL
app.get('/*', (req: express.Request, res: express.Response) => {
    console.log('Received GET request for %s', req.url);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ---------------------------------------- Start listen

const port: number = parseInt(process.env.UI_DASHBOARD_PORT || "9000");

(async () => {
    // Create Https server
    const server = https.createServer(httpsOptions, app);
    // Listen for requests
    server.listen(port, () => console.log('Listening on %s', port));
})().catch((err) => console.log(err));

// TODO: Need to add authentication, even to the respective middleware functions
