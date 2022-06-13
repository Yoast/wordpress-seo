/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

const classNameMap = {
	variant: {
		info: "yst-badge--info",
		upsell: "yst-badge--upsell",
		plain: "yst-badge--plain",
	},
};

/**
 * @param {JSX.node} children Content of the Badge.
 * @param {string|function} [as="span"] Base component.
 * @param {string} [variant="info"] Badge variant. See `classNameMap` for the options.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Badge component.
 */
const Badge = ( {
	children,
	as: Component,
	variant,
	className,
	...props
} ) => (
	<Component
		className={ classNames(
			"yst-badge",
			classNameMap.variant[ variant ],
			className,
		) }
		{ ...props }
	>
		{ children }
	</Component>
);

Badge.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

Badge.defaultProps = {
	as: "span",
	variant: "info",
	className: "",
};

export default Badge;
