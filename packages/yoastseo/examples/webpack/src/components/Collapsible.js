import React from "react";
import styled from "styled-components";
import { Collapsible as CollapsibleComponent } from "yoast-components";
import { Paper as PaperUI } from "@yoast/components";

const Inner = styled.div`
	padding: 16px;
`;

export default function Collapsible( { children, ...props } ) {
	return <PaperUI>
		<CollapsibleComponent initialIsOpen={ true } { ...props }>
			<Inner>
				{ children }
			</Inner>
		</CollapsibleComponent>
	</PaperUI>;
}
