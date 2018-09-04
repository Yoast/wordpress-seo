import { isEmpty } from "lodash-es";

/**
 * Sets sentence part passiveness to passive if no exception rules for the participle apply.
 *
 * @returns {void}
 */
export default function() {
	if ( isEmpty( this.getParticiple() ) ) {
		this.setSentencePartPassiveness( false );
		return;
	}

	this.setSentencePartPassiveness( this.isPassive() );
};
