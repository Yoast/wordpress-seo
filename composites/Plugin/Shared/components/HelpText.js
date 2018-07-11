/* External dependencies */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import colors from "../../../../style-guide/colors";

const YoastHelpText = styled.p`
	color: ${ props => props.color };
	font-size: ${ props => props.fontSize };
	margin-top: 0;
	
	a {
        color: ${ colors.$palette_blue_medium };
    }
`;

/**
 * Returns the HelpText component.
 *
 * @param {Object} props          Component props.
 * @param {string} props.text     The help text.
 * @param {string} props.color    The CSS color of the paragraph text.
 * @param {string} props.fontSize The CSS font-size of the paragraph text.
 *
 * @returns {ReactElement} HelpText component.
 */
export default class HelpText extends PureComponent {
	/**
	 * Renders a help text component.
	 *
	 * @returns {ReactElement} The rendered help text component.
	 */
	render() {
		const { text, color, fontSize } = this.props;

		return (
			<YoastHelpText color={ color } fontSize={ fontSize } >
				{ text }
			</YoastHelpText>
		);
	}
}

/**
 * React prop type for the help text.
 *
 * Use this in your components to pass along the text.
 */
export const helpTextPropType = {
	text: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ),
	color: PropTypes.string,
	fontSize: PropTypes.string,
};

HelpText.propTypes = {
	...helpTextPropType,
	text: helpTextPropType.text.isRequired,
};

HelpText.defaultProps = {
	color: colors.$color_grey_medium_dark,
	fontSize: "0.8em",
};
