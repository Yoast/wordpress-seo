import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { SnippetEditor } from "@yoast/search-metadata-previews";
import { LocationConsumer } from "@yoast/externals/contexts";
import SnippetPreviewSection from "../components/SnippetPreviewSection";
import { applyReplaceUsingPlugin } from "../helpers/replacementVariableHelpers";

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
export const mapEditorDataToPreview = function( data, context ) {
	let baseUrlLength = 0;

	if ( context.shortenedBaseUrl && typeof( context.shortenedBaseUrl ) === "string" ) {
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

	return applyReplaceUsingPlugin( data );
};

/**
 * Wraps a Snippet editor with a Snippet preview section.
 *
 * @param {object} props The props.
 *
 * @returns {wp.Element} The component.
 */
const SnippetEditorWrapper = ( props ) => (
	<LocationConsumer>
		{ location =>
			<SnippetPreviewSection
				icon="eye"
				hasPaperStyle={ props.hasPaperStyle }
			>
				<SnippetEditor
					{ ...props }
					descriptionPlaceholder={ __( "Please provide a meta description by editing the snippet below.", "wordpress-seo" ) }
					mapEditorDataToPreview={ mapEditorDataToPreview }
					showCloseButton={ false }
					idSuffix={ location }
				/>
			</SnippetPreviewSection>
		}
	</LocationConsumer>
);

/**
 * Maps the select function to props.
 *
 * @param {function} select The select function.
 *
 * @returns {Object} The props.
 */
export function mapSelectToProps( select ) {
	const {
		getBaseUrlFromSettings,
		getDateFromSettings,
		getFocusKeyphrase,
		getRecommendedReplaceVars,
		getReplaceVars,
		getShoppingData,
		getSiteIconUrlFromSettings,
		getSnippetEditorData,
		getSnippetEditorMode,
		getSnippetEditorPreviewImageUrl,
		getSnippetEditorWordsToHighlight,
		isCornerstoneContent,
		getIsTerm,
		getContentLocale,
	} = select( "yoast-seo/editor" );

	const replacementVariables = getReplaceVars();

	// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
	replacementVariables.forEach( ( replaceVariable ) => {
		if ( replaceVariable.value === "" && ! [ "title", "excerpt", "excerpt_only" ].includes( replaceVariable.name ) ) {
			replaceVariable.value = "%%" + replaceVariable.name + "%%";
		}
	} );

	return {
		baseUrl: getBaseUrlFromSettings(),
		data: getSnippetEditorData(),
		date: getDateFromSettings(),
		faviconSrc: getSiteIconUrlFromSettings(),
		keyword: getFocusKeyphrase(),
		mobileImageSrc: getSnippetEditorPreviewImageUrl(),
		mode: getSnippetEditorMode(),
		recommendedReplacementVariables: getRecommendedReplaceVars(),
		replacementVariables,
		shoppingData: getShoppingData(),
		wordsToHighlight: getSnippetEditorWordsToHighlight(),
		isCornerstone: isCornerstoneContent(),
		isTaxonomy: getIsTerm(),
		locale: getContentLocale(),
	};
}

/**
 * Maps the dispatch function to props.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {Object} The props.
 */
export function mapDispatchToProps( dispatch ) {
	const {
		updateData,
		switchMode,
		updateAnalysisData,
	} = dispatch( "yoast-seo/editor" );
	const coreEditorDispatch = dispatch( "core/editor" );

	return {
		onChange: ( key, value ) => {
			switch ( key ) {
				case "mode":
					switchMode( value );
					break;
				case "slug":
					updateData( { slug: value } );

					/*
					 * Update the gutenberg store with the new slug, after updating our own store,
					 * to make sure our store isn't updated twice.
					 */
					if ( coreEditorDispatch ) {
						coreEditorDispatch.editPost( { slug: value } );
					}
					break;
				default:
					updateData( {
						[ key ]: value,
					} );
					break;
			}
		},
		onChangeAnalysisData: updateAnalysisData,
	};
}

export default compose( [
	withSelect( mapSelectToProps ),
	withDispatch( mapDispatchToProps ),
] )( SnippetEditorWrapper );
