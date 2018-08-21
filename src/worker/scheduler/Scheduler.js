// External dependencies.
const merge = require( "lodash/merge" );

// Internal dependencies.
import Task from "./Task";

const DEFAULT_CONFIGURATION = {
	queueSystem: "FIFO",
	pollTime: 50,
	resetQueue: false,
};

class Scheduler {
	/**
	 * Initializes a Scheduler.
	 *
	 * @param {Object}  [configuration]             The configuration.
	 * @param {string}  [configuration.queueSystem] FIFO or LIFO, defaults to the
	 *                                              latter.
	 * @param {number}  [configuration.pollTime]    The time in between each task
	 *                                              poll in milliseconds,
	 *                                              defaults to 50.
	 * @param {boolean} [configuration.resetQueue]  Whether to reset the queue
	 *                                              after each task, defaults to
	 *                                              false.
	 */
	constructor( configuration = {} ) {
		this._configuration = merge( DEFAULT_CONFIGURATION, configuration );
		this._tasks = [];
		this._pollHandle = null;

		// Bind functions to this scope.
		this.startPolling = this.startPolling.bind( this );
		this.stopPolling = this.stopPolling.bind( this );

		this.startPolling();
	}

	/**
	 * Initialize polling.
	 *
	 * @returns {void}
	 */
	startPolling() {
		this.executeNextTask();
		if ( this._configuration.resetQueue ) {
			this.resetQueue();
		}
		this._pollHandle = setTimeout( this.startPolling, this._configuration.pollTime );
	}

	/**
	 * Stop polling.
	 *
	 * @returns {void}
	 */
	stopPolling() {
		clearTimeout( this._pollHandle );
		this._pollHandle = null;
	}

	/**
	 * Schedule a task.
	 *
	 * @param {Object}   task         The task object.
	 * @param {number}   task.id      The task id.
	 * @param {function} task.execute The function to run for task execution.
	 * @param {function} task.done    The function to run when the task is done.
	 * @param {Object}   task.data    The data object to execute with.
	 *
	 * @returns {void}
	 */
	schedule( { id, execute, done, data } ) {
		const task = new Task( id, execute, done, data );
		this._tasks.push( task );
	}

	/**
	 * Retrieves the next task from the queue.
	 *
	 * @returns {Task|null} The next task or null if none are available.
	 */
	getNextTask() {
		if ( this._tasks.length === 0 ) {
			return null;
		}
		if ( this._configuration.queueSystem === "LIFO" ) {
			return this._tasks.pop();
		}
		return this._tasks.shift();
	}

	/**
	 * Executes the next task.
	 *
	 * @returns {void}
	 */
	async executeNextTask() {
		const task = this.getNextTask();
		if ( task === null ) {
			return;
		}

		const result = await task.execute( task.id, task.data );
		task.done( task.id, result );
	}

	/**
	 * Clears the task queue.
	 *
	 * @returns {void}
	 */
	resetQueue() {
		this._tasks = [];
	}
}

export default Scheduler;
