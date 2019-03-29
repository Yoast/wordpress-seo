/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import { colors } from "@yoast/style-guide";

const ExamplesContainer = styled.div`
	background-color: ${ props => props.backgroundColor };
	margin: 1em auto 0;
	padding: 0 0 1em;
	max-width: 1280px;
`;

ExamplesContainer.propTypes = {
	backgroundColor: PropTypes.string,
};

ExamplesContainer.defaultProps = {
	backgroundColor: colors.$color_white,
};

export default ExamplesContainer;
