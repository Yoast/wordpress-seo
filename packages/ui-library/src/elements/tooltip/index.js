import { forwardRef } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";


/**
 * @param {string} text Content of the tooltip.
 * @param {string|JSX.node} [as] Base component.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Tooltip component.
 */
const Tooltip = forwardRef( ( { as: Component, className, text, ...props }, ref ) => (
	<Component
		ref={ ref }
		className={ classNames( "yst-tooltip", className ) }
		{ ...props }
	>
		{ text || null }
	</Component>
) );

const propTypes = {
	text: PropTypes.string,
	as: PropTypes.elementType,
	className: PropTypes.string,
};

Tooltip.propTypes = propTypes;

Tooltip.defaultProps = {
	content: "",
	as: "tooltip",
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;
