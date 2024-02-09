import { forwardRef } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.node} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {boolean} isVisible Default state.
 * @param {boolean} [disabled] Disabled flag.
 * @returns {JSX.Element} Tooltip component.
 */

const Tooltip = forwardRef( ( { children, as: Component, className, isVisible, ...props }, ref ) => {
	return (
		<>
			{ isVisible && (
				<Component
					ref={ ref }
					className="yst-tooltip"
					{ ...props }
				>
					{ children || null }
				</Component>
			) }
		</>
	);
} );

const propTypes = {
	as: PropTypes.elementType,
	className: PropTypes.string,
	children: PropTypes.string,
};

Tooltip.propTypes = propTypes;

Tooltip.defaultProps = {
	children: "",
	as: "div",
	isVisible: false,
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;
