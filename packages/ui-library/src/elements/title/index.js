/* eslint-disable no-undefined */
import PropTypes from "prop-types";
import classNames from "classnames";
import { forwardRef } from "@wordpress/element";

export const classNameMap = {
	size: {
		1: "yst-title--1",
		2: "yst-title--2",
		3: "yst-title--3",
		4: "yst-title--4",
		5: "yst-title--5",
	},
};

/**
 * @param {Object} props Props object.
 * @returns {JSX.Element} Title component.
 */
const Title = forwardRef( ( {
	children,
	as: Component,
	size,
	className,
	...props
}, ref ) => {
	return (
		<Component
			ref={ ref }
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
} );

const propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	size: PropTypes.oneOf( Object.keys( classNameMap.size ) ),
	className: PropTypes.string,
};

Title.propTypes = propTypes;

Title.defaultProps = {
	as: "h1",
	size: undefined,
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Title { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Title.defaultProps;
StoryComponent.displayName = "Title";

export default Title;
