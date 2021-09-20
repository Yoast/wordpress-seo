import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { compose } from "@wordpress/compose";
import { useDispatch, useSelect, withDispatch, withSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { strings } from "@yoast/helpers";
import { SnippetEditor } from "@yoast/search-metadata-previews";
import { useEffectWithDeepCompare } from "@yoast/admin-ui-toolkit/hooks";
import classNames from "classnames";
import { debounce } from "lodash";
import { PropTypes } from "prop-types";
import { OPTIMIZE_STORE_KEY, RESEARCH_DELAY } from "../constants";
import { applyReplacevars, getReplacevarsForEditor } from "../helpers/apply-replacevars";
import { Placeholder } from "./placeholders";

const { stripHTMLTags } = strings;

/* eslint-disable complexity */
/**
 * Process the snippet editor form data before it's being displayed in the snippet preview.
 *
 * @param {Object} data                     The snippet preview data object.
 * @param {string} data.title               The snippet preview title.
 * @param {string} data.url                 The snippet preview url: baseUrl with the slug.
 * @param {string} data.description         The snippet preview description.
 * @param {Object} context                  The context surrounding the snippet editor form data.
 * @param {string} context.shortenedBaseUrl The baseUrl of the snippet preview url.
 *
 * @returns {Object} The snippet preview data object.
 */
const createMapEditorDataToPreview = ( { replaceVariables, titleFallback, descriptionFallback } ) => ( data, context ) => {
	let baseUrlLength = 0;

	if ( context.shortenedBaseUrl && typeof ( context.shortenedBaseUrl ) === "string" ) {
		baseUrlLength = context.shortenedBaseUrl.length;
	}

	// Replace whitespaces in the url with dashes.
	data.url = data.url.replace( /\s+/g, "-" );
	if ( data.url[ data.url.length - 1 ] === "-" ) {
		data.url = data.url.slice( 0, -1 );
	}
	// If the first symbol after the baseUrl is a hyphen, remove that hyphen.
	// This hyphen is removed because it is usually the result of the regex replacing a space it shouldn't.
	if ( data.url[ baseUrlLength ] === "-" ) {
		data.url = data.url.slice( 0, baseUrlLength ) + data.url.slice( baseUrlLength + 1 );
	}

	return {
		url: data.url,
		title: stripHTMLTags( data.title || replaceVariables( { data: titleFallback } ).data ),
		description: stripHTMLTags( data.description || replaceVariables( { data: descriptionFallback } ).data ),
	};
};

/**
 * Wraps the snippet editor wrapper.
 * @param {Object} props The props.
 * @returns {JSX.Element} The wrapper.
 */
const SnippetEditorWrapper = ( props ) => {
	const replacementVariables = getReplacevarsForEditor( { scope: props.contentType } );
	const recommendedReplacementVariables = useMemo(
		() => replacementVariables.map( replacevar => replacevar.name ),
		[ replacementVariables ],
	);

	return <SnippetEditor
		{ ...props }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
	/>;
};

SnippetEditorWrapper.propTypes = {
	contentType: PropTypes.string.isRequired,
};

/**
 * The container connecting the SnippetEditor component to the store.
 *
 * @returns {JSX.Element} The connected SnippetEditor component.
 */
const SnippetEditorContainer = compose( [
	withSelect( ( select, { contentType } ) => {
		const {
			getData,
			getOption,
			getKeyphraseWordForms,
			getSeoTitleOrFallback,
			getSeoDescriptionOrFallback,
		} = select( OPTIMIZE_STORE_KEY );

		// eslint-disable-next-line no-undefined
		const date = new Date( getData( "date" ) ).toLocaleDateString( undefined, { day: "numeric", month: "short", year: "numeric" } );

		let baseUrl = getOption( "siteUrl" );

		if ( ! baseUrl.includes( "http://" ) && ! baseUrl.includes( "https://" ) ) {
			baseUrl = "http://" + baseUrl;
		}

		if ( ! baseUrl.endsWith( "/" ) ) {
			baseUrl = baseUrl + "/";
		}

		return {
			baseUrl: baseUrl,
			data: {
				title: getData( "seo.title" ),
				description: getData( "seo.description" ),
				slug: getData( "slug" ),
			},
			date: date,
			faviconSrc: getOption( "faviconSrc" ),
			hasPaperStyle: false,
			keyword: getData( "keyphrases.focus" ),
			mode: getData( "previewMode" ),
			shoppingData: {
				availability: getData( "availability" ),
				price: getData( "price" ),
				rating: getData( "reviews.rating" ),
				reviewCount: getData( "reviews.count" ),
			},
			showCloseButton: false,
			wordsToHighlight: getKeyphraseWordForms(),
			mapEditorDataToPreview: createMapEditorDataToPreview( {
				replaceVariables: applyReplacevars.bind( null, { scope: contentType } ),
				titleFallback: getSeoTitleOrFallback( contentType ),
				descriptionFallback: getSeoDescriptionOrFallback( contentType ),
			} ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setData,
		} = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onChange: ( key, value ) => {
				switch ( key ) {
					case "mode":
						setData( "previewMode", value );
						break;
					case "slug":
						setData( "slug", value );
						break;
					default:
						setData( ( "seo." + key ), value );
						break;
				}
			},
		};
	} ),
] )( SnippetEditorWrapper );

/**
 * Hooks to run the word forms research on focus keyphrase change.
 *
 * @param {string} contentType The content type.
 *
 * @returns {void}
 */
function useWordFormsResearch( contentType ) {
	const data = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getAnalysisData( contentType ), [] );
	const { runWordFormsResearch } = useDispatch( OPTIMIZE_STORE_KEY );
	const debouncedRun = useCallback( debounce( runWordFormsResearch, RESEARCH_DELAY ), [] );

	useEffectWithDeepCompare( () => {
		// Only run if there is focus keyphrase.
		if ( data.keyphrase ) {
			debouncedRun( { contentType } );
		}
	}, [ data, contentType, debouncedRun ] );
}

/**
 * The Google Preview collapsible in the sidebar.
 *
 * @param {Object} props The props.
 * @param {string} props.contentType The content type.
 * @param {boolean} props.isLoading Whether or not the editor should be in a loading state.
 * @returns {*} The Google Preview collapsible.
 */
const GooglePreview = ( { contentType, isLoading } ) => {
	useWordFormsResearch( contentType );

	return (
		<Disclosure as="section">
			{ ( { open } ) => (
				<>
					<Disclosure.Button
						className="yst-flex yst-w-full yst-items-center yst-justify-between yst-text-tiny yst-font-medium yst-text-gray-700 yst-rounded-md yst-px-8 yst-py-4 hover:yst-text-gray-800 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-inset focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						{
							isLoading
								? <Placeholder />
								: <>
									{ __( "Google preview", "admin-ui" ) }
									<ChevronDownIcon
										className={ classNames(
											open ? "yst-text-gray-400 yst-transform yst-rotate-180" : "yst-text-gray-300",
											"yst-ml-auto yst-w-5 yst-h-5 yst-text-gray-400 group-hover:yst-text-gray-500",
										) }
										aria-hidden="true"
									/>
								</>
						}
					</Disclosure.Button>
					<Disclosure.Panel className="yst-px-8 yst-pt-6 yst-pb-10 yst-border-t yst-border-gray-200 yst-space-y-6">
						<SnippetEditorContainer contentType={ contentType } />
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

GooglePreview.propTypes = {
	contentType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};

GooglePreview.defaultProps = {
	isLoading: false,
};

export default GooglePreview;
