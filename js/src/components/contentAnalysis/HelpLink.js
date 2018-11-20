import { colors, utils } from "yoast-components";
import styled from "styled-components";

const HelpLink = utils.makeOutboundLink( styled.a`
	display: inline-block;
	position: relative;
	outline: none;
	text-decoration: none;
	border-radius: 100%;
	width: 24px;
	height: 24px;
	margin: -4px 0;
	vertical-align: middle;

	color: ${ colors.$color_help_text };
	
	&:hover,
	&:focus {
		color: ${ colors.$color_snippet_focus };	
	}
	
	// Overwrite the default blue active color for links.
	&:active {
		color: ${ colors.$color_help_text };	
	}

	&::before {
		position: absolute;
		top: 0;
		left: 0;
		padding: 2px;
		content: "\f223";
	}
` );

export default HelpLink;
