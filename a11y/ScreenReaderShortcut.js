import React from "react";
import PropTypes from "prop-types";
import Styles from "./Styles";

/**
 * Renders a [Skiplink](http://webaim.org/techniques/skipnav/) that is only
 * shown when focused. It can be used to enable keyboard-only and screen reader
 * users to navigate quickly to the main content.
 *
 * @constructor
 */
class ScreenReaderShortcut extends React.Component {
	/**
	 * Sets initial focused state to false.
	 *
	 * @returns {void}
	 * @constructor
	 */
	constructor() {
		super();
		this.state = {
			focused: false,
		};
	}

	/**
	 * Sets the focused state to true.
	 * @returns {void}
	 */
	focus() {
		this.setState( { focused: true } );
	}

	/**
	 * Sets the focused state to false.
	 * @returns {void}
	 */
	blur() {
		this.setState( { focused: false } );
	}

	/**
	 * Gets the styles of the ScreenReaderShortcut depending on the state.
	 *
	 * @returns {Object} Styles The styles for the ScreenReaderShortcut
	 */
	getStyles() {
		if ( this.state.focused === true ) {
			return Styles.ScreenReaderText.focused;
		}
		return Styles.ScreenReaderText.default;
	}

	/**
	 * The render method for the ScreenReaderShortcut component.
	 *
	 * @returns {JSX} ScreenReaderShortcut The screen reader shortcut (or skiplink).
	 */
	render() {
		return (
			<a href={ "#" + this.props.anchor }
				className="screen-reader-shortcut"
				style={ this.getStyles() }
				onFocus={ this.focus.bind( this ) }
				onBlur={ this.blur.bind( this ) }>{ this.props.children }</a>
		);
	}
}

ScreenReaderShortcut.propTypes = {
	anchor: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
};

export default ScreenReaderShortcut;
