import React from "react";
import PropTypes from "prop-types";
import Button, { buttonDefaultProps, buttonPropTypes } from "./Button";

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
	...buttonPropTypes,
	onClick: PropTypes.func.isRequired,
};

SecondaryButton.defaultProps = {
	...buttonDefaultProps,
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
	...buttonPropTypes,
	href: PropTypes.string.isRequired,
};

SecondaryLink.defaultProps = {
	...buttonDefaultProps,
};
