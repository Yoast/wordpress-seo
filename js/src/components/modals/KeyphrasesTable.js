/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";

/**
 * The Related Keyphrases table component.
 */
class KeyphrasesTable extends Component {
	/**
	 * Constructs the Related Keyphrases table.
	 *
	 * @param {Object} props The props for the Related Keyphrases table.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the Related Keyphrases table.
	 *
	 * @returns {React.Element} The Related Keyphrases table.
	 */
	render() {
		// This `fakeProp` within the h2 is temporary in this component first basic implementation and should be removed.
		return (
			<Fragment>
				<h2 id={ this.props.fakeProp }>Keyphrase table</h2>
				<p>The Keyphrase table will come here!</p>
			</Fragment>
		);
	}
}

KeyphrasesTable.propTypes = {
	fakeProp: PropTypes.string,
};

KeyphrasesTable.defaultProps = {
	fakeProp: null,
};

export default KeyphrasesTable;
