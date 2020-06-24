import React from "react";
import Button, { sharedButtonPropTypes, sharedButtonDefaultProps } from "./Button";

/**
 * A secondary button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A secondary button component.
 */
export const SecondaryButton = ( props ) => {
	return <Button
		className="yoast-button yoast-button--secondary"
		{ ...props }
	/>;
};

SecondaryButton.propTypes = {
	...sharedButtonPropTypes,
};

SecondaryButton.defaultProps = {
	...sharedButtonDefaultProps,
};
