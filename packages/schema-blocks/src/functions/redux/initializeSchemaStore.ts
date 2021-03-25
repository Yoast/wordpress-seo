import { registerStore, StoreConfig } from "@wordpress/data";
import { SchemaBlocksDefaultState, SchemaBlocksState } from "./SchemaBlocksState";
import { schemaBlocksActions } from "./actions";
import { schemaBlocksReducer } from "./reducer";
import * as schemaBlocksSelectors from "./selectors";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from ".";

/**
 * Initializes the Schema Blocks store.
 */
export function initializeSchemaBlocksStore() {
	const storeOptions: StoreConfig<SchemaBlocksState> = {
		reducer: schemaBlocksReducer,
		selectors: {
			...schemaBlocksSelectors,
		},
		actions: {
			...schemaBlocksActions,
		},
		initialState: SchemaBlocksDefaultState,
	};

	registerStore( YOAST_SCHEMA_BLOCKS_STORE_NAME, storeOptions );
}
