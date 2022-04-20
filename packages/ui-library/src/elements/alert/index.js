import { CheckCircleIcon, ExclamationIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";

const classNameMap = {
	variant: {
		info: "yst-alert--info",
		warning: "yst-alert--warning",
		success: "yst-alert--success",
		error: "yst-alert--error",
	},
};

const iconMap = {
	success: CheckCircleIcon,
	warning: ExclamationIcon,
	info: InformationCircleIcon,
	error: XCircleIcon,
};

const roleMap = {
	alert: "alert",
	status: "status",
};

/**
 * @param {JSX.node} children Content of the Alert.
 * @param {string} role The role of the Alert.
 * @param {string|function} [as="span"] Base component.
 * @param {string} [variant="info"] Alert variant. See `classNameMap` for the options.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Alert component.
 */
const Alert = ( {
	children,
	role,
	as: Component,
	variant,
	className,
	...props
} ) => {
	const Icon = iconMap[ variant ];
	const svgAriaProps = useSvgAria();

	return (
		<Component
			className={ classNames(
				"yst-alert",
				classNameMap.variant[ variant ],
				className,
			) }
			role={ roleMap[ role ] }
			{ ...props }
		>
			<Icon className="yst-alert__icon" { ...svgAriaProps } />
			<div>
				{ children }
			</div>
		</Component>
	);
};

Alert.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
	role: PropTypes.oneOf( Object.keys( roleMap ) ),
};

Alert.defaultProps = {
	as: "span",
	variant: "info",
	className: "",
	role: "status",
};

export default Alert;
