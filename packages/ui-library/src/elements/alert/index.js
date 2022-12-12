import classNames from "classnames";
import PropTypes from "prop-types";
import { ValidationIcon, ValidationMessage } from "../validation";
import { forwardRef } from "@wordpress/element";

const classNameMap = {
	variant: {
		info: "yst-alert--info",
		warning: "yst-alert--warning",
		success: "yst-alert--success",
		error: "yst-alert--error",
	},
};

const roleMap = {
	alert: "alert",
	status: "status",
};

/**
 * @param {JSX.node} children Content of the Alert.
 * @param {string} [role] The role of the Alert.
 * @param {string|function} [as="span"] Base component.
 * @param {string} [variant="info"] Alert variant. See `classNameMap` for the options.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Alert component.
 */
const Alert = forwardRef( ( {
	children,
	role = "status",
	as: Component = "span",
	variant = "info",
	className = "",
	...props
}, ref ) => (
	<Component
		ref={ ref }
		className={ classNames(
			"yst-alert",
			classNameMap.variant[ variant ],
			className,
		) }
		role={ roleMap[ role ] }
		{ ...props }
	>
		<ValidationIcon variant={ variant } className="yst-alert__icon" />
		<ValidationMessage as="div" variant={ variant } className="yst-alert__message">
			{ children }
		</ValidationMessage>
	</Component>
) );

Alert.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
	role: PropTypes.oneOf( Object.keys( roleMap ) ),
};

export default Alert;
