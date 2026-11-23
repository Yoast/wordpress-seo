// External dependencies.
import React from "react";

// Internal dependencies.
import Styles from "./Styles";

/**
 * Renders a div with text that is only shown to screen readers.
 * Can be used to provide some extra context for users with screen readers.
 *
 * @param {Object} props The view properties.
 * @param {string} props.children The text that is only shown to screen readers.
 * @returns {JSX} ScreenReaderText The div containing the screen reader text.
 * @constructor
 */
const ScreenReaderText = ( props ) => {
	return (
		<span className="screen-reader-text" style={ Styles.ScreenReaderText.default }>
			{ props.children }
		</span>
	);
};

export default ScreenReaderText;
