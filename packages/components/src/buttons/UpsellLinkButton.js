// External dependencies.
import styled from "styled-components";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";

/**
 * A link styled as an interactive upsell button.
 */
export const UpsellLinkButton = styled.a`
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	color: ${ colors.$color_black };
	white-space: nowrap;
	display: inline-flex;
	border-radius: 4px;
	background-color: ${ colors.$color_button_upsell };
	padding: 4px 8px 8px;
	box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
	border: none;
	text-decoration: none;
	font-size: inherit;

	&:hover,
	&:focus,
	&:active {
		color: ${ colors.$color_black };
		background: ${ colors.$color_button_upsell_hover };
	}

	&:active {
		background-color: ${ colors.$color_button_hover_upsell };
		transform: translateY( 1px );
		box-shadow: none;
		filter: none;
	}
`;
