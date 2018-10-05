import React from "react";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";

/**
 * Creates the Raised Default Button.
 *
 * @param {Object} props Props passed to this element.
 * @returns {JSX.Element} Rendered RaisedDefaultButton Element.
 * @constructor
 */
const RaisedDefaultButton = ( props ) => {
	const buttonProps = {
		primary: props.type === "primary",
	};

	buttonProps[ "aria-label" ] = props.label;

	return (
		<RaisedButton { ...buttonProps } { ...props } />
	);
};

RaisedDefaultButton.propTypes = {
	type: PropTypes.string,
	disableFocusRipple: PropTypes.bool,
	disableTouchRipple: PropTypes.bool,
	disableKeyboardFocus: PropTypes.bool,
};

RaisedDefaultButton.defaultProps = {
	type: "",
	disableFocusRipple: true,
	disableTouchRipple: true,
	disableKeyboardFocus: true,
};

export default RaisedDefaultButton;
