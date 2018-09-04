/**
 * Error that means that an argument should be passed that wasn't passed.
 *
 * @constructor
 *
 * @param {string} message The message for this error.
 *
 * @returns {void}
 */
export default function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
}

require( "util" ).inherits( module.exports, Error );
