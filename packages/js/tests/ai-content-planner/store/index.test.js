import { createRegistry } from "@wordpress/data";
import { createStore } from "../../../src/ai-content-planner/store";
import { CONTENT_PLANNER_STORE } from "../../../src/ai-content-planner/constants";

describe( "content planner store", () => {
	let registry;

	beforeEach( () => {
		registry = createRegistry();
		registry.register( createStore() );
	} );

	it( "has modal closed by default", () => {
		expect( registry.select( CONTENT_PLANNER_STORE ).selectIsModalOpen() ).toBe( false );
	} );

	it( "has no modal status by default", () => {
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBeNull();
	} );

	it( "opens the modal", () => {
		registry.dispatch( CONTENT_PLANNER_STORE ).openModal();
		expect( registry.select( CONTENT_PLANNER_STORE ).selectIsModalOpen() ).toBe( true );
	} );

	it( "sets feature modal status", () => {
		registry.dispatch( CONTENT_PLANNER_STORE ).setFeatureModalStatus( "content-suggestions" );
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBe( "content-suggestions" );
	} );

	it( "closes the modal and resets state", () => {
		registry.dispatch( CONTENT_PLANNER_STORE ).openModal();
		registry.dispatch( CONTENT_PLANNER_STORE ).setFeatureModalStatus( "content-outline" );
		registry.dispatch( CONTENT_PLANNER_STORE ).closeModal();
		expect( registry.select( CONTENT_PLANNER_STORE ).selectIsModalOpen() ).toBe( false );
		expect( registry.select( CONTENT_PLANNER_STORE ).selectFeatureModalStatus() ).toBeNull();
	} );
} );
