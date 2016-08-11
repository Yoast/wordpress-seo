import React from "react";
import Styles from "./Styles";

/**
 * Renders a div with text that is only shown to screen readers.
 * Can be used to provide some extra context for users with screen readers.
 *
 * @param {Object} props The view properties.
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

ScreenReaderText.propTypes = {
	children: React.PropTypes.string.isRequired,
};

export default ScreenReaderText;
