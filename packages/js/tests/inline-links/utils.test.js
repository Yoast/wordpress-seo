import { createLinkFormat, isValidHref } from "../../src/inline-links/utils";

describe( "createLinkFormat", () => {
	it( "creates a basic link format with just a URL", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
		} );

		expect( result ).toEqual( {
			type: "core/link",
			attributes: {
				url: "https://example.com",
			},
		} );
	} );

	it( "adds target attribute when opensInNewWindow is true", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			opensInNewWindow: true,
		} );

		expect( result.attributes.target ).toBe( "_blank" );
		expect( result.attributes.rel ).toBe( "noreferrer noopener" );
	} );

	it( "adds nofollow rel attribute", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			noFollow: true,
		} );

		expect( result.attributes.rel ).toBe( "nofollow" );
	} );

	it( "adds sponsored and nofollow rel attributes", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			sponsored: true,
		} );

		expect( result.attributes.rel ).toBe( "sponsored nofollow" );
	} );

	it( "combines multiple rel attributes correctly", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			opensInNewWindow: true,
			noFollow: true,
		} );

		// Should contain noreferrer, noopener, and nofollow
		expect( result.attributes.rel ).toContain( "noreferrer" );
		expect( result.attributes.rel ).toContain( "noopener" );
		expect( result.attributes.rel ).toContain( "nofollow" );
	} );

	it( "adds type attribute when provided", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			type: "post",
		} );

		expect( result.attributes.type ).toBe( "post" );
	} );

	it( "adds id attribute when provided", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			id: "123",
		} );

		expect( result.attributes.id ).toBe( "123" );
	} );

	it( "adds className attribute when provided", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			className: "my-custom-class",
		} );

		expect( result.attributes.class ).toBe( "my-custom-class" );
	} );

	it( "creates a complete link format with all attributes", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
			type: "post",
			id: "123",
			opensInNewWindow: true,
			noFollow: true,
			sponsored: false,
			className: "custom-link",
		} );

		expect( result ).toEqual( {
			type: "core/link",
			attributes: {
				url: "https://example.com",
				type: "post",
				id: "123",
				target: "_blank",
				rel: expect.stringContaining( "noreferrer" ),
				"class": "custom-link",
			},
		} );
	} );

	it( "does not add optional attributes when not provided", () => {
		const result = createLinkFormat( {
			url: "https://example.com",
		} );

		expect( result.attributes.type ).toBeUndefined();
		expect( result.attributes.id ).toBeUndefined();
		expect( result.attributes.target ).toBeUndefined();
		expect( result.attributes.rel ).toBeUndefined();
		expect( result.attributes.class ).toBeUndefined();
	} );
} );

describe( "isValidHref", () => {
	it( "returns false for empty href", () => {
		expect( isValidHref( "" ) ).toBe( false );
	} );

	it( "returns false for whitespace-only href", () => {
		expect( isValidHref( "   " ) ).toBe( false );
	} );

	it( "returns true for valid HTTP URL", () => {
		expect( isValidHref( "http://example.com" ) ).toBe( true );
	} );

	it( "returns true for valid HTTPS URL", () => {
		expect( isValidHref( "https://example.com" ) ).toBe( true );
	} );

	it( "returns true for valid anchor link", () => {
		expect( isValidHref( "#section" ) ).toBe( true );
	} );

	it( "returns true for relative URL", () => {
		expect( isValidHref( "/page" ) ).toBe( true );
	} );

	it( "returns false for invalid HTTP URL format", () => {
		expect( isValidHref( "http:/example.com" ) ).toBe( false );
	} );
} );
