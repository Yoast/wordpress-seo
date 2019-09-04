// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";

import SvgIcon from "./SvgIcon";

const SpinnerCSS = createGlobalStyle`
	.yoast-svg-icon-loading-spinner {
		animation: rotator 1.4s linear infinite;
	}

	@keyframes rotator {
		0% { transform: rotate( 0deg ); }
		100% { transform: rotate( 270deg ); }
	}

	.yoast-svg-icon-loading-spinner .path {
		stroke: #64a60a;
		stroke-dasharray: 187;
		stroke-dashoffset: 0;
		transform-origin: center;
		animation: dash 1.4s ease-in-out infinite;
	}

	@keyframes dash {
		0% { stroke-dashoffset: 187; }
		50% {
			stroke-dashoffset: 44;
			transform: rotate( 135deg );
		}
		100% {
			stroke-dashoffset: 187;
			transform: rotate( 450deg );
		}
	}
`;

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
		background: ${ colors.$color_pink_dark };
		border-radius: 50%;
		width: 16px;
		height: 16px;
		padding: 4px;
		color: ${ colors.$color_white };
		text-align: center;
		display: inline-block;
	}
`;

const MultiStepProgressPendingStatus = styled( MultiStepProgressListItem )`
	span {
		color: ${ colors.$palette_grey_text_light };
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
				{ this.props.steps.map( ( step ) => {
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
			<MultiStepProgressPendingStatus key="pending">
				<span>{ step.text }</span>
			</MultiStepProgressPendingStatus>
		);
	}

	renderBusyState( step ) {
		return (
			<MultiStepProgressBusyStatus key="123">
				<span>{ step.text }</span>
				<SvgIcon icon="loading-spinner" />
				<SpinnerCSS />
			</MultiStepProgressBusyStatus>
		);
	}

	renderFinishedState( step ) {
		return (
			<MultiStepProgressFinishedStatus key="234">
				<span>{ step.text }</span>
				<SvgIcon icon="check" color={ colors.$color_green_medium_light } />
			</MultiStepProgressFinishedStatus>
		);
	}

	renderFailedState( step ) {
		return (
			<MultiStepProgressFailedStatus key="345">
				<span>{ step.text }</span>
				<SvgIcon icon="times" color={ colors.$color_red } />
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
