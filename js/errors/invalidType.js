/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 */
module.exports = function InvalidTypeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );
