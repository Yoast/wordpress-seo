jest.mock( "../../../src/helpers/fields/rest-meta", () => ( {
	getMetaValue: jest.fn(),
	setMetaValue: jest.fn(),
} ) );

import { createElement } from "../../test-utils";
import { getMetaValue, setMetaValue } from "../../../src/helpers/fields/rest-meta";
import PrimaryTermFields from "../../../src/helpers/fields/PrimaryTermFields";

afterEach( () => {
	jest.clearAllMocks();
} );

describe( "PrimaryTermFields.getPrimaryTermElement", () => {
	it( "returns element.value when element is provided", () => {
		const el = createElement( "fieldId", "42" );
		expect( PrimaryTermFields.getPrimaryTermElement( "fieldId" ) ).toBe( el );
	} );
} );

describe( "PrimaryTermFields.get", () => {
	it( "calls getMetaValue with the correct meta key for the taxonomy", () => {
		const el = createElement( "field-get-1", "5" );
		PrimaryTermFields.get( "category", "field-get-1" );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "" );
	} );

	it( "returns the value from getMetaValue", () => {
		createElement( "field-get-2", "5" );
		getMetaValue.mockReturnValue( "99" );
		const result = PrimaryTermFields.get( "category", "field-get-2" );
		expect( result ).toBe( "99" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		createElement( "field-get-3" );
		PrimaryTermFields.get( "post_tag", "field-get-3" );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", expect.anything(), "" );
	} );
} );

describe( "PrimaryTermFields.set", () => {
	it( "calls setMetaValue with the term ID coerced to string", () => {
		const el = createElement( "field-set-1" );
		PrimaryTermFields.set( "category", "field-set-1", 42 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "42" );
	} );

	it( "passes empty string when termId is -1 (clear selection)", () => {
		const el = createElement( "field-set-2" );
		PrimaryTermFields.set( "category", "field-set-2", -1 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		const el = createElement( "field-set-3" );
		PrimaryTermFields.set( "post_tag", "field-set-3", 7 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", el, "7" );
	} );

	it( "passes null element through to setMetaValue", () => {
		PrimaryTermFields.set( "category", "non-existent-field", 5 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", null, "5" );
	} );
} );
