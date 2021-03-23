import { registerStore, StoreConfig } from "@wordpress/data";
import { SchemaBlocksDefaultState, SchemaBlocksState, YOAST_SCHEMA_STORE_NAME } from "./SchemaBlocksState";
import * as actions from "./actions";
import { schemaBlocksReducer } from "./reducer";
import * as selectors from "./selectors";

/**
 * Initializes the Schema Blocks store.
 */
export function initializeSchemaBlocksStore() {
	const storeOptions: StoreConfig<SchemaBlocksState> = {
		reducer: schemaBlocksReducer,
		selectors: {
			...selectors,
		},
		actions: {
			...actions,
		},
		initialState: SchemaBlocksDefaultState,
	};

	registerStore( YOAST_SCHEMA_STORE_NAME, storeOptions );
}
