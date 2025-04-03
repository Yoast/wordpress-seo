/**
 * The scheduler is used in the analysis web worker to schedule tasks.
 *
 * Tasks have priorities based on their type.
 * When a task is executed, the task id and data are its arguments.
 * When a task is done, the task id and the execute result are its arguments.
 *
 * Start polling runs tick.
 * 1. Tick tries to run the next task.
 * 2. After the task is run, a timeout is set (configuration.pollTime).
 * 3. On the timeout execution, tick is called again (back to step 1).
 */
export default class Scheduler {
    /**
     * Initializes a Scheduler.
     *
     * @param {Object}  [configuration]             The configuration.
     * @param {number}  [configuration.pollTime]    The time in between each task
     *                                              poll in milliseconds,
     *                                              defaults to 50.
     */
    constructor(configuration?: {
        pollTime?: number | undefined;
    } | undefined);
    _configuration: {
        pollTime: number;
    } & {
        pollTime?: number | undefined;
    };
    _tasks: {
        standard: never[];
        extensions: never[];
        analyze: never[];
        analyzeRelatedKeywords: never[];
    };
    _pollHandle: NodeJS.Timeout | null;
    _started: boolean;
    /**
     * Initialize polling.
     *
     * @returns {void}
     */
    startPolling(): void;
    /**
     * Stop polling.
     *
     * @returns {void}
     */
    stopPolling(): void;
    /**
     * Do a tick and execute a task.
     *
     * @returns {void}
     */
    tick(): void;
    /**
     * Schedule a task.
     *
     * @param {Object}   task         The task object.
     * @param {number}   task.id      The task id.
     * @param {function} task.execute The function to run for task execution.
     * @param {function} task.done    The function to run when the task is done.
     * @param {Object}   task.data    The data object to execute with.
     * @param {string}   task.type    The type of the task.
     *
     * @returns {void}
     */
    schedule({ id, execute, done, data, type }: {
        id: number;
        execute: Function;
        done: Function;
        data: Object;
        type: string;
    }): void;
    /**
     * Retrieves the next task from the queue. Queues are sorted from lowest to highest priority.
     *
     * @returns {Task|null} The next task or null if none are available.
     */
    getNextTask(): Task | null;
    /**
     * Executes the next task.
     *
     * @returns {Promise} Resolves once the task is done, with the result of the task.
     */
    executeNextTask(): Promise<any>;
}
import Task from "./Task";
