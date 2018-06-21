/* External dependencies */
import styled from "styled-components";

/* Internal dependencies */
import colors from "../../../../style-guide/colors";
import { Button } from "../../Shared/components/Button";

const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

/**
 * Returns the color of the caret for an InputContainer based on the props.
 *
 * @param {Object} props The props for this InputContainer.
 * @returns {string} The color the caret should have.
 */
function getCaretColor( props ) {
	switch ( true ) {
		case props.isActive:
			return colors.$color_snippet_focus;

		case props.isHovered:
			return colors.$color_snippet_hover;

		default:
			return "transparent";
	}
}

/*
 * The caret is defined in this CSS because we cannot mount/unmount Draft.js.
 *
 * For some reason if you wrap the InputContainer with `.extend` or `styled()`
 * the ReplacementVariableEditor in the children will unmount and mount on every focus.
 * This means that Draft.js cannot keep track of the browser selection. Which
 * breaks the editor completely. We circumvent this by settings the caret styles
 * conditionally.
 */
export const InputContainer = styled.div.attrs( {
} )`
	padding: 3px 5px;
	border: 1px solid ${ ( props ) => props.isActive ? "#5b9dd9" : "#ddd" };
	box-shadow: ${ ( props ) => props.isActive ? "0 0 2px rgba(30,140,190,.8);" : "inset 0 1px 2px rgba(0,0,0,.07)" };
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
	position: relative;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	font-size: 14px;
	cursor: text;
`;

export const withCaretStyles = Component => {
	return Component.extend`
		&::before {
			display: block;
			position: absolute;
			top: -1px;
			left: -25px;
			width: 24px;
			height: 24px;
			background-image: url( ${ ( props ) => angleRight( getCaretColor( props ) ) });
			background-size: 25px;
			content: "";
		}
	`;
};

export const TitleInputContainer = InputContainer.extend`
	.public-DraftStyleDefault-block {
		// Don't use properties that trigger hasLayout in IE11.
		line-height: 24px;
	}
`;

export const DescriptionInputContainer = InputContainer.extend`
	min-height: 72px;
	padding: 2px 6px;
	line-height: 24px;

	.public-DraftEditorPlaceholder-root {
		color: ${ colors.$color_grey_text };
	}

	.public-DraftEditorPlaceholder-hasFocus {
		color: ${ colors.$color_grey_text };
	}
`;

export const FormSection = styled.div`
	margin: 24px 0 0 0;
`;

export const StyledEditor = styled.section`
	padding: ${ ( props ) => props.padding ? props.padding : "0 20px" };
`;

/**
 * A div element that looks like it can be interacted with like a label.
 */
export const SimulatedLabel = styled.div`
	cursor: pointer;
	font-size: 16px;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	margin-bottom: 9px;
`;

export const TriggerReplacementVariableSuggestionsButton = styled( Button )`
	box-shadow: none;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	fill: ${ colors.$color_grey_dark };
	padding-left: 8px;
	float: right;
	margin-top: -33px; // negative height
	height: 33px;
	border: 1px solid #dbdbdb;
	font-size: 13px;

	${ props => props.isSmallerThanMobileWidth && `
		float: none;
		margin-top: 0;
		margin-bottom: 2px;
	` }

	& svg {
		margin-right: 7px;
	}
`;
