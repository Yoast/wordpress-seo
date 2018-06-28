/* External dependencies */
import styled from "styled-components";

/* Internal dependencies */
import colors from "../../../../style-guide/colors";
import { Button } from "../../Shared/components/Button";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";

export const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

export const angleLeft = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 192 512" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 ' +
	'270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"/>' +
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
	flex: 0 1 100%;
	border: 1px solid ${ ( props ) => props.isActive ? "#5b9dd9" : "#ddd" };
	padding: 3px 5px;
	box-sizing: border-box;
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

function getBackgroundImage( props ) {
	let rtlStyle = getRtlStyle(
		angleRight( getCaretColor( props ) ),
		angleLeft( getCaretColor( props ) )
	);

	return rtlStyle( props );
}

export const withCaretStyles = Component => {
	return Component.extend`
		&::before {
			display: block;
			position: absolute;
			top: -1px;
			${ getRtlStyle( "left", "right" ) }: -25px;
			width: 24px;
			height: 24px;
			background-image: url( ${ getBackgroundImage } );
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
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	margin: 24px 0 0 0;
`;

export const StyledEditor = styled.section`
	padding: ${ ( props ) => props.padding ? props.padding : "0 20px" };
`;

/**
 * A div element that looks like it can be interacted with like a label.
 */
export const SimulatedLabel = styled.div`
	flex: 1 1 200px;
	min-width: 200px;
	cursor: pointer;
	font-size: 16px;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	margin: 4px 0;
`;

export const TriggerReplacementVariableSuggestionsButton = styled( Button )`
	box-shadow: none;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	padding-left: 8px;
	height: 33px;
	border: 1px solid #dbdbdb;
	font-size: 13px;

	& svg {
		${ getRtlStyle( "margin-right", "margin-left" ) }: 7px;
		fill: ${ colors.$color_grey_dark };
	}
`;
