import React from "react";
import Button, { sharedButtonDefaultProps, sharedButtonPropTypes } from "./Button";

/**
 * A hide button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A hide button component.
 */
export const HideButton = ( props ) => {
	return <Button
		className="yoast-hide"
		{ ...props }
	/>;
};

HideButton.propTypes = {
	...sharedButtonPropTypes,
};

HideButton.defaultProps = {
	...sharedButtonDefaultProps,
};

/**
 * A hide sharedButton.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A hide sharedButton component.
 */
export const RemoveButton = ( props ) => {
	return <Button
		className="yoast-remove"
		{ ...props }
	/>;
};

RemoveButton.propTypes = {
	...sharedButtonPropTypes,
};

RemoveButton.defaultProps = {
	...sharedButtonDefaultProps,
};
