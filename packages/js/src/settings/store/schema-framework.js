import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

// Action name constants
export const SCHEMA_FRAMEWORK_NAME = "schemaFramework";

/**
 * @returns {Object} The initial schemaFramework state.
 */
export const createInitialSchemaFrameworkState = () =>(
	{
		isSchemaDisabled: false,
		schemaApiIntegrations: {},
	}
);

const slice = createSlice( {
	name: SCHEMA_FRAMEWORK_NAME,
	initialState: createInitialSchemaFrameworkState(),
	reducers: {},
} );

export const schemaFrameworkActions = slice.actions;

export const schemaFrameworkSelectors = {
	selectSchemaIsSchemaDisabled: state => get( state, "schemaFramework.isSchemaDisabled", false ),
	selectSchemaApiIntegrations: state => get( state, "schemaFramework.schemaApiIntegrations", {} ),
};

export default slice.reducer;
