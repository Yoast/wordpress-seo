/* eslint-disable no-undefined */
import PropTypes from "prop-types";
import classNames from "classnames";

const classNameMap = {
	size: {
		1: "yst-text-2xl",
		2: "yst-text-l",
		3: "yst-text-sm",
		4: "yst-text-base",
	},
};

/**
 * @param {Object} props Props object.
 * @returns {JSX.Element} Title component.
 */
const Title = ( {
	children,
	as: Component,
	size,
	className,
	...props
} ) => {
	return (
		<Component
			className={ classNames(
				"yst-title",
				classNameMap.size[ size || Component[ 1 ] ],
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
	size: PropTypes.oneOf( Object.keys( classNameMap.size ) ),
	className: PropTypes.string,
};

Title.defaultProps = {
	as: "h1",
	size: undefined,
	className: "",
};

export default Title;
