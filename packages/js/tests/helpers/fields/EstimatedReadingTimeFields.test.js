import EstimatedReadingTimeFields from "../../../src/helpers/fields/EstimatedReadingTimeFields";

const ELEMENT_ID = "yoast_wpseo_estimated-reading-time-minutes";

const createElement = () => {
	const el = document.createElement( "input" );
	el.id = ELEMENT_ID;
	document.body.appendChild( el );
	return el;
};

afterEach( () => {
	document.body.innerHTML = "";
} );

describe( "estimatedReadingTimeElement", () => {
	it( "returns null when the element is absent", () => {
		expect( EstimatedReadingTimeFields.estimatedReadingTimeElement ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createElement();
		expect( EstimatedReadingTimeFields.estimatedReadingTimeElement ).toBe( el );
	} );
} );

describe( "estimatedReadingTime getter", () => {
	it( "returns an empty string when the element is absent", () => {
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "" );
	} );

	it( "returns the element value", () => {
		const el = createElement();
		el.value = "5";
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "5" );
	} );
} );

describe( "estimatedReadingTime setter", () => {
	it( "does nothing when the element is absent", () => {
		expect( () => {
			EstimatedReadingTimeFields.estimatedReadingTime = "5";
		} ).not.toThrow();
	} );

	it( "sets the element value", () => {
		createElement();
		EstimatedReadingTimeFields.estimatedReadingTime = "7";
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "7" );
	} );
} );
