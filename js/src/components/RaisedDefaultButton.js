import React from "react";
import RaisedButton from "material-ui/RaisedButton";

const RaisedDefaultButton = ( props ) => {
	let buttonProps = {
		primary: props.type === "primary",
		disableFocusRipple: true,
		disableTouchRipple: true,
		disableKeyboardFocus: true,
	};

	buttonProps[ "aria-label" ] = props.label;

	return (
		<RaisedButton { ...buttonProps } { ...props } />
	);
};

RaisedDefaultButton.propTypes = {
	type: React.PropTypes.string,
};

RaisedDefaultButton.defaultProps = {
	type: "",
};

export default RaisedDefaultButton;
