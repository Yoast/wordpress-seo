// External dependencies.
import styled from "styled-components";

/* Yoast dependencies */
import { colors, rgba } from "@yoast/style-guide";

export const InputField = styled.input`
	&&& {
		padding: 0 8px;
		min-height: 34px;
		font-size: 1em;
		box-shadow: inset 0 1px 2px ${ rgba( colors.$color_black, 0.07 ) };
		border: 1px solid ${ colors.$color_input_border };
		border-radius: 0;

		&:focus {
			border-color: #5b9dd9;
			box-shadow: 0 0 2px ${ rgba( colors.$color_snippet_focus, 0.8 ) };
		}
	}
`;
