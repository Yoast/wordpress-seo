import { useSelect } from "@wordpress/data";
import { createContext, useCallback, useContext, useEffect, useState } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { find } from "lodash";
import { STORE_NAME_INTRODUCTIONS } from "../constants";

// Prepare global.
window.YoastSEO = window.YoastSEO || {};

const IntroductionsContext = createContext( {} );

/**
 * @returns {Object} The context.
 */
export const useIntroductionsContext = () => useContext( IntroductionsContext );

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} props.children The children.
 * @param {Object} props.initialComponents The initial components.
 *
 * @returns {JSX.Element} The element.
 */
export const IntroductionProvider = ( { children, initialComponents } ) => {
	const [ components, setComponents ] = useState( initialComponents );
	const introductions = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectIntroductions(), [] );

	const registerComponent = useCallback( ( id, Component ) => {
		const introduction = find( introductions, { id } );
		if ( ! introduction ) {
			return;
		}
		setComponents( currentComponents => ( { ...currentComponents, [ id ]: Component } ) );
	}, [ introductions, setComponents ] );

	useEffect( () => {
		// Update the global window registration method.
		window.YoastSEO._registerIntroductionComponent = registerComponent;

		// Signal that the introductions API is ready.
		doAction( "yoast.introductions.ready" );
	}, [ registerComponent ] );

	return (
		<IntroductionsContext.Provider value={ components }>
			{ children }
		</IntroductionsContext.Provider>
	);
};
