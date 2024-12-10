import classNames from "classnames";
import { keys } from "lodash";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Spinner from "../spinner";

export const classNameMap = {
	variant: {
		primary: "yst-button--primary",
		secondary: "yst-button--secondary",
		tertiary: "yst-button--tertiary",
		error: "yst-button--error",
		upsell: "yst-button--upsell",
	},
	size: {
		"default": "",
		small: "yst-button--small",
		large: "yst-button--large",
		"extra-large": "yst-button--extra-large",
	},
};

/**
 * @param {JSX.node} children Content of the button.
 * @param {string|JSX.Element} [as="button"] Base component.
 * @param {string} [type] Type attribute. Used when `as` is a `button`.
 * @param {string} [variant="primary"] Button variant. See `classNameMap` for the options.
 * @param {string} [size="default"] Button size. See `classNameMap` for the options.
 * @param {boolean} [isLoading=false] Whether to show a spinner.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Button component.
 */
const Button = forwardRef( ( {
	children,
	as: Component,
	type,
	variant,
	size,
	isLoading,
	disabled,
	className,
	...props
}, ref ) => (
	<Component
		// eslint-disable-next-line no-undefined
		type={ type || ( Component === "button" && "button" ) || undefined }
		disabled={ disabled }
		ref={ ref }
		className={ classNames(
			"yst-button",
			classNameMap.variant[ variant ],
			classNameMap.size[ size ],
			isLoading && "yst-cursor-wait",
			disabled && "yst-button--disabled",
			className,
		) }
		{ ...props }
	>
		{ isLoading && <Spinner size={ size === "small" ? "3" : "4" } className="yst-button--loading" /> }
		{ children }
	</Component>
) );

Button.displayName = "Button";
Button.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	type: PropTypes.oneOf( [ "button", "submit", "reset" ] ),
	variant: PropTypes.oneOf( keys( classNameMap.variant ) ),
	size: PropTypes.oneOf( keys( classNameMap.size ) ),
	isLoading: PropTypes.bool,
	disabled: PropTypes.bool,
	className: PropTypes.string,
};
Button.defaultProps = {
	as: "button",
	// eslint-disable-next-line no-undefined
	type: undefined,
	variant: "primary",
	size: "default",
	isLoading: false,
	disabled: false,
	className: "",
};

export default Button;
