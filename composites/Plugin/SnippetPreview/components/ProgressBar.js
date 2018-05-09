/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import colors from "../../../../style-guide/colors.json";

/**
 * The ProgressBar component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The ProgressBar component.
 */
const ProgressBar = styled.progress`
	box-sizing: border-box;
	width: 100%;
	height: 8px;
	display: block;
	margin-top: 8px;
	appearance: none;
	background-color: ${ props => props.backgroundColor };
	border: 1px solid ${ props => props.borderColor };

	::-webkit-progress-bar {
	   	background-color: ${ props => props.backgroundColor };
	}

	::-webkit-progress-value {
		background-color: ${ props => props.progressColor };
		transition: width 250ms;
	}

	::-moz-progress-bar {
		background-color: ${ props => props.progressColor };
	}
	
	::-ms-fill {
		background-color: ${ props => props.progressColor };
		border: 0;
	}
`;


ProgressBar.defaultProps = {
	max: 1,
	value: 0,
	progressColor: colors.$color_good,
	backgroundColor: colors.$color_background_light,
	borderColor: colors.$color_input_border,
	"aria-hidden": "true",
};

ProgressBar.propTypes = {
	max: PropTypes.number,
	value: PropTypes.number,
	progressColor: PropTypes.string,
	backgroundColor: PropTypes.string,
	borderColor: PropTypes.string,
	"aria-hidden": PropTypes.string,
};

export default ProgressBar;
