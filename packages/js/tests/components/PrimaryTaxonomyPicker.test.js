import { render } from "../test-utils";
import PrimaryTaxonomyPicker from "../../src/components/PrimaryTaxonomyPicker";

// Return a never-settling promise so the fetchTerms .then() handler never fires
// and no setState call escapes the act() boundary of the render.
jest.mock( "@wordpress/api-fetch", () => jest.fn().mockReturnValue( new Promise( () => {} ) ) );

const defaultProps = {
	taxonomy: {
		name: "category",
		fieldId: "category-field",
		restBase: "categories",
		singularLabel: "Category",
	},
	selectedTermIds: [],
	primaryTaxonomyId: -1,
	learnMoreLink: "https://example.com",
	setPrimaryTaxonomyId: jest.fn(),
	updateReplacementVariable: jest.fn(),
};

describe( "PrimaryTaxonomyPicker constructor", () => {
	let getElementByIdSpy;

	afterEach( () => {
		getElementByIdSpy.mockRestore();
		jest.clearAllMocks();
	} );

	it( "dispatches -1 when the hidden input field is empty", () => {
		getElementByIdSpy = jest.spyOn( document, "getElementById" ).mockReturnValue( { value: "" } );
		const setPrimaryTaxonomyId = jest.fn();

		render( <PrimaryTaxonomyPicker { ...defaultProps } setPrimaryTaxonomyId={ setPrimaryTaxonomyId } /> );

		expect( setPrimaryTaxonomyId ).toHaveBeenCalledWith( "category", -1 );
	} );

	it( "dispatches the parsed integer when the hidden input field contains a valid id", () => {
		getElementByIdSpy = jest.spyOn( document, "getElementById" ).mockReturnValue( { value: "42" } );
		const setPrimaryTaxonomyId = jest.fn();

		render( <PrimaryTaxonomyPicker { ...defaultProps } setPrimaryTaxonomyId={ setPrimaryTaxonomyId } /> );

		expect( setPrimaryTaxonomyId ).toHaveBeenCalledWith( "category", 42 );
	} );

	it( "dispatches -1 when the hidden input field contains a non-numeric value", () => {
		getElementByIdSpy = jest.spyOn( document, "getElementById" ).mockReturnValue( { value: "abc" } );
		const setPrimaryTaxonomyId = jest.fn();

		render( <PrimaryTaxonomyPicker { ...defaultProps } setPrimaryTaxonomyId={ setPrimaryTaxonomyId } /> );

		expect( setPrimaryTaxonomyId ).toHaveBeenCalledWith( "category", -1 );
	} );
} );
