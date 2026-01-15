import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

// Action name constants
export const SCHEMA_FRAMEWORK_NAME = "schemaFramework";

/**
 * @returns {Object} The initial schemaFramework state.
 */
export const createInitialSchemaFrameworkState = () =>(
	{
		isSchemaDisabledProgrammatically: false,
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
	selectSchemaIsSchemaDisabledProgrammatically: state => get( state, "schemaFramework.isSchemaDisabledProgrammatically", false ),
	selectSchemaApiIntegrations: state => get( state, "schemaFramework.schemaApiIntegrations", {} ),
};

export default slice.reducer;
