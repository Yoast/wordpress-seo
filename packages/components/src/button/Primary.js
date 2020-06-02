import React from "react";
import Button, { sharedButtonPropTypes, sharedButtonDefaultProps } from "./Button";

/**
 * A primary button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A primary button component.
 */
export const PrimaryButton = ( props ) => {
	return <Button
		className="yoast-button yoast-button--primary"
		{ ...props }
	/>;
};

PrimaryButton.propTypes = {
	...sharedButtonPropTypes,
};

PrimaryButton.defaultProps = {
	...sharedButtonDefaultProps,
};
