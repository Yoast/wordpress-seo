import productSKUData from "../../../src/languageProcessing/researches/getProductSKUData.js";
import Paper from "../../../src/values/Paper.js";

describe( "A test to check if at least one global product SKU is filled in", () => {
	it( "returns true if at least one SKU is filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalSKU: true,
			},
		} );

		expect( productSKUData( paper ).hasGlobalSKU ).toEqual( true );
	} );

	it( "returns false if no SKUs are filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalSKU: false,
			},
		} );

		expect( productSKUData( paper ).hasGlobalSKU ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns true if the product has variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: true,
			},
		} );

		expect( productSKUData( paper ).hasVariants ).toEqual( true );
	} );

	it( "returns false if the product has no variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: false,
			},
		} );

		expect( productSKUData( paper ).hasVariants ).toEqual( false );
	} );
} );

describe( "A test to check if at least one global product SKU is filled in", () => {
	it( "returns true if at least one SKU is filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalSKU: true,
			},
		} );

		expect( productSKUData( paper ).hasGlobalSKU ).toEqual( true );
	} );

	it( "returns false if no SKUs are filled in", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasGlobalSKU: false,
			},
		} );

		expect( productSKUData( paper ).hasGlobalSKU ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns true if the data-total attribute of the woocommerce_variations class is not 0 or undefined", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: true,
			},
		} );

		expect( productSKUData( paper ).hasVariants ).toEqual( true );
	} );

	it( "returns false if the product has no variants", function() {
		const paper = new Paper( "Text.", {
			customData: {
				hasVariants: false,
			},
		} );

		expect( productSKUData( paper ).hasVariants ).toEqual( false );
	} );
} );

describe( "A test to check if all variants of a product have a SKU", () => {
	it( "returns false if one or more of the variants doesn't have a SKU", function() {
		const paper = new Paper( "Text.", {
			customData: {
				doAllVariantsHaveSKU: false,
			},
		} );

		expect( productSKUData( paper ).doAllVariantsHaveSKU ).toEqual( false );
	} );

	it( "returns true if all variants have a SKU", function() {
		const paper = new Paper( "Text.", {
			customData: {
				doAllVariantsHaveSKU: true,
			},
		} );

		expect( productSKUData( paper ).doAllVariantsHaveSKU ).toEqual( true );
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
			expect( productSKUData( paper ).productType ).toEqual( productType );
		} );
	} );
} );
