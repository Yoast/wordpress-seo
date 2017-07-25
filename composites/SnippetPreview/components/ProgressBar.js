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
	-webkit-appearance: none;
	
	::-webkit-progress-bar {
	   	background-color: ${colors.$color_progress_background};
	   	color: ${( { color } ) => color };
		border: 1px solid ${colors.$color_input_border};
	}
	
	::-webkit-progress-value {
		background-color: ${ props => props.progressColor };
	}
`;

/**
 * The ProgressBar component
 *
 * @summary
 * A component that displays a progress bar
 */
class ProgressBar extends React.Component {
	render() {
		const { max, value, progressColor } = this.props;
		return (
			<ProgressBarContainer progressColor={ progressColor } aria-hidden="true" max={max} value={value}>
			</ProgressBarContainer>
		);
	}
}

ProgressBar.defaultProps = {
	max: 1,
	value: 0,
	progressColor: colors.$color_good,
}

ProgressBar.propTypes = {
	max: PropTypes.number,
	value: PropTypes.number,
	progressColor: PropTypes.string,
}

/**
 * Returns the ProgressBar component.
 *
 * @returns {ReactElement} The ProgressBar component.
 */
export default ProgressBar;
