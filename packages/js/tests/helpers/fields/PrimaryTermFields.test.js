jest.mock( "../../../src/helpers/fields/rest-meta", () => ( {
	getMetaValue: jest.fn(),
	setMetaValue: jest.fn(),
} ) );

import { getMetaValue, setMetaValue } from "../../../src/helpers/fields/rest-meta";
import PrimaryTermFields from "../../../src/helpers/fields/PrimaryTermFields";

afterEach( () => {
	jest.clearAllMocks();
} );

describe( "PrimaryTermFields.getInitialValue", () => {
	it( "returns element.value when element is provided", () => {
		expect( PrimaryTermFields.getInitialValue( { value: "42" }, 99 ) ).toBe( "42" );
	} );

	it( "returns empty string when element.value is empty", () => {
		expect( PrimaryTermFields.getInitialValue( { value: "" }, 99 ) ).toBe( "" );
	} );

	it( "returns String(fallback) when element is null", () => {
		expect( PrimaryTermFields.getInitialValue( null, 5 ) ).toBe( "5" );
	} );

	it( "returns empty string when element is null and fallback is null", () => {
		expect( PrimaryTermFields.getInitialValue( null, null ) ).toBe( "" );
	} );
} );

describe( "PrimaryTermFields.get", () => {
	it( "calls getMetaValue with the correct meta key for the taxonomy", () => {
		getMetaValue.mockReturnValue( "7" );
		const element = { value: "7" };
		PrimaryTermFields.get( "category", element );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", element, "" );
	} );

	it( "returns the value from getMetaValue", () => {
		getMetaValue.mockReturnValue( "7" );
		expect( PrimaryTermFields.get( "category", null ) ).toBe( "7" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		getMetaValue.mockReturnValue( "" );
		PrimaryTermFields.get( "post_tag", null );
		expect( getMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", null, "" );
	} );
} );

describe( "PrimaryTermFields.set", () => {
	it( "calls setMetaValue with the term ID coerced to string", () => {
		const element = { value: "" };
		PrimaryTermFields.set( "category", 42, element );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", element, "42" );
	} );

	it( "passes empty string when termId is -1 (clear selection)", () => {
		const element = { value: "3" };
		PrimaryTermFields.set( "category", -1, element );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", element, "" );
	} );

	it( "builds the meta key from the taxonomy name", () => {
		PrimaryTermFields.set( "post_tag", 10, null );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_post_tag", null, "10" );
	} );

	it( "passes null element through to setMetaValue", () => {
		PrimaryTermFields.set( "category", 5, null );
		expect( setMetaValue ).toHaveBeenCalledWith( "_yoast_wpseo_primary_category", null, "5" );
	} );
} );
