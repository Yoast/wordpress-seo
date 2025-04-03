export default AnalysisWorkerWrapper;
/**
 * Analysis worker is an API around the Web Worker.
 */
declare class AnalysisWorkerWrapper {
    /**
     * Initializes the AnalysisWorkerWrapper class.
     *
     * @param {Worker} worker The worker to wrap.
     *
     * @constructor
     */
    constructor(worker: Worker);
    _worker: Worker;
    _requests: {};
    _autoIncrementedRequestId: number;
    /**
     * Initializes the worker with a configuration.
     *
     * @param {Object} configuration The configuration to initialize the worker
     *                               with.
     *
     * @returns {Promise} The promise of initialization.
     */
    initialize(configuration: Object): Promise<any>;
    /**
     * Analyzes the paper.
     *
     * @param {Object} paper           The paper to analyze.
     *
     * @returns {Promise} The promise of analyses.
     */
    analyze(paper: Object): Promise<any>;
    /**
     * Analyzes the paper.
     *
     * @param {Object} paper           The paper to analyze.
     * @param {Object} relatedKeywords The related keywords.
     *
     * @returns {Promise} The promise of analyses.
     */
    analyzeRelatedKeywords(paper: Object, relatedKeywords?: Object): Promise<any>;
    /**
     * Imports a script to the worker.
     *
     * @param {string} url The relative url to the script to be loaded.
     *
     * @returns {Promise} The promise of the script import.
     */
    loadScript(url: string): Promise<any>;
    /**
     * Sends a custom message to the worker.
     *
     * @param {string} name       The name of the message.
     * @param {string} data       The data of the message.
     * @param {string} pluginName The plugin that registered this type of message.
     *
     * @returns {Promise} The promise of the custom message.
     */
    sendMessage(name: string, data: string, pluginName: string): Promise<any>;
    /**
     * Runs the specified research in the worker. Optionally pass a paper.
     *
     * @param {string} name    The name of the research to run.
     * @param {Paper} [paper] The paper to run the research on if it shouldn't
     *                         be run on the latest paper.
     *
     * @returns {Promise} The promise of the research.
     */
    runResearch(name: string, paper?: any): Promise<any>;
    /**
     * Receives the messages and determines the action.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
     *
     * @param {MessageEvent} event              The post message event.
     * @param {Object}       event.data         The data object.
     * @param {string}       event.data.type    The action type.
     * @param {number}       event.data.id      The request id.
     * @param {string}       event.data.payload The payload of the action.
     *
     * @returns {void}
     */
    handleMessage({ data: { type, id, payload } }: MessageEvent): void;
    /**
     * Receives the message errors.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/Events/messageerror
     *
     * @param {MessageEvent} event The message event for the error that
     *                             occurred.
     *
     * @returns {void}
     */
    handleMessageError(event: MessageEvent): void;
    /**
     * Receives the errors.
     *
     * See:
     * https://developer.mozilla.org/en-US/docs/Web/API/AbstractWorker/onerror
     *
     * @param {Error} event The error event.
     *
     * @returns {void}
     */
    handleError(event: Error): void;
    /**
     * Increments the request id.
     *
     * @returns {number} The incremented id.
     */
    createRequestId(): number;
    /**
     * Creates a new request inside a Promise.
     *
     * @param {number} id     The request id.
     * @param {Object} [data] Optional extra data.
     *
     * @returns {Promise} The callback promise.
     */
    createRequestPromise(id: number, data?: Object | undefined): Promise<any>;
    /**
     * Sends a request to the worker and returns a promise that will resolve or reject once the worker finishes.
     *
     * @param {string} action  The action of the request.
     * @param {Object} payload The payload of the request.
     * @param {Object} [data]  Optional extra data.
     *
     * @returns {Promise} A promise that will resolve or reject once the worker finishes.
     */
    sendRequest(action: string, payload: Object, data?: Object | undefined): Promise<any>;
    /**
     * Sends a message to the worker.
     *
     * @param {string} type      The message type.
     * @param {number} id        The request id.
     * @param {Object} [payload] The payload to deliver.
     *
     * @returns {void}
     */
    send(type: string, id: number, payload?: Object | undefined): void;
}
