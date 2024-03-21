import util from "util";

/**
 * Error that means that an argument should be passed that wasn't passed.
 *
 * @constructor
 *
 * @param {string} message The message for this error.
 *
 * @returns {void}
 */
function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits( MissingArgumentError, Error );

export default MissingArgumentError;
