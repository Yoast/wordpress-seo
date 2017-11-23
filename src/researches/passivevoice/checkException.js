var isEmpty = require( "lodash/isEmpty" );

/**
 * Sets sentence part passiveness to passive if there is no exception.
 *
 * @returns {void}
 */
module.exports =  function() {
	if ( isEmpty( this.getParticiple() ) ) {
		this.setSentencePartPassiveness( false );
		return;
	}

	this.setSentencePartPassiveness( this.isPassive() );
};
