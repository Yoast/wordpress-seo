/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import colors from "../../../../style-guide/colors";

const YoastHelpText = styled.p`
	color: ${ props => props.color ? props.color : colors.$color_grey_medium_dark };
	font-size: ${ props => props.fontSize ? props.fontSize : "0.8em" };
`;

/**
 * Returns the HelpText component.
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} HelpText component.
 */
export default class HelpText extends React.Component {
	/**
	 * Renders a help text component.
	 *
	 * @returns {ReactElement} The rendered help text component.
	 */
	render() {
		const { text } = this.props;

		return (
			<YoastHelpText>
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
export const HelpTextPropType = PropTypes.oneOfType( [
	PropTypes.string,
	PropTypes.array,
] );

HelpText.propTypes = {
	text: HelpTextPropType.isRequired,
};
