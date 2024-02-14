import { forwardRef } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {boolean} isVisible Default state.
 * @returns {JSX.Element} Tooltip component.
 */

const Tooltip = forwardRef( ( { children, as: Component, className, isVisible, ...props }, ref ) => {
	return (
		<>
			{ isVisible && (
				<Component
					ref={ ref }
					as={ Component }
					isvisible={ isVisible }
					className={ classNames( "yst-tooltip", className ) }
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
	children: PropTypes.string,
	className: PropTypes.string,
};

Tooltip.propTypes = propTypes;

Tooltip.defaultProps = {
	as: "div",
	children: "",
	className: "",
	isVisible: false,
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;
