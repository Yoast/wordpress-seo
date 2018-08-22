// External dependencies.
const merge = require( "lodash/merge" );
const isUndefined = require( "lodash/isUndefined" );

// Internal dependencies.
import Task from "./Task";

const DEFAULT_CONFIGURATION = {
	pollTime: 50,
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
	 */
	constructor( configuration = {} ) {
		this._configuration = merge( DEFAULT_CONFIGURATION, configuration );
		this._tasks = {
			customMessage: [],
			loadScript: [],
			analyze: [],
			analyzeRelatedKeywords: [],
		};
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
	schedule( { id, execute, done, data, type } ) {
		const task = new Task( id, execute, done, data, type );
		switch( type ) {
			case "customMessage": {
				this._tasks.customMessage.push( task );
				break;
			}
			case "loadScript": {
				this._tasks.loadScript.push( task );
				break;
			}
			case "analyzeRelatedKeywords": {
				this._tasks.analyzeRelatedKeywords = [];
				this._tasks.analyzeRelatedKeywords.push( task );
				break;
			}
			default: {
				this._tasks.analyze = [];
				this._tasks.analyze.push( task );
			}
		}
		console.log( "A new task was scheduled: ", task );
	}

	/**
	 * Retrieves the next task from the queue.
	 *
	 * @returns {Task|null} The next task or null if none are available.
	 */
	getNextTask() {
		if ( this._tasks.customMessage.length > 0 ) {
			console.log( "The next task will be", this._tasks.customMessage[ 0 ] );
			return this._tasks.customMessage.shift();
		}

		if ( this._tasks.loadScript.length > 0 ) {
			console.log( "The next task will be", this._tasks.loadScript[ 0 ] );
			return this._tasks.loadScript.shift();
		}

		if ( this._tasks.analyzeRelatedKeywords.length > 0 ) {
			console.log( "The next task will be", this._tasks.analyzeRelatedKeywords[ 0 ] );
			return this._tasks.analyzeRelatedKeywords.shift();
		}

		if ( this._tasks.analyze.length > 0 ) {
			console.log( "The next task will be", this._tasks.analyze[ 0 ] );
			return this._tasks.analyze.shift();
		}
	}

	/**
	 * Executes the next task.
	 *
	 * @returns {void}
	 */
	async executeNextTask() {
		const task = this.getNextTask();
		if ( isUndefined( task ) ) {
			return;
		}
		const result = await task.execute( task.id, task.data );
		task.done( task.id, result );
	}
}

export default Scheduler;
