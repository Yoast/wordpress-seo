import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

import StyledSection from "../StyledSection/StyledSection";
import SynonymsInput from "../../composites/Plugin/Shared/components/SynonymsInput";

class SynonymsSection extends React.Component {
	/**
	 * Constructs a SynonymsField component
	 *
	 * @param {Object} props          The props for this input field component.
	 * @param {string} props.id       The id of the SynonymsField.
	 * @param {string} props.label    The label of the SynonymsField.
	 * @param {string} props.synonyms The initial synonyms passed to the state.
	 * @param {string} props.onChange The change event handler.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	render() {
		const { id, label, synonyms, onChange } = this.props;

		return (
			<StyledSection
				headingText={ label }
				headingIcon={ "key" }
			>
				<SynonymsInput
					id={ id }
					label={ label }
					synonyms={ synonyms }
					onChange={ onChange }
				/>
			</StyledSection>
		);
	}
}

SynonymsSection.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	synonyms: PropTypes.string,
	onChange: PropTypes.func,
};

SynonymsSection.defaultProps = {
	id: uniqueId( "yoast-synonyms-input-" ),
	synonyms: "",
};

export default SynonymsSection;
