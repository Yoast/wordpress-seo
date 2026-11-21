import reducer, {
	createInitialExternalGenerationState,
	externalGenerationActions,
	externalGenerationSelectors,
} from "../../../src/bulk-editor/store/external-generation";

describe( "external-generation slice", () => {
	it( "defaults to no external generation", () => {
		expect( createInitialExternalGenerationState() ).toBe( false );
	} );

	it( "updates the state via setHasExternalGeneration", () => {
		expect( reducer( false, externalGenerationActions.setHasExternalGeneration( true ) ) ).toBe( true );
	} );

	it( "coerces the payload to a boolean", () => {
		expect( reducer( true, externalGenerationActions.setHasExternalGeneration( 0 ) ) ).toBe( false );
	} );

	it( "selects the external-generation state from the store state", () => {
		expect( externalGenerationSelectors.selectHasExternalGeneration( { externalGeneration: true } ) ).toBe( true );
	} );

	it( "falls back to false when the state is missing", () => {
		expect( externalGenerationSelectors.selectHasExternalGeneration( {} ) ).toBe( false );
	} );
} );
