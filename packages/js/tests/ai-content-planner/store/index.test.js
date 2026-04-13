import { createRegistry } from "@wordpress/data";
import { store } from "../../../src/ai-content-planner/store";
import { FEATURE_MODAL_STORE } from "../../../src/ai-content-planner/constants";

describe( "content planner store", () => {
	let registry;

	beforeEach( () => {
		registry = createRegistry();
		registry.register( store );
	} );

	it( "has modal closed by default", () => {
		expect( registry.select( FEATURE_MODAL_STORE ).selectIsModalOpen() ).toBe( false );
	} );

	it( "has skipApprove false by default", () => {
		expect( registry.select( FEATURE_MODAL_STORE ).selectShouldSkipApprove() ).toBe( false );
	} );

	it( "opens the modal without skipping approve", () => {
		registry.dispatch( FEATURE_MODAL_STORE ).openModal( false );
		expect( registry.select( FEATURE_MODAL_STORE ).selectIsModalOpen() ).toBe( true );
		expect( registry.select( FEATURE_MODAL_STORE ).selectShouldSkipApprove() ).toBe( false );
	} );

	it( "opens the modal with skipApprove true", () => {
		registry.dispatch( FEATURE_MODAL_STORE ).openModal( true );
		expect( registry.select( FEATURE_MODAL_STORE ).selectIsModalOpen() ).toBe( true );
		expect( registry.select( FEATURE_MODAL_STORE ).selectShouldSkipApprove() ).toBe( true );
	} );

	it( "closes the modal and resets state", () => {
		registry.dispatch( FEATURE_MODAL_STORE ).openModal( true );
		registry.dispatch( FEATURE_MODAL_STORE ).closeModal();
		expect( registry.select( FEATURE_MODAL_STORE ).selectIsModalOpen() ).toBe( false );
		expect( registry.select( FEATURE_MODAL_STORE ).selectShouldSkipApprove() ).toBe( false );
	} );
} );
