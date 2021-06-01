import styled from "styled-components";

import { getDirectionalStyle } from "@yoast/helpers";
import colors from "./colors";

/**
 * Returns an angleRight SVG.
 *
 * @param {string} color The desired color for the SVG.
 *
 * @returns {string} The SVG image.
 */
export const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

/**
 * Returns an angleLeft SVG.
 *
 * @param {string} color The desired color for the SVG.
 *
 * @returns {string} The SVG image.
 */
export const angleLeft = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 192 512" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 ' +
	'270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"/>' +
	"</svg>"
);

/**
 * Converts a hexadecimal color notation in a RGB notation.
 *
 * @param {string} hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 *
 * @returns {string} The color in RGB notation.
 */
function parseToRgb( hexColor ) {
	if ( typeof hexColor !== "string" ) {
		throw new Error( "Please pass a string representation of a color in hex notation." );
	}

	const hexRegex = /^#[a-fA-F0-9]{6}$/;
	const shortHexRegex = /^#[a-fA-F0-9]{3}$/;

	if ( hexColor.match( hexRegex ) ) {
		return parseInt( `${ hexColor[ 1 ] }${ hexColor[ 2 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 3 ] }${ hexColor[ 4 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 5 ] }${ hexColor[ 6 ] }`, 16 );
	}

	if ( hexColor.match( shortHexRegex ) ) {
		return parseInt( `${ hexColor[ 1 ] }${ hexColor[ 1 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 2 ] }${ hexColor[ 2 ] }`, 16 ) + ", " +
			parseInt( ` ${ hexColor[ 3 ] }${ hexColor[ 3 ] }`, 16 );
	}

	throw new Error( "Couldn't parse the color string. Please provide the color as a string in hex notation." );
}

/**
 * Returns a CSS color in RGBA format.
 *
 * @param {string}        hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 * @param {string|number} alpha    The alpha opacity value for the color, in a range from 0.0 to 1.0.
 *
 * @returns {string} The CSS color formatted as a RGBA value.
 */
export function rgba( hexColor, alpha ) {
	return "rgba( " + parseToRgb( hexColor ) + ", " + alpha + " )";
}

/**
 * Takes a component and extends it with caret styles.
 *
 * @param {Component} Component The component to be extended.
 *
 * @returns {Component} Component with added style.
 */
export const withCaretStyles = Component => {
	return styled( Component )`
		&::before {
			display: block;
			position: absolute;
			top: -1px;
			${ getDirectionalStyle( "left", "right" ) }: -25px;
			width: 24px;
			height: 24px;
			background-image: url( ${ getBackgroundImage } );
			background-size: 25px;
			content: "";
		}
	`;
};

/**
 * Gets the background image based on the color from the props and the language direction.
 *
 * @param {Object} props The component's props.
 *
 * @returns {string} The background image.
 */
function getBackgroundImage( props ) {
	const rtlStyle = getDirectionalStyle(
		angleRight( getCaretColor( props ) ),
		angleLeft( getCaretColor( props ) )
	);

	return rtlStyle( props );
}

/**
 * Returns the color of the caret for an InputContainer based on the props.
 *
 * @param {Object} props The props for this InputContainer.
 * @returns {string} The color the caret should have.
 */
function getCaretColor( props ) {
	if ( props.isActive ) {
		return colors.$color_snippet_focus;
	}

	if ( props.isHovered ) {
		return colors.$color_snippet_hover;
	}

	return "transparent";
}
