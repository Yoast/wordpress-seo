import React from "react";
import styled from "styled-components";
import { get } from "lodash-es";

import * as headings from "./headings";

export const Container = styled.div`
	margin-top: ${ props => props.marginTop ? props.marginTop : "16px" };
	margin-right: ${ props => props.marginRight ? props.marginRight : "0" };
	margin-bottom: ${ props => props.marginBottom ? props.marginBottom : "0" };
	margin-left: ${ props => props.marginLeft ? props.marginLeft : "0" };
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-content: space-between;
	margin-top: ${ props => props.marginTop ? props.marginTop : "16px" };

	> * {
		flex: 1;

		&:not(:first-child) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
		&:not(:last-child) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
`;

export const HorizontalContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-content: space-between;
	align-items: center;
	margin-top: ${ props => props.marginTop ? props.marginTop : "16px" };

	> * {
		flex: 1;

		&:not(:first-of-type) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
		&:not(:last-of-type) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
`;

export const HeadingContainer = function( { headingMarginTop = "16px", heading = "H2", title = "", children = [] } ) {
	const Heading = get( headings, heading, "H2" );

	return <Container marginTop={ headingMarginTop }>
		<Heading>{ title }</Heading>
		<Container>
			{ children }
		</Container>
	</Container>;
};
