import { isFunction } from "lodash-es";
import { isNumber } from "lodash-es";
import { isObject } from "lodash-es";

class Task {
	/**
	 * Initializes a task.
	 *
	 * @param {number}   id      The task identifier.
	 * @param {function} execute Executes the job with the data.
	 * @param {function} done    Callback for the scheduler.
	 * @param {Object}   [data]  Optional data for when executing the task.
	 * @param {string}   type    The type of the task (analyze, analyzeRelatedKeywords, loadScript or customMessage)
	 */
	constructor( id, execute, done, data = {}, type = "analyze" ) {
		if ( ! isNumber( id ) ) {
			throw new Error( "Task.id should be a number." );
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
		this.type = type;
	}
}

export default Task;
