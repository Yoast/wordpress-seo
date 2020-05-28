import React from "react";
import PropTypes from "prop-types";
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
	onClick: PropTypes.func.isRequired,
};

SecondaryButton.defaultProps = {
	...sharedButtonDefaultProps,
};

/**
 * A secondary link.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A secondary link component.
 */
export const SecondaryLink = ( props ) => {
	return <Button
		className="yoast-button yoast-button--secondary"
		isLink={ true }
		{ ...props }
	/>;
};

SecondaryLink.propTypes = {
	...sharedButtonPropTypes,
	href: PropTypes.string.isRequired,
};

SecondaryLink.defaultProps = {
	...sharedButtonDefaultProps,
};
