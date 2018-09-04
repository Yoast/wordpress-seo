import { Collapsible as CollapsibleComponent } from "yoast-components";
import PaperUI from "yoast-components/composites/basic/Paper";
import React from "react";
import styled from "styled-components";

const Inner = styled.div`
	padding: 0 24px 24px;
`;

const PaddedCollapsible = styled( CollapsibleComponent )`
	margin: 16px 0; 
`;

export default function Collapsible( { children, ...props } ) {
	return <PaperUI>
		<PaddedCollapsible { ...props } initialIsOpen={ true }>
			<Inner>
				{ children }
			</Inner>
		</PaddedCollapsible>
	</PaperUI>;
}
