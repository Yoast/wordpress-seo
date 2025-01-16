import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext } from "react";
import Tooltip from "../../elements/tooltip";
import { useToggleState } from "../../hooks";

/**
 * @typedef {Object} TooltipContextValue
 * @property {boolean} isVisible Whether the tooltip is visible.
 * @property {function} show Show the tooltip.
 * @property {function} hide Hide the tooltip.
 */

/**
 * @type {React.Context<TooltipContextValue>}
 */
const TooltipContext = createContext( {
	isVisible: false,
	show: noop,
	hide: noop,
} );

/**
 * @returns {TooltipContextValue} The value of the Tooltip context.
 */
export const useTooltipContext = () => useContext( TooltipContext );

/**
 * Manages the visibility of the tooltip.
 * - It provides the isVisible boolean and show and hide functions.
 * - It adds a keydown event listener to hide the tooltip when the user presses Escape.
 * - It contains the styling to center and control the tooltip visibility.
 * @param {JSX.ElementClass} [as="span"] Base component.
 * @param {string} [className] CSS class.
 * @param {JSX.node} [children] The tooltip trigger and tooltip.
 * @returns {JSX.Element} The element.
 */
export const TooltipContainer = ( { as: Component = "span", className, children } ) => {
	const [ isVisible, , , show, hide ] = useToggleState( false );

	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === "Escape" && isVisible ) {
			hide();
			event.stopPropagation();
		}
	}, [ isVisible, hide ] );

	return (
		<TooltipContext.Provider value={ { isVisible, show, hide } }>
			<Component className={ classNames( "yst-tooltip-container", className ) } onKeyDown={ handleKeyDown }>
				{ children }
			</Component>
		</TooltipContext.Provider>
	);
};
TooltipContainer.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string,
};

/**
 * Wraps the content that should trigger the tooltip in a focusable element.
 * - It ensures that the tooltip is shown on focus and mouse enter.
 * - It adds the aria-describedby attribute to associate the tooltip with the trigger.
 * - It adds the aria-disabled attribute to indicate the trigger is not actually doing anything.
 * - It has styling for keyboard focus and none for hover.
 * @param {string|JSX.node} [as="button"] Base component. Needs to be focusable.
 * @param {string} [className] CSS class.
 * @param {JSX.node} [children] What the tooltip should center on.
 * @param {string} [ariaDescribedby] The ID of the tooltip, so that screen readers can associate the tooltip with the trigger.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The element.
 */
export const TooltipTrigger = ( { as: Component = "button", className, children, ariaDescribedby, ...props } ) => {
	const { show } = useTooltipContext();

	return (
		<Component
			className={ classNames( "yst-tooltip-trigger", className ) }
			onFocus={ show }
			onMouseEnter={ show }
			aria-describedby={ ariaDescribedby }
			aria-disabled={ true }
			{ ...props }
		>
			{ children }
		</Component>
	);
};
TooltipTrigger.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string,
	ariaDescribedby: PropTypes.string,
};

/**
 * Wraps the Tooltip element.
 * - It gets the `isVisible` from the context.
 * - It hides the Tooltip via the `yst-hidden` className when `isVisible` is false.
 * - It forwards any props to the Tooltip element.
 * @param {string} [className] CSS class.
 * @param {JSX.node} [children] What the tooltip should center on.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The element.
 */
export const TooltipWithContext = ( { className, children, ...props } ) => {
	const { isVisible } = useTooltipContext();

	return (
		<Tooltip
			className={ classNames( className, { "yst-hidden": ! isVisible } ) }
			{ ...props }
		>
			{ children }
		</Tooltip>
	);
};
TooltipWithContext.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
};
