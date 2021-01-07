import { SET_BLOCK_VALID } from "../actions";

const initialState = {};

/**
 * A reducer for the Schema blocks.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
export default function schemaBlocksReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_BLOCK_VALID: {
			const blockResults = Object.assign( {}, state[ action.clientId ] );

			if ( ! blockResults[ action.blockName ] ) {
				blockResults[ action.blockName ] = [];
			}

			if ( ! blockResults[ action.blockName ].includes( action.validation ) ) {
				blockResults[ action.blockName ].push( action.validation );
			}

			return Object.assign( {}, state, { [ action.clientId ]: blockResults } );
		}
		default: {
			return state;
		}
	}
}
