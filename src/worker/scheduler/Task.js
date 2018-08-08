// External dependencies.
const isFunction = require( "lodash/isFunction" );
const isNumber = require( "lodash/isNumber" );
const isObject = require( "lodash/isObject" );
const isString = require( "lodash/isString" );

class Task {
	/**
	 * Initializes a task.
	 *
	 * @param {number|string} id      The task identifier.
	 * @param {function}      execute Executes the job with the data.
	 * @param {function}      done    Callback for the scheduler.
	 * @param {Object}        [data]  Optional data for when executing the task.
	 */
	constructor( id, execute, done, data = {} ) {
		if ( ! ( isString( id ) || isNumber( id ) ) ) {
			throw new Error( "Task.id should be a number or a string." );
		}
		if ( ! isFunction( execute ) ) {
			throw new Error( "Task.execute should be a function." );
		}
		if ( ! isFunction( done ) ) {
			throw new Error( "Task.done should be a function." );
		}
		if ( ! isObject( data ) ) {
			throw new Error( "Task.data should be an object." );
		}
		this.id = id;
		this.execute = execute;
		this.done = done;
		this.data = data;
	}
}

export default Task;
