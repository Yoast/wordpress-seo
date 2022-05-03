import React from "react";
import styled from "styled-components";
import { Collapsible as CollapsibleComponent, Paper } from "@yoast/components";

const Inner = styled.div`
	padding: 16px;
`;

export default function Collapsible( { children, ...props } ) {
	return <Paper>
		<CollapsibleComponent initialIsOpen={ true } { ...props }>
			<Inner>
				{ children }
			</Inner>
		</CollapsibleComponent>
	</Paper>;
}
