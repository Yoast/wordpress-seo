// External dependencies.
import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import cloneDeep from "lodash/cloneDeep";

// Internal dependencies.
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";

/**
 * Applies the template to the data in the state.
 *
 * @param {Object} data     Scoped part of the redux state.
 * @param {string} key      The key of the data.
 * @param {string} template The value of the template.
 *
 * @returns {Object} The Redux state.
 */
function applyDataTemplate( data, key, template ) {
	if ( isEmpty( data[ key ] ) ) {
		data[ key ] = template;
	}
	return data;
}

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 * @param {Object} ownProps The properties for the snippet editor.
 *
 * @returns {Object} Data for the `SnippetEditor` component.
 */
export function mapStateToProps( state, ownProps ) {
	const newState = cloneDeep( state.snippetEditor );
	forEach( ownProps.templates, ( template, key ) => {
		newState.data = applyDataTemplate( newState.data, key, template );
	} );
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
			// Check if we are updating something that contains a template.
			forEach( ownProps.templates, ( template, templateKey ) => {
				if ( key === templateKey ) {
					// If the value is the same as the template, pretend it is empty.
					if ( value === template ) {
						console.log( "clearing", key, value, template );
						value = "";
					}
				}
			} );

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
