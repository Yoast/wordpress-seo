import mentionPluginPositionSuggestions from "draft-js-mention-plugin/lib/utils/positionSuggestions";

// Extra offset for when the popover has to move above the cursor.
const MENTION_PLUGIN_CURSOR_HEIGHT_OFFSET = 31;
// Extra offset when checking if the popover falls outside of the right of the screen.
const MENTION_PLUGIN_RIGHT_EDGE_OFFSET = 5;
// Extra offset when checking if the popover falls outside of the bottom of the screen.
const MENTION_PLUGIN_BOTTOM_EDGE_OFFSET = 25;

/**
 * Determines the position for the Draft.js mention plugin suggestions.
 *
 * Fix the default Draft.js mention plugin suggestions position when it would display them (partly) off screen.
 * This is the case when the cursor is close to the right edge of the screen. And when the cursor is close to the
 * bottom of the screen.
 * This will return an adjusted position object that if needed moves it to the left and / or above the cursor.
 *
 * @param {Object}      args               The arguments object.
 * @param {Object}      args.decoratorRect The portal client rectangle from the Draft.js mention plugin.
 * @param {HTMLElement} args.popover       The popover HTML element.
 * @param {Object}      args.state         The component state.
 * @param {Object}      args.props         The component props.
 *
 * @returns {Object} The mention plugin suggestions position object.
 */
// eslint-disable-next-line complexity
export const positionSuggestions = ( { decoratorRect, popover, state, props } ) => {
	const rightEdge = ( decoratorRect.x || decoratorRect.left ) + popover.offsetWidth + MENTION_PLUGIN_RIGHT_EDGE_OFFSET;
	const bottomEdge = ( decoratorRect.y || decoratorRect.top ) + popover.offsetHeight + MENTION_PLUGIN_BOTTOM_EDGE_OFFSET;
	const { left, top, ...restProps } = mentionPluginPositionSuggestions( { decoratorRect, popover, state, props } );

	let adjustedLeft = null;
	if ( rightEdge > window.innerWidth ) {
		adjustedLeft = `${ parseFloat( left ) - ( rightEdge % window.innerWidth ) }px`;
	}

	let adjustedTop = null;
	if ( bottomEdge > window.innerHeight ) {
		adjustedTop = `${ parseFloat( top ) - MENTION_PLUGIN_CURSOR_HEIGHT_OFFSET - popover.offsetHeight }px`;
	}

	return {
		left: adjustedLeft || left,
		top: adjustedTop || top,
		...restProps,
	};
};
