import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {string} [className] Extra class.
 * @param {JSX.node} children The content.
 * @param {boolean} [active] Whether the button is active.
 * @param {boolean} [disabled] Whether the button is disabled.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
const Button = ( { className, children, active, disabled, ...props } ) => (
	<button
		type="button"
		className={ classNames(
			"yst-pagination__button",
			className,
			( active && ! disabled ) && "yst-pagination__button--active",
			disabled && "yst-pagination__button--disabled",
		) }
		disabled={ disabled }
		{ ...props }
	>
		{ children }
	</button>
);
Button.displayName = "Pagination.Button";
Button.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
};
Button.defaultProps = {
	className: "",
	active: false,
	// eslint-disable-next-line no-undefined
	disabled: undefined,
};

export default Button;
