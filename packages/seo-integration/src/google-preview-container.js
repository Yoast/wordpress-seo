import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useContext, useMemo, useRef, useState } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { get, isEmpty, map } from "lodash";
import { PropTypes } from "prop-types";
import { SeoContext } from "./provider";

/**
 * Formats the replacement variables for the Google Preview.
 *
 * Caches the given replacement variables so that the memory address only changes when any value changes.
 *
 * @param {Object.<string, ReplacementVariablesInterface[]>} replacementVariables The replacement variables.
 *
 * @returns {{replacementVariables: {name: string, label: string, value: *}[], recommendedReplacementVariables: string[]}} The replacement variables
 *     and recommended replacement variables.
 */
const useGooglePreviewReplacementVariables = ( replacementVariables ) => {
	const cache = useRef();

	const values = map( replacementVariables, variable => variable.getReplacement() ).join( "" );
	const cachedValues = map( cache.current, "value" ).join( "" );

	// Set the cache when any value changed, or when it was not set before.
	if ( cachedValues !== values || ! cache.current ) {
		cache.current = map( replacementVariables, replacementVariable => ( {
			name: replacementVariable.name,
			label: replacementVariable.label,
			value: replacementVariable.getReplacement(),
		} ) );
	}

	return {
		replacementVariables: cache.current,
		recommendedReplacementVariables: map( cache.current, "name" ),
	};
};

/**
 * Handles known data for a Google preview component.
 *
 * @param {JSX.Element} as A Google preview component.
 * @param {Object} restProps Props to pass to the Google preview component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped Google preview component.
 */
const GooglePreviewContainer = ( { as: Component, ...restProps } ) => {
	const analysisType = useSelect( select => select( SEO_STORE_NAME ).selectAnalysisType() );
	const title = useSelect( select => select( SEO_STORE_NAME ).selectSeoTitle() );
	const description = useSelect( select => select( SEO_STORE_NAME ).selectMetaDescription() );
	const slug = useSelect( select => select( SEO_STORE_NAME ).selectSlug() );
	const date = useSelect( select => select( SEO_STORE_NAME ).selectDate() );
	const focusKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase() );
	const morphologyResults = useSelect( select => select( SEO_STORE_NAME ).selectResearchResults( "morphology" ) );
	const permalink = useSelect( select => select( SEO_STORE_NAME ).selectPermalink() || window.location.href );
	const isCornerstone = useSelect( select => select( SEO_STORE_NAME ).selectIsCornerstone() );
	const [ previewMode, setPreviewMode ] = useState( "mobile" );
	const { updateSlug, updateSeoTitle, updateMetaDescription } = useDispatch( SEO_STORE_NAME );
	const { analysisTypeReplacementVariables } = useContext( SeoContext );

	const baseUrl = useMemo( () => {
		if ( isEmpty( permalink ) ) {
			return permalink;
		}

		// Strip the last part of the permalink.
		let url;
		try {
			url = new URL( permalink );
		} catch ( e ) {
			return window.location.href;
		}

		// Enforce ending with a slash because of the internal handling in the SnippetEditor component.
		if ( ! url.pathname.endsWith( "/" ) ) {
			url.pathname += "/";
		}

		return url.href;
	}, [ permalink ] );
	const data = useMemo( () => ( { title, description, slug } ), [ title, description, slug ] );
	const focusKeyphraseWordForms = useMemo( () => get( morphologyResults, "keyphraseForms", [] ).flat(), [ morphologyResults ] );

	const {
		replacementVariables,
		recommendedReplacementVariables,
	} = useGooglePreviewReplacementVariables( get( analysisTypeReplacementVariables, `${ analysisType }.variables`, [] ) );

	const handleChange = useCallback( ( key, value ) => {
		switch ( key ) {
			case "mode":
				setPreviewMode( value );
				break;
			case "slug":
				updateSlug( value );
				break;
			case "title":
				updateSeoTitle( value );
				break;
			case "description":
				updateMetaDescription( value );
				break;
			default:
				console.warn( "Google preview unhandled change", key, value );
				break;
		}
	}, [ setPreviewMode ] );

	return <Component
		baseUrl={ baseUrl }
		data={ data }
		date={ date }
		keyword={ focusKeyphrase }
		mode={ previewMode }
		wordsToHighlight={ focusKeyphraseWordForms }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		isCornerstone={ isCornerstone }
		onChange={ handleChange }
		{ ...restProps }
	/>;
};

GooglePreviewContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

GooglePreviewContainer.defaultProps = {};

export default GooglePreviewContainer;
