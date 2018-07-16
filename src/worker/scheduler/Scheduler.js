// External dependencies.
import merge from "lodash/merge";

// Internal dependencies.
import Task from "./Task";

const DEFAULT_CONFIGURATION = {
	queueSystem: "LIFO",
};

class Scheduler {
	/**
	 * Initializes a Scheduler.
	 *
	 * @param worker                      The worker to use.
	 * @param [configuration]             The configuration.
	 * @param [configuration.queueSystem] FIFO or LIFO, defaults to the latter.
	 */
	constructor( worker, configuration = {} ) {
		this._worker = worker;
		this._configuration = merge( DEFAULT_CONFIGURATION, configuration );
		this._tasks = [];
		this._id = 0;
	}

	/**
	 * Schedule a task.
	 *
	 * @param {Object}   task         The task object.
	 * @param {function} task.execute The function to run for task execution.
	 * @param {function} task.done    The function to run when the task is done.
	 * @param {Object}   task.data    The data object to execute with.
	 *
	 * @returns {void}
	 */
	schedule( { execute, done, data } ) {
		const task = new Task( this.createId(), execute, done, data );
		this._tasks.push( task );
	}

	/**
	 * Increments internal counter and returns the latest.
	 *
	 * @returns {number} The unique id.
	 */
	createId() {
		this._id++;
		return this._id;
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
	 * Run while there are tasks in the queue.
	 *
	 * @returns {void}
	 */
	async processQueue() {
		let task;
		while( ( task = this.getNextTask() ) !== null ) {
			const result = await task.execute( task.data );
			task.done( result );
		}
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
