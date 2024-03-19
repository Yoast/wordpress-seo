import { forwardRef } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";

const positionClassNameMap = {
	top: "yst-tooltip--top",
	right: "yst-tooltip--right",
	bottom: "yst-tooltip--bottom",
	left: "yst-tooltip--left",
};

/**
 * @param {string} id ID.
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {string} [position] Position of the tooltip.
 * @returns {JSX.Element} Tooltip component.
 */

const Tooltip = forwardRef( ( { id, children, as: Component, className, position, ...props }, ref ) => {
	return (
		<Component
			ref={ ref }
			className={ classNames( "yst-tooltip",
				positionClassNameMap[ position ],
				className,
			) }
			role="tooltip"
			id={ id }
			{ ...props }
		>
			{ children || null }
		</Component>
	);
} );

const propTypes = {
	as: PropTypes.elementType,
	id: PropTypes.string,
	children: PropTypes.string,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
};

Tooltip.propTypes = propTypes;

Tooltip.defaultProps = {
	as: "div",
	children: "",
	className: "",
	position: "top",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;