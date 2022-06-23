import isIdentifierFilledIn, { hasVariants } from "../../../src/languageProcessing/researches/productIdentifierData.js";


describe( "A test to check if the product identifier is filled in", () => {
	it( "returns true if the element ID field is not empty", function() {
		document.getElementById = function() {
			return { value: "1234" };
		};

		expect( isIdentifierFilledIn( "elementID" ) ).toEqual( true );
	} );

	it( "returns false if the element ID field is empty", function() {
		document.getElementById = function() {
			return { value: "" };
		};

		expect( isIdentifierFilledIn( "elementID" ) ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns true if the value field is not empty", function() {
		document.getElementsByClassName.namedItem = function() {
			return { "data-total": "2" };
		};

		expect( hasVariants() ).toEqual( true );
	} );

	it( "returns false if the value field is 0", function() {
		document.getElementsByClassName.namedItem = function() {
			return { "data-total": "" };
		};
		console.log(document.getElementsByClassName.namedItem(), "result");
		expect( hasVariants() ).toEqual( false );
	} );
} );
