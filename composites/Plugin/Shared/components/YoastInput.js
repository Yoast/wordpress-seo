// External dependencies.
import styled from "styled-components";

// Internal dependencies.
import colors from "../../../../style-guide/colors.json";

export const YoastInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 1em 0;
`;

export const YoastInputLabel = styled.label`
	font-size: 1em;
	font-weight: bold;
	margin-bottom: 0.5em;
	display: block;
`;

export const YoastInputField = styled.input`
	border: 1px solid ${ colors.$color_input_border };
	padding: 0.75em;
	font-size: 1em;
	box-shadow: inset 0 1px 2px rgba(0,0,0,.07) !important ; 
`;
