import React from "react";
import RaisedButton from "material-ui/RaisedButton";

/**
 * Creates the Raised Default Button.
 *
 * @param {Object} props Props passed to this element.
 * @returns {JSX.Element} Rendered RaisedDefaultButton Element.
 * @constructor
 */
const RaisedDefaultButton = ( props ) => {
	let buttonProps = {
		primary: props.type === "primary",
	};

	buttonProps[ "aria-label" ] = props.label;

	return (
		<RaisedButton { ...buttonProps } { ...props } />
	);
};

RaisedDefaultButton.propTypes = {
	type: React.PropTypes.string,
	disableFocusRipple: React.PropTypes.bool,
	disableTouchRipple: React.PropTypes.bool,
	disableKeyboardFocus: React.PropTypes.bool,
};

RaisedDefaultButton.defaultProps = {
	type: "",
	disableFocusRipple: true,
	disableTouchRipple: true,
	disableKeyboardFocus: true,
};

export default RaisedDefaultButton;
