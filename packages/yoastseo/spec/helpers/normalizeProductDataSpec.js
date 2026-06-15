import Paper from "../../src/values/Paper";
import normalizeProductData from "../../src/helpers/normalizeProductData";

describe( "normalizeProductData", () => {
	it( "reads from the first-class productData field when present", () => {
		const paper = new Paper( "", { productData: { isVariableProduct: true, hasVariants: true, hasGlobalSKU: false } } );
		expect( normalizeProductData( paper ) ).toEqual( { isVariableProduct: true, hasVariants: true, hasGlobalSKU: false } );
	} );

	it( "falls back to the legacy product keys in customData when the productData field is empty", () => {
		const paper = new Paper( "", { customData: { productType: "variable", hasVariants: true, hasGlobalSKU: false } } );
		const result = normalizeProductData( paper );
		expect( result.isVariableProduct ).toBe( true );
		expect( result.hasVariants ).toBe( true );
		expect( result.hasGlobalSKU ).toBe( false );
	} );

	it( "prefers the productData field over legacy customData when both are present", () => {
		const paper = new Paper( "", {
			productData: { isVariableProduct: false, hasVariants: false },
			customData: { productType: "variable", hasVariants: true },
		} );
		const result = normalizeProductData( paper );
		expect( result.isVariableProduct ).toBe( false );
		expect( result.hasVariants ).toBe( false );
	} );

	describe( "deriving isVariableProduct (back-compat shim)", () => {
		it( "derives true from a legacy productType of 'variable'", () => {
			const paper = new Paper( "", { customData: { productType: "variable" } } );
			expect( normalizeProductData( paper ).isVariableProduct ).toBe( true );
		} );

		it.each( [ "simple", "external", "grouped" ] )( "derives false from a legacy productType of '%s'", ( productType ) => {
			const paper = new Paper( "", { customData: { productType } } );
			expect( normalizeProductData( paper ).isVariableProduct ).toBe( false );
		} );

		it( "derives false when neither isVariableProduct nor productType is provided", () => {
			const paper = new Paper( "", { productData: { hasVariants: false } } );
			expect( normalizeProductData( paper ).isVariableProduct ).toBe( false );
		} );

		it( "keeps an explicit isVariableProduct of false rather than deriving it", () => {
			const paper = new Paper( "", { productData: { isVariableProduct: false, productType: "variable" } } );
			expect( normalizeProductData( paper ).isVariableProduct ).toBe( false );
		} );
	} );

	it( "preserves undefined for absent optional keys (does not coerce to false)", () => {
		const paper = new Paper( "", { productData: { isVariableProduct: false, hasVariants: false } } );
		const result = normalizeProductData( paper );
		expect( result.canRetrieveGlobalSku ).toBeUndefined();
		expect( result.canRetrieveVariantSkus ).toBeUndefined();
		expect( result.canRetrieveGlobalIdentifier ).toBeUndefined();
		expect( result.doAllVariantsHaveSKU ).toBeUndefined();
	} );

	it( "returns isVariableProduct false for a paper with no product data at all", () => {
		const paper = new Paper( "" );
		expect( normalizeProductData( paper ).isVariableProduct ).toBe( false );
	} );
} );
