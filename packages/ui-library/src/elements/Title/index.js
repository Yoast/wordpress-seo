import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { keys, nth } from "lodash";

export const classNameMap = {
	size: {
		"1": "yst-text-2xl",
		"2": "yst-text-l",
		"3": "yst-text-sm",
		"4": "yst-text-base",
	},
};

const Title = ( {
	children,
	as: Component,
	size,
	className,
	...props
} ) => {
	return (
		<Component
			className={ cx(
				'yst-title',
				classNameMap.size[ size || nth( Component, 1 ) ],
				className,
			) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

Title.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	size: PropTypes.oneOf( keys( classNameMap.size ) )
};

Title.defaultProps = {
	as: "h1",
	className: "",
};

export default Title;
