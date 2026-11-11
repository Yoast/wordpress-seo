import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import { withDefaults } from "./withDefaults";

const paperDefaults = {
	backgroundColor: colors.$color_white,
	minHeight: "0",
};

/**
 * Returns a Div with a paper style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The paper-styled div.
 */
const Paper = styled.div.attrs( withDefaults( paperDefaults ) )`
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	background-color: ${ props => props.backgroundColor };
	min-height: ${ props => props.minHeight };
`;

Paper.propTypes = {
	backgroundColor: PropTypes.string,
	minHeight: PropTypes.string,
};

// Kept for classic-runtime consumers; the `.attrs` above is what applies these on React 19.
Paper.defaultProps = paperDefaults;

export default Paper;
