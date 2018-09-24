import { connect } from "react-redux";
import React, { Fragment } from "react";
import styled from "styled-components";

import { H3, H4 } from "./headings";

const StatusBox = styled.div`
	width: 480px;
	height: 120px;
	background-color: #eaeaea;
	border: solid 1px rgba(10, 10, 10, 0.25);
	
	padding: 52px 0;
	
	text-align: center;
	font-size: 14px;
	font-weight: bold;
	font-style: normal;
	font-stretch: normal;
	line-height: normal;
	letter-spacing: 0.6px;
	color: #22282e;
`;

function WorkerStatus( { status } ) {
	return <Fragment>
		<H3>Status</H3>
		<StatusBox>
			{ status }
		</StatusBox>
		<H3>Worker communication</H3>
		<H4>To worker</H4>

		<H4>From worker</H4>

		<H3>Performance</H3>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			status: state.worker.status,
		};
	},
)( WorkerStatus );
