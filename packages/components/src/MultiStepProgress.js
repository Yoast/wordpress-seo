// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";

// Internal dependencies.
import SvgIcon from "./SvgIcon";

const MultiStepProgressContainer = styled.div`
	padding: 8px;
`;

/**
 * Ordered list containing the steps.
 */
const MultiStepProgressList = styled.ol`
	padding: 0;
	margin: 0;

	list-style: none;
	counter-reset: multi-step-progress-counter;

	li {
		counter-increment: multi-step-progress-counter;
	}
`;

/**
 * List item for a single step.
 */
const MultiStepProgressListItem = styled.li`
	display: flex;
	align-items: baseline;

	margin: 8px 0;

	:first-child {
		margin-top: 0;
	}

	:last-child {
		margin-bottom: 0;
	}

	span {
		margin: 0 8px;
	}

	svg {
		position: relative;
		top: 2px;
	}

	::before {
		content: counter( multi-step-progress-counter );
		font-size: 12px;
		background: ${ colors.$color_pink_dark };
		border-radius: 50%;
		min-width: 16px;
		height: 16px;
		padding: 4px;
		color: ${ colors.$color_white };
		text-align: center;
	}
`;

/**
 * Specific list item for a step in pending state.
 */
const MultiStepProgressPendingStatus = styled( MultiStepProgressListItem )`
	span {
		color: ${ colors.$palette_grey_text_light };
	}

	::before {
		background-color: ${ colors.$palette_grey_medium_dark };
	}
`;

/**
 * Specific list item for a step in running state.
 */
const MultiStepProgressRunningStatus = styled( MultiStepProgressListItem )`
	::before {
		background-color: ${ colors.$palette_grey_medium_dark };
	}
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
		return (
			<MultiStepProgressContainer
				role="status"
				aria-live="polite"
				aria-relevant="additions text"
				aria-atomic={ true }
			>
				<MultiStepProgressList>
					{ this.props.steps.map( ( step ) => {
						switch ( step.status ) {
							case "running":
								return this.renderRunningState( step );
							case "failed":
								return this.renderFailedState( step );
							case "finished":
								return this.renderFinishedState( step );
							case "pending":
							default:
								return this.renderPendingState( step );
						}
					} ) }
				</MultiStepProgressList>
			</MultiStepProgressContainer>
		);
	}

	/**
	 * Renders a list item in pending state.
	 *
	 * @param {Object} step Step content.
	 *
	 * @returns {React.Element} The list item.
	 */
	renderPendingState( step ) {
		return (
			<MultiStepProgressPendingStatus key={ step.id }>
				<span>{ step.text }</span>
			</MultiStepProgressPendingStatus>
		);
	}

	/**
	 * Renders a list item in running state.
	 *
	 * @param {Object} step Step content.
	 *
	 * @returns {React.Element} The list item.
	 */
	renderRunningState( step ) {
		return (
			<MultiStepProgressRunningStatus key={ step.id }>
				<span>{ step.text }</span>
				<SvgIcon icon="loading-spinner" />
			</MultiStepProgressRunningStatus>
		);
	}

	/**
	 * Renders a list item in finished state.
	 *
	 * @param {Object} step Step content.
	 *
	 * @returns {React.Element} The list item.
	 */
	renderFinishedState( step ) {
		return (
			<MultiStepProgressListItem key={ step.id }>
				<span>{ step.text }</span>
				<SvgIcon icon="check" color={ colors.$color_green_medium_light } />
			</MultiStepProgressListItem>
		);
	}

	/**
	 * Renders a list item in failed state.
	 *
	 * @param {Object} step Step content.
	 *
	 * @returns {React.Element} The list item.
	 */
	renderFailedState( step ) {
		return (
			<MultiStepProgressListItem key={ step.id }>
				<span>{ step.text }</span>
				<SvgIcon icon="times" color={ colors.$color_red } />
			</MultiStepProgressListItem>
		);
	}
}

MultiStepProgress.defaultProps = {
	steps: [],
};

MultiStepProgress.propTypes = {
	steps: PropTypes.arrayOf( PropTypes.shape( {
		status: PropTypes.oneOf( [ "pending", "running", "finished", "failed" ] ).isRequired,
		text: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
	} ) ),
};

export default MultiStepProgress;
