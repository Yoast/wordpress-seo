import React from "react";
import PropTypes from "prop-types";
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
	onClick: PropTypes.func.isRequired,
};

HideButton.defaultProps = {
	...sharedButtonDefaultProps,
};

/**
 * A hide link.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A hide link component.
 */
export const HideLink = ( props ) => {
	return <Button
		className="yoast-hide"
		isLink={ true }
		{ ...props }
	/>;
};

HideLink.propTypes = {
	...sharedButtonPropTypes,
	href: PropTypes.string.isRequired,
};

HideLink.defaultProps = {
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
	onClick: PropTypes.func.isRequired,
};

RemoveButton.defaultProps = {
	...sharedButtonDefaultProps,
};

/**
 * A remove link.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A remove link component.
 */
export const RemoveLink = ( props ) => {
	return <Button
		className="yoast-remove"
		isLink={ true }
		{ ...props }
	/>;
};

RemoveLink.propTypes = {
	...sharedButtonPropTypes,
	href: PropTypes.string.isRequired,
};

RemoveLink.defaultProps = {
	...sharedButtonDefaultProps,
};
