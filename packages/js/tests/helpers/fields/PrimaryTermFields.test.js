jest.mock( "../../../src/helpers/fields/rest-meta", () => ( {
	getMetaValue: jest.fn(),
	setMetaValue: jest.fn(),
	deferMetaWrite: jest.fn(),
	isRestMetaActive: jest.fn().mockReturnValue( false ),
} ) );

import { createInputElement } from "../../test-utils";
import { getMetaValue, setMetaValue, deferMetaWrite, isRestMetaActive } from "../../../src/helpers/fields/rest-meta";
import PrimaryTermFields from "../../../src/helpers/fields/PrimaryTermFields";

afterEach( () => {
	jest.clearAllMocks();
} );

describe( "PrimaryTermFields.getPrimaryTermElement", () => {
	it( "returns element.value when element is provided", () => {
		const el = createInputElement( "fieldId", "42" );
		expect( PrimaryTermFields.getPrimaryTermElement( "fieldId" ) ).toBe( el );
	} );
} );

describe( "PrimaryTermFields.get", () => {
	it( "calls getMetaValue with the correct meta key for the taxonomy", () => {
		const el = createInputElement( "field-get-1", "5" );
		PrimaryTermFields.get( "category", "field-get-1" );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "" );
	} );

	it( "returns the value from getMetaValue", () => {
		createInputElement( "field-get-2", "5" );
		getMetaValue.mockReturnValue( "99" );
		const result = PrimaryTermFields.get( "category", "field-get-2" );
		expect( result ).toBe( "99" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		createInputElement( "field-get-3" );
		PrimaryTermFields.get( "post_tag", "field-get-3" );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", expect.anything(), "" );
	} );
} );

describe( "PrimaryTermFields.set", () => {
	it( "calls setMetaValue with the term ID coerced to string", () => {
		const el = createInputElement( "field-set-1" );
		PrimaryTermFields.set( "category", "field-set-1", 42 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "42" );
	} );

	it( "passes empty string when termId is -1 (clear selection)", () => {
		const el = createInputElement( "field-set-2" );
		PrimaryTermFields.set( "category", "field-set-2", -1 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", el, "" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		const el = createInputElement( "field-set-3" );
		PrimaryTermFields.set( "post_tag", "field-set-3", 7 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", el, "7" );
	} );

	it( "passes null element through to setMetaValue", () => {
		PrimaryTermFields.set( "category", "non-existent-field", 5 );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", null, "5" );
	} );
} );

describe( "PrimaryTermFields.setDeferred (REST meta inactive)", () => {
	it( "writes the term ID to the DOM element", () => {
		const el = createInputElement( "field-deferred-1" );
		PrimaryTermFields.setDeferred( "category", "field-deferred-1", 7 );
		expect( el.value ).toBe( "7" );
	} );

	it( "writes empty string when termId is -1", () => {
		const el = createInputElement( "field-deferred-2", "3" );
		PrimaryTermFields.setDeferred( "category", "field-deferred-2", -1 );
		expect( el.value ).toBe( "" );
	} );

	it( "does nothing when the element does not exist", () => {
		expect( () => PrimaryTermFields.setDeferred( "category", "non-existent", 5 ) ).not.toThrow();
		expect( deferMetaWrite ).not.toHaveBeenCalled();
	} );
} );

describe( "PrimaryTermFields.setDeferred (REST meta active)", () => {
	beforeEach( () => {
		isRestMetaActive.mockReturnValue( true );
	} );

	afterEach( () => {
		isRestMetaActive.mockReturnValue( false );
	} );

	it( "calls deferMetaWrite with the correct meta key and value", () => {
		PrimaryTermFields.setDeferred( "category", "field-deferred-rest-1", 42 );
		expect( deferMetaWrite ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", "42" );
	} );

	it( "passes empty string when termId is -1", () => {
		PrimaryTermFields.setDeferred( "category", "field-deferred-rest-2", -1 );
		expect( deferMetaWrite ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", "" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		PrimaryTermFields.setDeferred( "post_tag", "field-deferred-rest-3", 9 );
		expect( deferMetaWrite ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", "9" );
	} );

	it( "does not write to the DOM element in REST mode", () => {
		const el = createInputElement( "field-deferred-rest-4", "original" );
		PrimaryTermFields.setDeferred( "category", "field-deferred-rest-4", 5 );
		expect( el.value ).toBe( "original" );
	} );
} );
