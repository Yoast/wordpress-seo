// External dependencies.
import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

// Internal dependencies.
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";

/**
 * Applies the templates to the data.
 *
 * A template is used when:
 * - A template key matches a data key.
 * - The matched data is empty.
 *
 * @param {Object} data      The data object.
 * @param {Object} templates The templates object.
 *
 * @returns {Object} The data with templates applied.
 */
function applyTemplatesToData( data, templates ) {
	forEach( templates, ( template, key ) => {
		// If the data exists and is empty, use the template.
		if ( has( data, key ) && isEmpty( data[ key ] ) ) {
			data[ key ] = template;
		}
	} );
	return data;
}

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state               The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 * @param {Object} ownProps            The properties for the snippet editor.
 * @param {Object} ownProps.templates  The templates object.
 *
 * @returns {Object} Data for the `SnippetEditor` component.
 */
export function mapStateToProps( state, ownProps ) {
	const newState = cloneDeep( state.snippetEditor );
	if ( has( ownProps, "templates" ) ) {
		newState.data = applyTemplatesToData( newState.data, ownProps.templates );
	}
	return newState;
}

/**
 * Maps dispatch function to props for the snippet editor component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 * @param {Object}   ownProps The properties for the snippet editor.
 *
 * @returns {Object} Props for the `SnippetEditor` component.
 */
export function mapDispatchToProps( dispatch, ownProps ) {
	return {
		onChange: ( key, value ) => {
			// If the templates prop has the same key and it equals the value.
			if ( has( ownProps, "templates", key ) && value === ownProps.templates[ key ] ) {
				// Replace the value with an empty string.
				value = "";
			}

			let action = updateData( {
				[ key ]: value,
			} );

			if ( key === "mode" ) {
				action = switchMode( value );
			}

			dispatch( action );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditor );
