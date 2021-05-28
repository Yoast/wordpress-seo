// External dependencies.
import React, { Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

// Internal dependencies.
import { HeadingContainer } from "./Container";
import { H4 } from "./headings";

const StatusBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #eaeaea;
	border: solid 1px rgba(10, 10, 10, 0.25);
	padding: 24px 0;
	text-align: center;
	font-size: 14px;
	letter-spacing: 0.6px;
	color: #22282e;
`;

function WorkerStatus( { status } ) {
	return <Fragment>
		<HeadingContainer heading="H3" headingMarginTop="0" title="Status">
			<StatusBox>
				<strong>{ status }</strong>
			</StatusBox>
		</HeadingContainer>

		<HeadingContainer heading="H3" title="Worker communication">
			<H4>To worker</H4>
			<H4>From worker</H4>
		</HeadingContainer>

		<HeadingContainer heading="H3" title="Performance" />
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			status: state.worker.status,
		};
	},
)( WorkerStatus );
