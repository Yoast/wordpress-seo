/* global wp */
import React from "react";
import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import identity from "lodash/identity";
import get from "lodash/get";
import { __ } from "@wordpress/i18n";
import analysis from "yoastseo";
const { stripHTMLTags: stripFullTags } = analysis.string;

import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";
import { updateAnalysisData } from "../redux/actions/analysisData";
import SnippetPreviewSection from "../components/SnippetPreviewSection";
import Collapsible from "../components/SidebarCollapsible";

/**
 * Runs the legacy replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
const legacyReplaceUsingPlugin = function( data ) {
	const replaceVariables = get( window, [ "YoastSEO", "wp", "replaceVarsPlugin", "replaceVariables" ], identity );

	return {
		url: data.url,
		title: stripFullTags( replaceVariables( data.title ) ),
		description: stripFullTags( replaceVariables( data.description ) ),
	};
};

/**
 * Apply replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
const applyReplaceUsingPlugin = function( data ) {
	// If we do not have pluggable loaded, apply just our own replace variables.
	const pluggable = get( window, [ "YoastSEO", "app", "pluggable" ], false );
	if ( ! pluggable || ! get( window, [ "YoastSEO", "app", "pluggable", "loaded" ], false ) ) {
		return legacyReplaceUsingPlugin( data );
	}

	const applyModifications = pluggable._applyModifications.bind( pluggable );

	return  {
		url: data.url,
		title: stripFullTags( applyModifications( "data_page_title", data.title ) ),
		description: stripFullTags( applyModifications( "data_meta_desc", data.description ) ),
	};
};

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

	if( context.shortenedBaseUrl && typeof( context.shortenedBaseUrl ) === "string" ) {
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

const SnippetEditorWrapper = ( props ) => (
	<Collapsible title={ __( "Snippet Preview", "wordpress-seo" ) } initialIsOpen={ true }>
		<SnippetPreviewSection
			icon="eye"
			hasPaperStyle={ props.hasPaperStyle }
		>
			<SnippetEditor
				{ ...props }
				descriptionPlaceholder={ __( "Please provide a meta description by editing the snippet below." ) }
				mapEditorDataToPreview={ mapEditorDataToPreview }
			/>
		</SnippetPreviewSection>
	</Collapsible>
);

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 *
 * @returns {Object} Data for the `SnippetEditor` component.
 */
export function mapStateToProps( state ) {
	let replacementVariables = state.snippetEditor.replacementVariables;

	// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
	replacementVariables.forEach( ( replaceVariable ) => {
		if ( replaceVariable.value === "" && ! [ "title", "excerpt", "excerpt_only" ].includes( replaceVariable.name ) ) {
			replaceVariable.value = "%%" + replaceVariable.name + "%%";
		}
	} );

	return {
		...state.snippetEditor,
		keyword: state.focusKeyword,
		baseUrl: state.settings.snippetEditor.baseUrl,
		date: state.settings.snippetEditor.date,
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplaceVars,
	};
}

/**
 * Maps dispatch function to props for the snippet editor component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `SnippetEditor` component.
 */
export function mapDispatchToProps( dispatch ) {
	return {
		onChange: ( key, value ) => {
			let action = updateData( {
				[ key ]: value,
			} );

			if ( key === "mode" ) {
				action = switchMode( value );
			}

			dispatch( action );

			/*
			 * Update the gutenberg store with the new slug, after updating our own store,
			 * to make sure our store isn't updated twice.
			 */
			if ( key === "slug" ) {
				wp.data.dispatch( "core/editor" ).editPost( { slug: value } );
			}
		},
		onChangeAnalysisData: ( analysisData ) => {
			dispatch( updateAnalysisData( analysisData ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditorWrapper );
