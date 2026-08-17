import { productDataSchema } from "../../src/contract/productData";

describe( "productDataSchema", () => {
	it( "accepts an empty object (every field is optional)", () => {
		expect( productDataSchema.parse( {} ) ).toEqual( {} );
	} );

	it( "accepts and passes through a fully-populated valid object", () => {
		const productData = {
			isVariableProduct: true,
			hasVariants: true,
			hasGlobalIdentifier: false,
			hasGlobalSKU: true,
			doAllVariantsHaveIdentifier: false,
			doAllVariantsHaveSKU: true,
			canRetrieveGlobalIdentifier: true,
			canRetrieveGlobalSku: true,
			canRetrieveVariantIdentifiers: false,
			canRetrieveVariantSkus: false,
		};
		expect( productDataSchema.parse( productData ) ).toEqual( productData );
	} );

	it( "accepts the deprecated `productType` string (back-compat source)", () => {
		expect( productDataSchema.parse( { productType: "variable" } ) ).toEqual( { productType: "variable" } );
	} );

	it( "does not inject defaults — absent fields stay absent (defaulting is normalizeProductData's job)", () => {
		const result = productDataSchema.parse( { hasVariants: true } );
		expect( result ).toEqual( { hasVariants: true } );
		expect( result.isVariableProduct ).toBeUndefined();
		expect( result.canRetrieveGlobalSku ).toBeUndefined();
	} );

	it( "rejects unknown or typo'd keys (strict)", () => {
		// Wrong casing of `hasGlobalSKU`.
		expect( () => productDataSchema.parse( { hasGlobalSku: true } ) ).toThrow();
		expect( () => productDataSchema.parse( { unexpected: true } ) ).toThrow();
	} );

	it( "rejects wrong field types", () => {
		expect( () => productDataSchema.parse( { isVariableProduct: "yes" } ) ).toThrow();
		expect( () => productDataSchema.parse( { hasGlobalSKU: 1 } ) ).toThrow();
		expect( () => productDataSchema.parse( { productType: 5 } ) ).toThrow();
	} );
} );
