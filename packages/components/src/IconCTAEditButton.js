import React from "react";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import SvgIcon from "./SvgIcon";

const IconButtonBase = styled.button`
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 32px;
	display: inline-flex;
	border: 1px solid ${ colors.$color_button_border };
	background-color: ${ props => props.background };
	box-shadow: ${ props => props.boxShadowColor };
	border-radius: 3px;
	cursor: pointer;
	padding: 0;
	height: 24px;
	&:hover {
		border-color: ${ props => props.hoverBorderColor };
	}
`;

/**
 * Returns the IconCTAEditButton component.
 *
 * @deprecated Use the Button component from @yoast/ui-library instead.
 *
 * @param {Object} props Component props.
 * @param {string} props.id The id of the button.
 * @param {string} props.ariaLabel The aria-label of the button.
 * @param {Function} props.onClick The function to call when the button is clicked.
 * @param {string} [props.boxShadowColor] The box shadow color of the button.
 * @param {string} [props.background] The background color of the button.
 * @param {string} [props.iconColor] The color of the icon.
 * @param {string} props.icon The name of the icon.
 * @param {string} [props.hoverBorderColor] The border color on hover.
 * @param {string} [props.className] The class name of the button.
 *
 * @returns {ReactElement} IconCTAEditButton component.
 */
const IconCTAEditButton = function( {
	boxShadowColor = colors.$color_button_border,
	background = colors.$color_button,
	iconColor = colors.$color_button_text,
	hoverBorderColor = colors.$color_white,
	...props
} ) {
	console.warn( "The IconCTAEditButton component has been deprecated and will be removed in a future release. Use the Button component from @yoast/ui-library instead." );

	return (
		<IconButtonBase
			type="button"
			onClick={ props.onClick }
			boxShadowColor={ boxShadowColor }
			background={ background }
			id={ props.id }
			aria-label={ props.ariaLabel }
			iconColor={ iconColor }
			hoverBorderColor={ hoverBorderColor }
			className={ props.className }
		>
			<SvgIcon
				icon={ props.icon }
				color={ iconColor }
				size="18px"
			/>
		</IconButtonBase>
	);
};

export default IconCTAEditButton;
