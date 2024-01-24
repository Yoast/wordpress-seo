import { useSelect } from "@wordpress/data";
import { createContext, useCallback, useContext, useEffect, useState } from "@wordpress/element";
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
 * @returns {JSX.Element} The element.
 */
export const IntroductionProvider = ( { children, initialComponents } ) => {
	const [ components, setComponents ] = useState( initialComponents );
	const introductions = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectIntroductions(), [] );

	const registerComponent = useCallback( ( id, Component ) => {
		const introduction = find( introductions, { id } );
		if ( ! introduction ) {
			// Bail when unknown.
			console.error( "Warning: Introductions received a registration for an unknown key:", id );
			return;
		}
		setComponents( currentComponents => ( { ...currentComponents, [ id ]: Component } ) );
	}, [ introductions, setComponents ] );

	useEffect( () => {
		// Update the global window registration method.
		window.YoastSEO._registerIntroductionComponent = registerComponent;
	}, [ registerComponent ] );


	return (
		<IntroductionsContext.Provider value={ components }>
			{ children }
		</IntroductionsContext.Provider>
	);
};
IntroductionProvider.propTypes = {
	children: PropTypes.node.isRequired,
	initialComponents: PropTypes.object.isRequired,
};
