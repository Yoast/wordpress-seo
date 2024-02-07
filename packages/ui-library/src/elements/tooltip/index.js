import { forwardRef } from "@wordpress/element";
// import classNames from "classnames";
import PropTypes from "prop-types";

export const classNameMap = {
	variant: {
	},
	size: {
		"default": "",
		small: "yst-tooltip--small",
		large: "yst-tooltip--large",
	},
};

/**
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.node} [as] Base component.
 * @param {string} [variant] Tooltip variant. See `classNameMap.variant` for the options.?? TO BE CONSULTED
 * @param {string} [className] CSS class.
 * @param {boolean} isVisible Default state.
 * @param {Function} onHover Hover callback.
 * @param {boolean} [disabled] Disabled flag.
 * @returns {JSX.Element} Tooltip component.
 */

const Tooltip = forwardRef( ( { children, as: Component, variant, className, isVisible, ...props }, ref ) => {
	return (
		<>
			{ isVisible && (
				<div
					ref={ ref }
					// variant=""
					// className="yst-tooltip"
					className="yst-absolute yst-inline-block yst-z-10 yst-mb-14 yst-px-2 yst-p-2 yst-bg-gray-800 yst-text-white yst-rounded-lg"
					{ ...props }
				>
					{ children || null }
					<div
						className="yst-absolute yst-w-0 yst-h-0 yst-border-solid yst-border-t-7 yst-border-r-5 yst-border-b-transparent yst-border-l-5 yst-border-gray-800 yst-bottom-0 yst-left-1/2 yst-transform yst-translate-x-1/2"
					/>
				</div>
			) }
		</>
	);
} );

const propTypes = {
	variant: PropTypes.string,
	as: PropTypes.elementType,
	className: PropTypes.string,
	children: PropTypes.string,
	hidden: PropTypes.bool,
	onHover: PropTypes.func,
};

Tooltip.propTypes = propTypes;

Tooltip.defaultProps = {
	children: "",
	as: "div",
	isVisible: false,
	variant: "default",
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;
