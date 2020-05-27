import React from "react";
import PropTypes from "prop-types";
import Button, { buttonDefaultProps, buttonPropTypes } from "./Button";

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
	...buttonPropTypes,
	onClick: PropTypes.func.isRequired,
};

PrimaryButton.defaultProps = {
	...buttonDefaultProps,
};

/**
 * A primary link.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A primary link component.
 */
export const PrimaryLink = ( props ) => {
	return <Button
		className="yoast-button yoast-button--primary"
		isLink={ true }
		{ ...props }
	/>;
};

PrimaryLink.propTypes = {
	...buttonPropTypes,
	href: PropTypes.string.isRequired,
};

PrimaryLink.defaultProps = {
	...buttonDefaultProps,
};
