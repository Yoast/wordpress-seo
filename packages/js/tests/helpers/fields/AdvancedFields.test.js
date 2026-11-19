import AdvancedFields from "../../../src/helpers/fields/AdvancedFields";
import { mockWindow, createInputElement } from "../../test-utils";

afterEach( () => {
	document.body.innerHTML = "";
} );

describe( "noIndexElement", () => {
	it( "uses the post ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-noindex" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.noIndexElement ).toBe( el );
		spy.mockRestore();
	} );

	it( "uses the term ID when isPost is false", () => {
		const el = createInputElement( "hidden_wpseo_noindex" );
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		expect( AdvancedFields.noIndexElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "noFollowElement", () => {
	it( "returns null when absent", () => {
		expect( AdvancedFields.noFollowElement ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-nofollow" );
		expect( AdvancedFields.noFollowElement ).toBe( el );
	} );
} );

describe( "advancedElement", () => {
	it( "returns null when absent", () => {
		expect( AdvancedFields.advancedElement ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-adv" );
		expect( AdvancedFields.advancedElement ).toBe( el );
	} );
} );

describe( "breadcrumbsTitleElement", () => {
	it( "uses the post ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_bctitle" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.breadcrumbsTitleElement ).toBe( el );
		spy.mockRestore();
	} );

	it( "uses the term ID when isPost is false", () => {
		const el = createInputElement( "hidden_wpseo_bctitle" );
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		expect( AdvancedFields.breadcrumbsTitleElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "canonicalElement", () => {
	it( "uses the post ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_canonical" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.canonicalElement ).toBe( el );
		spy.mockRestore();
	} );

	it( "uses the term ID when isPost is false", () => {
		const el = createInputElement( "hidden_wpseo_canonical" );
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		expect( AdvancedFields.canonicalElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "noIndex", () => {
	it( "returns '0' as fallback when element is absent", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.noIndex ).toBe( "0" );
		spy.mockRestore();
	} );

	it( "gets the value from the element", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-noindex", "1" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.noIndex ).toBe( "1" );
		el.remove();
		spy.mockRestore();
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-noindex" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		AdvancedFields.noIndex = "2";
		expect( el.value ).toBe( "2" );
		spy.mockRestore();
	} );
} );

describe( "noFollow", () => {
	it( "returns '0' as fallback when element is absent", () => {
		expect( AdvancedFields.noFollow ).toBe( "0" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_meta-robots-nofollow", "1" );
		expect( AdvancedFields.noFollow ).toBe( "1" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-nofollow" );
		AdvancedFields.noFollow = "1";
		expect( el.value ).toBe( "1" );
	} );
} );

describe( "advanced", () => {
	it( "returns an empty string when element is absent", () => {
		expect( AdvancedFields.advanced ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_meta-robots-adv", "noodp" );
		expect( AdvancedFields.advanced ).toBe( "noodp" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_meta-robots-adv" );
		AdvancedFields.advanced = "noodp,noydir";
		expect( el.value ).toBe( "noodp,noydir" );
	} );
} );

describe( "breadcrumbsTitle", () => {
	it( "returns an empty string when element is absent", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.breadcrumbsTitle ).toBe( "" );
		spy.mockRestore();
	} );

	it( "gets the value from the element", () => {
		const el = createInputElement( "yoast_wpseo_bctitle", "My Breadcrumb" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.breadcrumbsTitle ).toBe( "My Breadcrumb" );
		el.remove();
		spy.mockRestore();
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_bctitle" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		AdvancedFields.breadcrumbsTitle = "Custom Title";
		expect( el.value ).toBe( "Custom Title" );
		spy.mockRestore();
	} );
} );

describe( "canonical", () => {
	it( "returns an empty string when element is absent", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.canonical ).toBe( "" );
		spy.mockRestore();
	} );

	it( "gets the value from the element", () => {
		const el = createInputElement( "yoast_wpseo_canonical", "https://example.com/" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		expect( AdvancedFields.canonical ).toBe( "https://example.com/" );
		el.remove();
		spy.mockRestore();
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_canonical" );
		const spy = mockWindow( { wpseoScriptData: { isPost: true } } );
		AdvancedFields.canonical = "https://example.com/page/";
		expect( el.value ).toBe( "https://example.com/page/" );
		spy.mockRestore();
	} );
} );
