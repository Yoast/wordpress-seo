import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { createContext, useCallback, useContext, useEffect, useState } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { find } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_INTRODUCTIONS } from "../constants";

// Prepare global.
window.YoastSEO = window.YoastSEO || {};

const IntroductionsContext = createContext( {} );

/**
 * @returns {Object} The context.
 */
export const useIntroductionsContext = () => useContext( IntroductionsContext );

/**
 * @param {JSX.node} children The children.
 * @param {Object} initialComponents The initial components.
 * @param {bool} abortDisplay Whether the introduction should be aborted.
 * @returns {JSX.Element} The element.
 */
export const IntroductionProvider = ( { children, initialComponents, abortDisplay } ) => {
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

	useEffect( () => {
		if ( abortDisplay ) {
			Object.keys( components ).forEach( async introId => {
				await apiFetch( {
					path: `/yoast/v1/introductions/${ introId }/seen`,
					method: "POST",
					// eslint-disable-next-line camelcase
					data: { is_seen: false },
				} );
			} );
		}
	}, [ components, abortDisplay ] );

	return (
		! abortDisplay && <IntroductionsContext.Provider value={ components }>
			{ children }
		</IntroductionsContext.Provider>
	);
};
IntroductionProvider.propTypes = {
	children: PropTypes.node.isRequired,
	initialComponents: PropTypes.object.isRequired,
};
