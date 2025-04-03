import classNames from "classnames";
import { noop, debounce } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext, useRef, useEffect, useState, useMemo } from "react";
import Tooltip from "../../elements/tooltip";
import { useToggleState } from "../../hooks";

const GRACE_MARGIN = 10;
const DEBOUNCE_DELAY = 100;

/**
 * @typedef {Object} TooltipContextValue
 * @property {boolean} isVisible Whether the tooltip is visible.
 * @property {function} show Show the tooltip.
 * @property {function} hide Hide the tooltip.
 * @property {Object} tooltipPosition The position of the tooltip.
 * @property {function} setTooltipPosition Set the position of the tooltip.
 */

/**
 * @type {React.Context<TooltipContextValue>}
 */
const TooltipContext = createContext( {
	isVisible: false,
	show: noop,
	hide: noop,
	tooltipPosition: {},
	setTooltipPosition: noop,
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
	const [ tooltipPosition, setTooltipPosition ] = useState( {} );

	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === "Escape" && isVisible ) {
			hide();
			event.stopPropagation();
		}
	}, [ isVisible, hide ] );

	const contextValue = useMemo( () => ( {
		isVisible, show, hide, tooltipPosition, setTooltipPosition,
	} ), [ isVisible, show, hide, tooltipPosition ] );

	return (
		<TooltipContext.Provider value={ contextValue }>
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
	const { show, hide, tooltipPosition, isVisible } = useTooltipContext();
	const triggerRef = useRef();

	useEffect( () => {
		const handlePointerMove = debounce( ( event ) => {
			const rect = triggerRef.current.getBoundingClientRect();
			const extendedRect = {
				top: rect.top - GRACE_MARGIN,
				right: rect.right + GRACE_MARGIN,
				bottom: rect.bottom + GRACE_MARGIN,
				left: rect.left - GRACE_MARGIN,
			};

			const mouseX = event.clientX;
			const mouseY = event.clientY;
			const outsideTooltip = mouseX < tooltipPosition.left ||
				mouseX > tooltipPosition.right || mouseY < tooltipPosition.top || mouseY > tooltipPosition.bottom;
			const outsideTriggerWithMargin = mouseX < extendedRect.left ||
				mouseX > extendedRect.right || mouseY < extendedRect.top || mouseY > extendedRect.bottom;

			if ( outsideTriggerWithMargin && document.activeElement !== triggerRef.current && outsideTooltip ) {
				hide();
			} else {
				show();
			}
		}, DEBOUNCE_DELAY );

		document.addEventListener( "pointermove", handlePointerMove );

		return () => {
			document.removeEventListener( "pointermove", handlePointerMove );
			handlePointerMove.cancel();
		};
	}, [ show, hide, triggerRef.current, tooltipPosition, isVisible ] );

	return (
		<Component
			ref={ triggerRef }
			className={ classNames( "yst-tooltip-trigger", className ) }
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
	const { isVisible, setTooltipPosition } = useTooltipContext();
	const tooltipRef = useRef();

	useEffect( () => {
		const rect = tooltipRef.current.getBoundingClientRect();
		setTooltipPosition( {
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
			left: rect.left,
		} );
	}, [ tooltipRef.current, setTooltipPosition, isVisible ] );

	return (
		<Tooltip
			ref={ tooltipRef }
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
