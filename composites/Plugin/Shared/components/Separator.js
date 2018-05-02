// External dependencies.
import styled from "styled-components";

// Internal dependencies.
import colors from "../../../../style-guide/colors";

/**
 * Styled component with the purpose to visually separate in the DOM
 *
 * @param {Object} props             The props.
 * @param {string} props.margin      The optional CSS margin.
 * @param {string} props.borderColor The optional CSS border color.
 *
 * @returns {ReactElement} The Separator styled component.
 */
export default styled.div`
	margin: ${ props => props.margin ? props.margin : "16px 0" };
	border: 0;
	border-bottom: 1px solid ${ props => props.borderColor ? props.borderColor : colors.$color_grey_light };
`;
