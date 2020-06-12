import React from "react";
import PropTypes from "prop-types";
import "./buttons.css";

export const sharedButtonPropTypes = {
	isLink: PropTypes.bool,
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
	onClick: PropTypes.func,
	href: PropTypes.string,
};

export const sharedButtonDefaultProps = {
	isLink: false,
	children: null,
	onClick: null,
	href: null,
};

/**
 * Creates a button component.
 *
 * @param {Object} props The props
 * @param {bool} props.isLink When true, Button will return an anchor <a> rather than a <button>.
 *
 * @returns {ReactElemen} The Button component.
 */
export const Button = ( props ) => {
	// Split Button.js specific props from all other props.
	const {
		children,
		className,
		...restProps
	} = props;

	return <button
		className={ className }
		type="button"
		{ ...restProps }
	>
		{ children }
	</button>;
};

Button.propTypes = {
	...sharedButtonPropTypes,
	className: PropTypes.string,
};

Button.defaultProps = {
	...sharedButtonDefaultProps,
	className: "yoast-button",
};

/**
 * 
 * @param {*} props 
 */
export const ButtonStyledLink = ( props ) => {
	const {
		children,
		className,
		...restProps
	} = props;
	return <a
		className={ className }
		{ ...restProps }
	>
		{ children }
	</a>;
};

ButtonStyledLink.propTypes = {
	...sharedButtonPropTypes,
	className: PropTypes.string,
};

ButtonStyledLink.defaultProps = {
	...sharedButtonDefaultProps,
	className: "yoast-button",
};
