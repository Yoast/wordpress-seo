import apiFetch from "@wordpress/api-fetch";

import PropTypes from "prop-types";

import { useState, useCallback, createContext } from "@wordpress/element";

const IndexablesContext = createContext();
/**
 * The context provider
 * @param {Node} children The children
 *
 * @returns {WPElement} The context provider.
 */
const IndexablesContextProvider = ( { children } ) => {
	const [ undo, setUndo ] = useState( [ ] );

	const addUndo = useCallback( ( id, type ) => {
		setUndo( prevState => [ ...prevState, { id: id, type: type } ] );
	}, [ setUndo ] );

	const handleIgnore =  useCallback( async( e ) => {
		const id = e.currentTarget.dataset.id;
		const type = e.currentTarget.dataset.type;
		try {
			const response = await apiFetch( {
				path: "yoast/v1/ignore_indexable",
				method: "POST",
				data: { id: id, type: type },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				addUndo( { id: id, type: type } );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, addUndo ] );

	return (
		<IndexablesContext.Provider value={ { undo, handleIgnore } }>
			{ children }
		</IndexablesContext.Provider>
	);
};

IndexablesContextProvider.propTypes = {
	children: PropTypes.node,
};

export { IndexablesContext, IndexablesContextProvider };
