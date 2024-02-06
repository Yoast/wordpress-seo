import { forwardRef } from "@wordpress/element";
import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Badge from "../badge";

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
 * @param {boolean} hidden Default state.
 * @param {Function} onHover Hover callback.
 * @param {boolean} [disabled] Disabled flag.
 * @returns {JSX.Element} Tooltip component.
 */
const Tooltip = forwardRef( ( { children, as: Component, variant, className, hidden, onHover, ...props }, ref ) => {
	const [ isShown, setIsShown ] = useState( false );

	return (
		<Badge
			as="button"
			variant="plain"
			onMouseEnter={ () => setIsShown( true ) }
			onMouseLeave={ () => setIsShown( false ) }
		> A badge
			{ children || null }

			{ isShown && (
				<Transition
					show={ isShown }
					enter="transition-opacity duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Popover
						ref={ ref }
						as={ Component }
						variant=""
						// className={ classNames( "yst-tooltip", className ) }
						className="absolute z-10 p-2 bg-gray-800 text-white rounded-md"
						{ ...props }
					>I am the tooltip
						{ children || null }
					</Popover>
				</Transition> ) }
		</Badge>
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
	as: "tooltip",
	hidden: false,
	onHover: () => {},
	variant: "default",
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Tooltip { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Tooltip.defaultProps;
StoryComponent.displayName = "Tooltip";

export default Tooltip;
