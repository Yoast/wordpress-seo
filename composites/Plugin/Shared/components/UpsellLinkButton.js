import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";

export const UpsellLinkButton = styled.a`
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	cursor: pointer;
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
	
	:active {
		position: relative;
  		top: 2px;
		background-color: ${ colors.$color_button_hover_upsell };
		box-shadow: none;
		filter: none;
	}
`;


