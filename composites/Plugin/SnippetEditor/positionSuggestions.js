/*
 * Add some extra offset for the positioning.
 * To keep the bottom and right edges of the suggestions inside the viewport.
 */
const EXTRA_OFFSET = 3;

/**
 * Get the closest non-static parent.
 *
 * @param {HTMLElement} element The child element.
 *
 * @returns {HTMLElement} The relative parent.
 */
const getRelativeParent = ( element ) => {
	if ( ! element ) {
		return document.documentElement;
	}

	const position = window.getComputedStyle( element ).getPropertyValue( "position" );
	if ( position !== "static" ) {
		return element;
	}

	return getRelativeParent( element.parentElement );
};

/**
 * Gets the element's layout size.
 *
 * @param {HTMLElement} element The HTML element.
 *
 * @returns {Object} The width and height of the HTML element.
 */
const getElementLayoutSize = ( element ) => {
	return {
		width: element.offsetWidth,
		height: element.offsetHeight,
	};
};

/**
 * Gets the vertical position of the popover.
 *
 * The default position is below the caret.
 * If that does not fit within the viewport, put it above the caret.
 *
 * @param {DOMRect|ClientRect} parentRect    The bounding client rect of the parent element.
 * @param {DOMRect|ClientRect} caretRect     The bounding client rect of the caret element.
 * @param {number}             popoverHeight The height of the popover.
 *
 * @returns {number} The vertical position, relative to the parent.
 */
export const getVerticalPosition = ( parentRect, caretRect, popoverHeight ) => {
	const relativeY = caretRect.top - parentRect.top;
	const caretHeight = caretRect.bottom - caretRect.top;

	const popoverBottom = caretRect.bottom + popoverHeight + EXTRA_OFFSET;

	if ( popoverBottom > window.innerHeight ) {
		// The fallback position is above the caret.
		return relativeY - caretHeight - popoverHeight;
	}

	// The default position is below the caret.
	return relativeY + caretHeight;
};

/**
 * Gets the horizontal position of the popover.
 *
 * The default position is the same as the caret.
 * If that does not fit within the viewport, move it to the left as much as needed.
 *
 * @param {DOMRect|ClientRect} parentRect   The bounding client rect of the parent element.
 * @param {DOMRect|ClientRect} caretRect    The bounding client rect of the caret element.
 * @param {number}             popoverWidth The width of the popover.
 *
 * @returns {number} The horizontal position, relative to the parent.
 */
export const getHorizontalPosition = ( parentRect, caretRect, popoverWidth ) => {
	const relativeX = caretRect.left - parentRect.left;

	const popoverRight = caretRect.left + popoverWidth + EXTRA_OFFSET;

	if ( popoverRight > window.innerWidth ) {
		// The fallback position is moving the popover over to the left just enough to make it fit.
		const overflow = popoverRight - window.innerWidth;
		return relativeX - overflow;
	}

	return relativeX;
};

/**
 * Mimics the animation styles from the default Draft.js mention plugin.
 *
 * These are from v3.0.4 of the mention plugin.
 *
 * @param {Object} state The mention plugin state.
 * @param {Object} props The mention plugin props.
 *
 * @returns {Object} The animation styles.
 */
export const getAnimationStyles = ( state, props ) => {
	/*
	 * Scale(0) sets the scale of the popover to 1:0. Effectively making it very very small.
	 * Scale(1) sets the size of the popover to back to 1:1.
	 * The transition will cause there to be an animation between the two transforms.
	 */
	let transform = "scale(0)";
	let transition = "all 0.35s cubic-bezier(.3,1,.2,1)";

	if ( state.isActive && props.suggestions.length > 0 ) {
		transform = "scale(1)";
		transition = "all 0.25s cubic-bezier(.3,1.2,.2,1)";
	}

	return {
		transform,
		transformOrigin: "1em 0%",
		transition,
	};
};

/**
 * Determines the position for the Draft.js mention plugin suggestions.
 *
 * Fix the default Draft.js mention plugin suggestions position when it would display them (partly) off screen.
 * This is the case when the caret is close to the right edge of the screen. And when the caret is close to the
 * bottom of the screen.
 * This will return an adjusted position object that, if needed, moves it to the left and / or above the caret.
 *
 * @param {Object}      args               The arguments, these are provided by the Draft.js mention plugin.
 * @param {Object}      args.decoratorRect The caret rect.
 * @param {HTMLElement} args.popover       The popover HTML element.
 * @param {Object}      args.state         The component state.
 * @param {Object}      args.props         The component props.
 *
 * @returns {Object} The mention plugin suggestions position object.
 */
export const positionSuggestions = ( { decoratorRect: caretRect, popover, state, props } ) => {
	// Get the parent of the popover to determine the position relative to the viewport.
	const parent = getRelativeParent( popover.parentElement );
	const parentRect = parent.getBoundingClientRect();
	const popoverSize = getElementLayoutSize( popover );

	// Adjust the position as needed.
	const position = {
		top: getVerticalPosition( parentRect, caretRect, popoverSize.height ),
		left: getHorizontalPosition( parentRect, caretRect, popoverSize.width ),
	};
	// Get the animation styles that the mention plugin applies normally.
	const animationStyles = getAnimationStyles( state, props );

	return {
		top: position.top + "px",
		left: position.left + "px",
		...animationStyles,
	};
};
