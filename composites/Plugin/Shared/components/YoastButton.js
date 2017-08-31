import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import { rgba } from "../../../../style-guide/helpers";

let buttonAnimations = `
	transition: box-shadow 150ms ease-out;

	&:hover,
	&:focus {
		box-shadow:
			0 4px 10px 0 ${ rgba( colors.$color_black, 0.2 ) },
			inset 0 0 0 100px ${ rgba( colors.$color_black, 0.1 ) };
	}

	&:active {
		transform: translateY( 1px );
		box-shadow: none;
	}
`;

/**
 * Returns a Button with the Yoast archetype style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const YoastBaseButton = styled.button`
	height: 48px;
	margin: 0;
	padding: 0 16px;
	border: 0;
	vertical-align: middle;
	border-radius: 4px;
	cursor: pointer;
	box-sizing: border-box;
	font: 400 14px/24px "Open Sans", sans-serif;
	text-transform: uppercase;
	box-shadow: 0 2px 8px 0 ${ rgba( colors.$color_black, 0.3 ) };
	overflow: visible;

	${ buttonAnimations };

	&::-moz-focus-inner {
		border-width: 0;
	}
`;

YoastBaseButton.propTypes = {
	type: PropTypes.string,
};

YoastBaseButton.defaultProps = {
	type: "button",
};

/**
 * Returns a Button with the Yoast style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const YoastButton = styled( YoastBaseButton )`
	color: ${ props => props.textColor };
	background: ${ props => props.backgroundColor };
	min-width: 152px;
	${ props => props.withTextShadow ? `text-shadow: 0 0 2px ${ colors.$color_black }` : "" }
`;

YoastButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	withTextShadow: PropTypes.bool,
};

YoastButton.defaultProps = {
	backgroundColor: colors.$color_green_medium_light,
	textColor: colors.$color_white,
	withTextShadow: true,
};
