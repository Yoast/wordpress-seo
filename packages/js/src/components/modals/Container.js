import styled from "styled-components";

import { Icon } from "@yoast/components";
import { getDirectionalStyle as getRtlStyle } from "@yoast/helpers";

export const ModalContainer = styled.div`
	min-width: 600px;

	@media screen and ( max-width: 680px ) {
		min-width: 0;
		width: 86vw;
	}
`;

export const ModalSmallContainer = styled.div`
	@media screen and ( min-width: 600px ) {
		max-width: 420px;
	}
`;

export const ModalIcon = styled( Icon )`
	float: ${ getRtlStyle( "right", "left" ) };
	margin: ${ getRtlStyle( "0 0 16px 16px", "0 16px 16px 0" ) };

	&& {
		width: 150px;
		height: 150px;

		@media screen and ( max-width: 680px ) {
			width: 80px;
			height: 80px;
		}
	}
`;
