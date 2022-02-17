/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Spinner from "../Spinner";

const classNameMap = {
	variant: {
		primary: "yst-button--primary",
		secondary: "yst-button--secondary",
		error: "yst-button--error",
	},
	size: {
		"default": "",
		small: "yst-button--small",
		large: "yst-button--large",
	},
};

/**
 * @param {Object} props Props object.
 * @returns {JSX.Element} Button component.
 */
const Button = ( {
	children,
	as: Component,
	type,
	variant,
	size,
	isLoading,
	isDisabled,
	className,
	...props
} ) => (
	<Component
		type={ type || ( Component === "button" && "button" ) }
		disabled={ isDisabled }
		className={ classNames(
			"yst-button",
			classNameMap.variant[ variant ],
			classNameMap.size[ size ],
			className,
		) }
		{ ...props }
	>
		{ isLoading && <Spinner size={ size === "small" ? "3" : "4" } className="yst-mr-2" /> }
		{ children }
	</Component>
);

Button.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	type: PropTypes.oneOf( [ "button", "submit" ] ),
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	size: PropTypes.oneOf( Object.keys( classNameMap.size ) ),
	isLoading: PropTypes.bool,
	isDisabled: PropTypes.bool,
	className: PropTypes.string,
};

Button.defaultProps = {
	as: "button",
	type: undefined,
	variant: "primary",
	size: "default",
	isLoading: false,
	isDisabled: false,
	className: "",
};

export default Button;
