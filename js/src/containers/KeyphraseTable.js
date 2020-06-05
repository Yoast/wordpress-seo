import React from "react";

/**
 * The Related Keyphrases Table component.
 */
class KeyphraseTable extends React.Component {
	/**
	 * Constructs the keyphrase table.
	 *
	 * @param {Object}   props                                   The props for the keyphrase table.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the keyphrase table.
	 *
	 * @returns {ReactElement} The keyphrase editor element.
	 */
	render() {
		return (
			<div>
				<h1> Keyphrase table </h1>
				<p> The Keyphrase table will come here ! </p>
			</div>
		);
	}
}

KeyphraseTable.propTypes = {

};

KeyphraseTable.defaultProps = {

};

export default KeyphraseTable;
