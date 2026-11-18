import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {string} [className=""] Extra class.
 * @param {JSX.node} children The content.
 * @param {boolean} [active=false] Whether the button is active.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {...any} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
const Button = ( {
	className = "",
	children,
	active = false,
	disabled = false,
	...props
} ) => (
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

export default Button;
