import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../style-guide/colors.json";

const ProgressBarContainer = styled.progress`
	box-sizing: border-box;
	width: 100%;
	height: 8px;
	display: block;
	margin-top: 5px;
	border: none;
	appearance: none;

	::-webkit-progress-bar {
	   	background-color: ${ colors.$color_background_light };
	   	color: ${( { progressColor } ) => progressColor };
		border: 1px solid ${ colors.$color_input_border };
	}

	::-webkit-progress-value {
		background-color: ${ props => props.progressColor };
		transition: width 250ms;
	}

	::-moz-progress-bar {
		background-color: ${ ( { progressColor } ) => progressColor };
		border: 1px solid ${ colors.$color_input_border };
	}
	
	::-ms-fill {
		background-color: ${ ( { progressColor } ) => progressColor };
	}
}`;

/**
 * The ProgressBar component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The ProgressBar component.
 */
function ProgressBar( props ) {
	return (
		<ProgressBarContainer max={ props.max } value={ props.value } progressColor={ props.progressColor } aria-hidden="true" />
	);
}

ProgressBar.defaultProps = {
	max: 1,
	value: 0,
	progressColor: colors.$color_good,
};

ProgressBar.propTypes = {
	max: PropTypes.number,
	value: PropTypes.number,
	progressColor: PropTypes.string,
};

export default ProgressBar;
