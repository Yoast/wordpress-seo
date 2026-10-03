import { createRegistry } from "@wordpress/data";
import { createStore, registerStore } from "../../../src/ai-content-planner/store";
import { CONTENT_PLANNER_STORE } from "../../../src/ai-content-planner/constants";

describe( "content planner store", () => {
	let registry;

	beforeEach( () => {
		registry = createRegistry();
		registry.register( createStore() );
	} );

	it( "has no modal status by default", () => {
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBeNull();
	} );

	it( "sets feature modal status", () => {
		registry.dispatch( CONTENT_PLANNER_STORE ).setFeatureModalStatus( "content-suggestions" );
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBe( "content-suggestions" );
	} );

	it( "closes the modal and resets state", () => {
		registry.dispatch( CONTENT_PLANNER_STORE ).setFeatureModalStatus( "content-outline" );
		registry.dispatch( CONTENT_PLANNER_STORE ).closeModal();
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBeNull();
	} );

	it( "applies initialState when provided to createStore", () => {
		const customRegistry = createRegistry();
		customRegistry.register( createStore( {
			modal: { isOpen: false, featureModalStatus: "consent" },
		} ) );
		expect( customRegistry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBe( "consent" );
	} );
} );

describe( "registerStore", () => {
	it( "registers the store to the default registry without throwing", () => {
		expect( () => registerStore() ).not.toThrow();
	} );
} );
