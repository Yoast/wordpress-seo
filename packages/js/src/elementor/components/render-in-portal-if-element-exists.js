import { createPortal, useCallback, useRef, useState } from "@wordpress/element";
import { useMutationObserver } from "../../hooks/use-mutation-observer";

/**
 * @param {JSX.node} children The children.
 * @param {?HTMLElement} element The element or null.
 * @param {string} id The ID of the element.
 * @returns {?JSX.Element} The rendered content or null.
 */
const getRenderContent = ( children, element, id ) => {
	return element === null ? null : createPortal( children, element, id );
};

/**
 * Renders the content in a portal if the element exists.
 *
 * The portal is created once the element is detected.
 * The portal is removed once the element is removed.
 *
 * @param {string} id The ID of the element to render in.
 * @param {JSX.node} children The content.
 *
 * @returns {JSX.node|null} The rendered content or null.
 */
export const RenderInPortalIfElementExists = ( { id, children } ) => {
	const element = useRef( document.getElementById( id ) );
	// Use state to prevent creating a new portal on every render.
	const [ render, setRender ] = useState( () => getRenderContent( children, element.current, id ) );

	const checkDocument = useCallback( () => {
		const el = document.getElementById( id );
		if ( el !== element.current ) {
			element.current = el;
			setRender( getRenderContent( children, el, id ) );
		}
	}, [ id, children ] );

	useMutationObserver( document.body, checkDocument );

	return render;
};
