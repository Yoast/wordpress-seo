import { isEqual, reduce, stubString } from "lodash";

/**
 * @param {ReplacevarOptions} replacevarOptions The replacevarOptions.
 * @param {string} replacevarOptions.scope The scope, i.e. post, page, etc.
 * @param {string[]} replacevarOptions.supportedVariables The replacevar names to filter on.
 * @returns {string} The hash key.
 */
const getReplacevarOptionsHashKey = ( { scope = "", supportedVariables = [] } ) => [ scope, ...supportedVariables ].join( "" );

/**
 * Creates the replacevar functions given a getReplacevars function.
 *
 * @param {function} getReplacevars Should accept ReplacevarOptions and return replacevars.
 *
 * @returns {Object} The replacevar functions: getReplacevarsForEditor, getRecommendedReplacevarsForEditor
 *                   and applyReplacevars.
 */
export const createReplacevarFunctions = ( getReplacevars ) => {
	const replacevarsForEditorCache = {};

	/**
	 * Gets the replacevars in the correct shape for the replacevar editor.
	 * @param {ReplacevarOptions} replacevarOptions The replacevarOptions.
	 * @returns {Object[]} The replacevars in the correct shape.
	 */
	const getReplacevarsForEditor = ( replacevarOptions ) => {
		const replacevars = getReplacevars( replacevarOptions ).map( replacevar => ( {
			name: replacevar.name,
			value: replacevar.getReplacement(),
			label: replacevar.getLabel(),
		} ) );

		const hashKey = getReplacevarOptionsHashKey( replacevarOptions );
		if ( ! isEqual( replacevars, replacevarsForEditorCache[ hashKey ] ) ) {
			replacevarsForEditorCache[ hashKey ] = replacevars;
		}
		return replacevarsForEditorCache[ hashKey ];
	};

	/**
	 * Applies the replacevars to each value of an object.
	 *
	 * @param {ReplacevarOptions} replacevarOptions The replacevarOptions.
	 * @param {Object} data The object with strings to apply the vars to.
	 * @param {Array} args Optional arguments to be passed to the replacement function.
	 * @returns {Object} The filtered object.
	 */
	const applyReplacevars = ( replacevarOptions, data, args = [] ) => {
		return reduce( data, ( result, value, key ) => {
			result[ key ] = value;
			if ( typeof value === "string" ) {
				getReplacevars( replacevarOptions ).forEach( replacevar => {
					result[ key ] = result[ key ].replace( replacevar.regexp, replacevar.getReplacement( ...args ) );
				} );
			}
			return result;
		}, {} );
	};

	return {
		getReplacevarsForEditor,
		applyReplacevars,
	};
};

/**
 *
 * @param {Object} props             The props.
 * @param {string} props.name        The name.
 * @param {string} props.placeholder The placeholder.
 * @param {RegExp} props.regexp      The regular expression.
 *
 * @returns {Function} A replacevar factory function that accepts getLabel and getReplacement functions.
 */
function createReplacevarFactory( { name, placeholder, regexp } ) {
	return ( { getLabel, getReplacement = stubString } ) => ( {
		name,
		placeholder,
		regexp,
		getLabel,
		getReplacement,
	} );
}

export const createFocusKeyphraseReplacevar = createReplacevarFactory( {
	name: "focus_keyphrase",
	placeholder: "%%focus_keyphrase%%",
	regexp: new RegExp( "%%focus_keyphrase%%", "g" ),
} );

export const createSitenameReplacevar = createReplacevarFactory( {
	name: "sitename",
	placeholder: "%%sitename%%",
	regexp: new RegExp( "%%sitename%%", "g" ),
} );


export const createTitleReplacevar = createReplacevarFactory( {
	name: "title",
	placeholder: "%%title%%",
	regexp: new RegExp( "%%title%%", "g" ),
} );

export const createCollectionTitleReplacevar = createReplacevarFactory( {
	name: "collection_title",
	placeholder: "%%collection_title%%",
	regexp: new RegExp( "%%collection_title%%", "g" ),
} );

export const createProductTagsReplacevar = createReplacevarFactory( {
	name: "product_tags",
	placeholder: "%%product_tags%%",
	regexp: new RegExp( "%%product_tags%%", "g" ),
} );

export const createBlogTitleReplacevar = createReplacevarFactory( {
	name: "blog_title",
	placeholder: "%%blog_title%%",
	regexp: new RegExp( "%%blog_title%%", "g" ),
} );

export const createPostTagsReplacevar = createReplacevarFactory( {
	name: "post_tags",
	placeholder: "%%post_tags%%",
	regexp: new RegExp( "%%post_tags%%", "g" ),
} );

export const createPageNumberReplacevar = createReplacevarFactory( {
	name: "page",
	placeholder: "%%page%%",
	regexp: new RegExp( "%%page%%", "g" ),
} );

export const createPageTotalReplacevar = createReplacevarFactory( {
	name: "page_total",
	placeholder: "%%page_total%%",
	regexp: new RegExp( "%%page_total%%", "g" ),
} );

export const createSeparatorReplacevar = createReplacevarFactory( {
	name: "sep",
	placeholder: "%%sep%%",
	regexp: new RegExp( "%%sep%%", "g" ),
} );

export const createSearchPhraseReplacevar = createReplacevarFactory( {
	name: "search_phrase",
	placeholder: "%%searchphrase%%",
	regexp: new RegExp( "%%searchphrase%%", "g" ),
} );

export const createSearchResultsCountReplacevar = createReplacevarFactory( {
	name: "search_results_count",
	placeholder: "%%results_count%%",
	regexp: new RegExp( "%%results_count%%", "g" ),
} );
