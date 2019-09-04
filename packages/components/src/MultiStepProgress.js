// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import SvgIcon from "./SvgIcon";

const MultiStepProgressContainer = styled.ol`
	list-style: none;
	padding-left: 2px;
	counter-reset: multi-step-progress-counter;
	
	background: white;
	
	
	li {
		counter-increment: multi-step-progress-counter;
	}
`;

const MultiStepProgressListItem = styled.li`
	padding: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
	
	span {
		margin: 0 8px;
	}
	
	::before {
		content: counter( multi-step-progress-counter );
		font-size: 12px;
		background: purple;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		padding: 4px;
		color: white;
		text-align: center;
		display: inline-block;
	}
`;

const MultiStepProgressPendingStatus = styled( MultiStepProgressListItem )`
	span {
		color: lightslategray;
	}
`;

const MultiStepProgressBusyStatus = styled( MultiStepProgressListItem )`
`;

const MultiStepProgressFailedStatus = styled( MultiStepProgressListItem )`
`;

const MultiStepProgressFinishedStatus = styled( MultiStepProgressListItem )`
`;

/**
 * A component to track multiple steps in a process.
 */
class MultiStepProgress extends React.Component {

	/**
	 * Returns the rendered html.
	 *
	 * @returns {React.Element} The rendered html.
	 */
	render() {
		return(
			<MultiStepProgressContainer>
				{ this.props.steps.map( step => {
					switch ( step.status ) {
						case "running":
							return this.renderBusyState( step );
						case "failed":
							return this.renderFailedState( step );
						case "finished":
							return this.renderFinishedState( step );
						case "pending":
						default:
							return this.renderPendingState( step );
					}
				} ) }
			</MultiStepProgressContainer>
		);
	}

	renderPendingState( step ) {
		return (
			<MultiStepProgressPendingStatus>
				<span>{ step.text }</span>
			</MultiStepProgressPendingStatus>
		);
	}

	renderBusyState( step ) {
		return (
			<MultiStepProgressBusyStatus>
				<span>{ step.text }</span>
				<SvgIcon icon="loading-spinner" color="grey" />
			</MultiStepProgressBusyStatus>
		);
	}

	renderFinishedState( step ) {
		return (
			<MultiStepProgressFinishedStatus>
				<span>{ step.text }</span>
				<SvgIcon icon="check" color="green" />
			</MultiStepProgressFinishedStatus>
		);
	}

	renderFailedState( step ) {
		return (
			<MultiStepProgressFailedStatus>
				<span>{ step.text }</span>
				<SvgIcon icon="times" color="red" />
			</MultiStepProgressFailedStatus>
		);
	}
}

MultiStepProgress.defaultProps = {
	steps: [],
};

MultiStepProgress.propTypes = {
	steps: PropTypes.arrayOf( PropTypes.shape( {
		status: PropTypes.oneOf( [ "pending", "running", "finished", "failed" ] ),
		text: PropTypes.string,
	} ) ),
};

export default MultiStepProgress;
