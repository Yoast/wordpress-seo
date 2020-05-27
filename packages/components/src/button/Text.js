import React from "react";
import PropTypes from "prop-types";
import Button, { buttonDefaultProps, buttonPropTypes } from "./Button";

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
	...buttonPropTypes,
	onClick: PropTypes.func.isRequired,
};

HideButton.defaultProps = {
	...buttonDefaultProps,
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
	...buttonPropTypes,
	href: PropTypes.string.isRequired,
};

HideLink.defaultProps = {
	...buttonDefaultProps,
};

/**
 * A hide button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} A hide button component.
 */
export const RemoveButton = ( props ) => {
	return <Button
		className="yoast-remove"
		{ ...props }
	/>;
};

RemoveButton.propTypes = {
	...buttonPropTypes,
	onClick: PropTypes.func.isRequired,
};

RemoveButton.defaultProps = {
	...buttonDefaultProps,
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
	...buttonPropTypes,
	href: PropTypes.string.isRequired,
};

RemoveLink.defaultProps = {
	...buttonDefaultProps,
};
