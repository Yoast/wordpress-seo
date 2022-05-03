// External dependencies.
import { merge } from "lodash-es";

// Internal dependencies.
import Task from "./Task";


const DEFAULT_CONFIGURATION = {
	pollTime: 50,
};

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
	constructor( configuration = {} ) {
		this._configuration = merge( DEFAULT_CONFIGURATION, configuration );
		this._tasks = {
			standard: [],
			extensions: [],
			analyze: [],
			analyzeRelatedKeywords: [],
		};
		this._pollHandle = null;
		this._started = false;

		// Bind functions to this scope.
		this.startPolling = this.startPolling.bind( this );
		this.stopPolling = this.stopPolling.bind( this );
		this.tick = this.tick.bind( this );
	}

	/**
	 * Initialize polling.
	 *
	 * @returns {void}
	 */
	startPolling() {
		if ( this._started ) {
			return;
		}

		this._started = true;

		this.tick();
	}

	/**
	 * Do a tick and execute a task.
	 *
	 * @returns {void}
	 */
	tick() {
		this.executeNextTask()
			.then( () => {
				this._pollHandle = setTimeout( this.tick, this._configuration.pollTime );
			} );
	}

	/**
	 * Stop polling.
	 *
	 * @returns {void}
	 */
	stopPolling() {
		clearTimeout( this._pollHandle );
		this._pollHandle = null;
		this._started = false;
	}

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
	schedule( { id, execute, done, data, type } ) {
		const task = new Task( id, execute, done, data, type );
		switch ( type ) {
			case "customMessage":
			case "loadScript":
				this._tasks.extensions.push( task );
				break;
			case "analyze":
				this._tasks.analyze = [ task ];
				break;
			case "analyzeRelatedKeywords":
				this._tasks.analyzeRelatedKeywords = [ task ];
				break;
			default:
				this._tasks.standard.push( task );
		}
	}

	/**
	 * Retrieves the next task from the queue. Queues are sorted from lowest to highest priority.
	 *
	 * @returns {Task|null} The next task or null if none are available.
	 */
	getNextTask() {
		if ( this._tasks.extensions.length > 0 ) {
			return this._tasks.extensions.shift();
		}

		if ( this._tasks.analyze.length > 0 ) {
			return this._tasks.analyze.shift();
		}

		if ( this._tasks.analyzeRelatedKeywords.length > 0 ) {
			return this._tasks.analyzeRelatedKeywords.shift();
		}

		if ( this._tasks.standard.length > 0 ) {
			return this._tasks.standard.shift();
		}

		return null;
	}

	/**
	 * Executes the next task.
	 *
	 * @returns {Promise} Resolves once the task is done, with the result of the task.
	 */
	executeNextTask() {
		const task = this.getNextTask();
		if ( task === null ) {
			return Promise.resolve( null );
		}

		return Promise.resolve()
			.then( () => {
				return task.execute( task.id, task.data );
			} )
			.then( ( result ) => {
				task.done( task.id, result );

				return result;
			} );
	}
}
