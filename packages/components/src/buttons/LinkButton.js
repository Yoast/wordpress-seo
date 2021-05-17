// External dependencies.
import styled from "styled-components";
import PropTypes from "prop-types";

// Yoast dependencies.
import { colors, rgba } from "@yoast/style-guide";

// Internal dependencies.
import { addButtonStyles } from "./Button";

/**
 * Returns a basic link styled like a button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled button.
 */
export const LinkButton = addButtonStyles(
	styled.a`
		text-decoration: none;
		color: ${ props => props.textColor };
		border-color: ${ props => props.borderColor };
		background: ${ props => props.backgroundColor };
		box-shadow: 0 1px 0 ${ props => rgba( props.boxShadowColor, 1 ) };
	`
);

LinkButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	borderColor: PropTypes.string,
	boxShadowColor: PropTypes.string,
	hoverColor: PropTypes.string,
	hoverBackgroundColor: PropTypes.string,
	hoverBorderColor: PropTypes.string,
	activeColor: PropTypes.string,
	activeBackgroundColor: PropTypes.string,
	activeBorderColor: PropTypes.string,
	focusColor: PropTypes.string,
	focusBackgroundColor: PropTypes.string,
	focusBorderColor: PropTypes.string,
	focusBoxShadowColor: PropTypes.string,
};

LinkButton.defaultProps = {
	backgroundColor: colors.$color_button,
	textColor: colors.$color_button_text,
	borderColor: colors.$color_button_border,
	boxShadowColor: colors.$color_button_border,
	hoverColor: colors.$color_button_text_hover,
	hoverBackgroundColor: colors.$color_button_hover,
	hoverBorderColor: colors.$color_button_border_hover,
	activeColor: colors.$color_button_text_hover,
	activeBackgroundColor: colors.$color_button,
	activeBorderColor: colors.$color_button_border_hover,
	focusColor: colors.$color_button_text_hover,
	focusBackgroundColor: colors.$color_white,
	focusBorderColor: colors.$color_blue,
	focusBoxShadowColor: colors.$color_blue_dark,
};
