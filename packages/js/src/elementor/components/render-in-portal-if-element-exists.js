import { createPortal, useState } from "@wordpress/element";
import { useMutationObserver } from "../../hooks/use-mutation-observer";

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
	const [ render, setRender ] = useState( null );

	useMutationObserver( document.body, () => {
		const el = document.getElementById( id );
		if ( el ) {
			if ( render === null ) {
				setRender( createPortal( children, el ) );
			}
		} else if ( render !== null ) {
			setRender( null );
		}
	} );

	return render;
};
