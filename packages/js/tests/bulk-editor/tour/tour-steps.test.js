import { getTourSteps } from "../../../src/bulk-editor/components/tour/tour-steps";

describe( "getTourSteps", () => {
	it( "returns the four tour steps in order", () => {
		const steps = getTourSteps();

		expect( steps.map( ( step ) => step.tourId ) ).toEqual( [
			"content-type-nav",
			"appearance-tabs",
			"selection-toolbar",
			"generate-actions",
		] );
	} );

	it( "gives every step a unique id, a title and content", () => {
		const steps = getTourSteps();
		const ids = steps.map( ( step ) => step.id );

		expect( new Set( ids ).size ).toBe( steps.length );
		steps.forEach( ( step ) => {
			expect( typeof step.title ).toBe( "string" );
			expect( step.title.length ).toBeGreaterThan( 0 );
			expect( typeof step.content ).toBe( "string" );
			expect( step.content.length ).toBeGreaterThan( 0 );
		} );
	} );

	it( "marks only the generate step as requiring a selection", () => {
		const requiresSelection = getTourSteps().filter( ( step ) => step.requiresSelection );

		expect( requiresSelection ).toHaveLength( 1 );
		expect( requiresSelection[ 0 ].tourId ).toBe( "generate-actions" );
	} );
} );
