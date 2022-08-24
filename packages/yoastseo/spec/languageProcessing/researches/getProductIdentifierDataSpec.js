import productIdentifierData from "../../../src/languageProcessing/researches/getProductIdentifierData.js";
import Paper from "../../../src/values/Paper.js";

describe( "A test to check if at least one global product barcode is filled in", () => {
	it( "returns true if at least one barcode is filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalIdentifier: true,
			},
		} );

		expect( productIdentifierData( paper ).hasGlobalIdentifier ).toEqual( true );
	} );

	it( "returns false if no barcodes are filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalIdentifier: false,
			},
		} );

		expect( productIdentifierData( paper ).hasGlobalIdentifier ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns true if the product has variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: true,
			},
		} );

		expect( productIdentifierData( paper ).hasVariants ).toEqual( true );
	} );

	it( "returns false if the product has no variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: false,
			},
		} );

		expect( productIdentifierData( paper ).hasVariants ).toEqual( false );
	} );
} );

describe( "A test to check if at least one global product identifier is filled in", () => {
	it( "returns true if at least one identifier is filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalIdentifier: true,
			},
		} );

		expect( productIdentifierData( paper ).hasGlobalIdentifier ).toEqual( true );
	} );

	it( "returns false if no identifiers are filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalIdentifier: false,
			},
		} );

		expect( productIdentifierData( paper ).hasGlobalIdentifier ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns false if the product has no variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: true,
			},
		} );

		expect( productIdentifierData( paper ).hasVariants ).toEqual( true );
	} );

	it( "returns false if the data-total attribute of the woocommerce_variations class is 0", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: false,
			},
		} );

		expect( productIdentifierData( paper ).hasVariants ).toEqual( false );
	} );
} );

describe( "A test to check if all variants of a product have an identifier", () => {
	it( "returns false if one or more of the variants doesn't have an identifier", function() {
		const paper = new Paper( "Text.", {
			customData: {
				doAllVariantsHaveIdentifier: false,
			},
		} );

		expect( productIdentifierData( paper ).doAllVariantsHaveIdentifier ).toEqual( false );
	} );

	it( "returns true if all variants have an identifier", function() {
		const paper = new Paper( "Text.", {
			customData: {
				doAllVariantsHaveIdentifier: true,
			},
		} );

		expect( productIdentifierData( paper ).doAllVariantsHaveIdentifier ).toEqual( true );
	} );
} );


describe( "correctly adds productType to data", () => {
	it( "correctly adds productType to data", () => {
		[ "simple", "variable", "grouped", "external" ].forEach( productType => {
			const paper = new Paper( "Text.", {
				customData: {
					doAllVariantsHaveSKU: true,
					productType: productType,
				},
			} );
			expect( productIdentifierData( paper ).productType ).toEqual( productType );
		} );
	} );
} );
