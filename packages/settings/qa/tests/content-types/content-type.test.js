import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { findHeadersByText, navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import { forEach, merge } from "lodash";

import falseConfig from "../../test-configs/false-config";
import trueConfigEmptyData from "../../test-configs/true-config-empty-data";
import trueConfigTestData from "../../test-configs/true-config-test-data";
import { startTheApp } from "../helpers";

/* eslint-disable max-statements */
let testConfig;

describe( "A content types page with all options set to false", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, falseConfig );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "is not a navgroup if there are no content types added", () => {
		// Overriding the beforeEach to specifically test with empty content type options.
		testConfig.options.contentTypes = {};

		// Start and navigate and land on default page.
		startTheApp( testConfig );

		// There is a nav
		within( screen.getByRole( "navigation" ) ).getByText( "Site defaults" );

		// But there is no Content Types collapsible to click.
		expect( () => navigateByNavText( "test", "Content types" ) ).toThrowError( "Unable to find an element with the text: Content types" );
	} );

	it( "can be navigated to if there are content types specified", () => {
		// Start and land on default page.
		startTheApp( testConfig );

		// There is a nav with a Content Types navgroup. It is collapsed by default.
		const Nav = screen.getByRole( "navigation" );
		const ContentTypesNavGroup = within( Nav ).getByText( "Content types" );
		forEach( testConfig.options.contentTypes, ( contentTypeOption ) => {
			expect( within( Nav ).queryByText( contentTypeOption.label ) ).toBeNull();
		} );

		// Clicking the navgroup to open content types.
		userEvent.click( ContentTypesNavGroup );

		// All passed contentType options are there and can be navigated to.
		forEach( testConfig.options.contentTypes, ( contentTypeOption ) => {
			const navLink = within( Nav ).getByText( contentTypeOption.label );
			userEvent.click( navLink );

			// Did we navigate to the correct Content Types page? There should be an H1 with content type label at the top.
			const currentH1 = screen.getByRole( "heading", { level: 1 } );
			expect( currentH1.innerHTML ).toEqual( contentTypeOption.label );

			/*
			 Deprecation warning for React lifecycle methods, coming from the mentions plugin and replacevarEditor.
			 Delete this assertion once issue is fixed.
			 */
			expect( console ).toHaveWarned();

			// Jed localization error relating to `yoast-components` domain not being found. Delete this assertion once issue is fixed.
			expect( console ).toHaveErrored();
		} );
	} );

	it( "does not have content types that have both hasSinglePage and hasArchive set to false", () => {
		// Add a valid content type with bad options.
		testConfig.options.contentTypes.emptyPage = {
			slug: "emptyPage",
			label: "Empty page",
			hasSinglePage: false,
			hasArchive: false,
		};

		// Start and navigate to one of the content types that should be present. This also expands the navgroup.
		startTheApp( testConfig, "Single only", "Content types" );

		const Nav = screen.getByRole( "navigation" );

		forEach( testConfig.options.contentTypes, ( contentTypeOption ) => {
			if ( contentTypeOption.slug === "emptyPage" ) {
				// Empty page should not be there.
				expect( within( Nav ).queryByText( contentTypeOption.label ) ).toBeNull();
				return;
			}
			// Other pages should be there.
			expect( within( Nav ).getByText( contentTypeOption.label ).tagName ).toBe( "A" );
		} );
	} );

	it( "has correct single content type settings when appropriate", () => {
		const TestContentTypeName = "Single only";
		// Start and navigate to the Single only test content type. This also expands the navgroup.
		startTheApp( testConfig, TestContentTypeName, "Content types" );

		// Did we navigate to the correct Content Types page? There should be an H1 with content type label at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( TestContentTypeName );

		// Is there a Single [Content type] explainer at the top? Example looks a bit weird due to the naming of content type in this test.
		const SingleSettingsHeader = findHeadersByText( `Single ${ TestContentTypeName }`, 2 );
		expect( SingleSettingsHeader[ 0 ].tagName ).toBe( "H2" );

		// There a description following the header.
		expect( SingleSettingsHeader[ 0 ].nextSibling.textContent )
			.toEqual( `These settings are specifically for setting up defaults for your single ${ TestContentTypeName }.` );

		// There is a search appearance header
		const SearchAppearanceHeader = screen.getByText( "Search appearance" );
		expect( SearchAppearanceHeader.tagName ).toBe( "H2" );
		expect( SearchAppearanceHeader.nextSibling.textContent )
			.toEqual( `Choose how your ${ TestContentTypeName } should look in search engines by default. ` +
				`You can always customize this for individual ${ TestContentTypeName }.` );

		// There is a toggle for showing the search results:
		const ToggleLabelSpan = screen.getByText( `Show ${ TestContentTypeName } in search results` );
		expect( ToggleLabelSpan.nextSibling.textContent ).toBe(
			`Be aware that disabling this toggle has serious consequences: ${ TestContentTypeName } ` +
			"will not be indexed by search engines and will be excluded from XML sitemaps.",
		);
		const SwitchElement = screen.getByLabelText( ToggleLabelSpan.parentElement.textContent );
		expect( SwitchElement.getAttribute( "role" ) ).toBe( "switch" );
		expect( SwitchElement.parentElement.nextSibling.tagName ).toBe( "HR" );

		// There is no archive settings, so there should be only one SEO title input.
		expect( screen.getByLabelText( "SEO title" ) );

		// There is no archive settings, so there should be only one Meta description input.
		expect( screen.getByLabelText( "Meta description" ) );

		// There is no Schema because all of those are set to false in the options.
		expect( findHeadersByText( "Schema", 2 ) ).toHaveLength( 0 );

		// There is no Social Appearance because all of those are set to false in the options.
		expect( findHeadersByText( "Social Appearance", 2 ) ).toHaveLength( 0 );

		// There are no Additional settings because all of those are set to false in the options.
		expect( findHeadersByText( "Additional settings", 2 ) ).toHaveLength( 0 );

		// There is no Archive section among the H2's
		expect( findHeadersByText( `${ TestContentTypeName } archive`, 2 ) ).toHaveLength( 0 );
	} );

	it( "has correct content type archive settings when appropriate", () => {
		const TestContentTypeName = "Archive only";
		// Start and navigate to the Single only test content type. This also expands the navgroup.
		startTheApp( testConfig, TestContentTypeName, "Content types" );

		// Did we navigate to the correct Content Types page? There should be an H1 with content type label at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( TestContentTypeName );

		// Is there a Single [Content type] explainer at the top? Example looks a bit weird due to the naming of content type in this test.
		const ArchiveSettingsHeader = findHeadersByText( `${ TestContentTypeName } archive`, 2 )[ 0 ];
		expect( ArchiveSettingsHeader.tagName ).toBe( "H2" );

		// There a description following the header.
		expect( ArchiveSettingsHeader.nextSibling.textContent )
			.toEqual( `These settings are specifically for optimizing your ${ TestContentTypeName } archive.` );

		// Is there a Search appearance section?
		const SearchAppearanceHeader = screen.getByText( "Search appearance" );
		expect( SearchAppearanceHeader.tagName ).toBe( "H2" );
		expect( SearchAppearanceHeader.nextSibling.textContent )
			.toEqual( `Choose how your ${ TestContentTypeName } archive should look in search engines.` );

		// There is a toggle for showing the search results:
		const ToggleLabelSpan = screen.getByText( `Show the archive for ${ TestContentTypeName } in search results` );
		expect( ToggleLabelSpan.nextSibling.textContent ).toBe(
			`Be aware that disabling this toggle has serious consequences: ${ TestContentTypeName } ` +
			"will not be indexed by search engines and will be excluded from XML sitemaps.",
		);
		const SwitchElement = screen.getByLabelText( ToggleLabelSpan.parentElement.textContent );
		expect( SwitchElement.getAttribute( "role" ) ).toBe( "switch" );
		expect( SwitchElement.parentElement.nextSibling.tagName ).toBe( "HR" );

		// There is no archive settings, so there should be only one SEO title input.
		expect( screen.getByLabelText( "SEO title" ) );

		// There is no archive settings, so there should be only one Meta description input.
		expect( screen.getByLabelText( "Meta description" ) );

		// There is no Schema because all of those are set to false in the options.
		expect( findHeadersByText( "Schema", 2 ) ).toHaveLength( 0 );

		// There is no Social Appearance because all of those are set to false in the options.
		expect( findHeadersByText( "Social Appearance", 2 ) ).toHaveLength( 0 );

		// There are no Additional settings because all of those are set to false in the options.
		expect( findHeadersByText( "Additional settings", 2 ) ).toHaveLength( 0 );

		// There is no Archive section among the H2's
		expect( findHeadersByText( `Single ${ TestContentTypeName }`, 2 ) ).toHaveLength( 0 );
	} );
} );

describe( "A content types page with all options set to true but empty data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "has correct single content type settings when appropriate", () => {
		const TestContentTypeName = "singleAndArchive";
		// Start and navigate to the Single only test content type. This also expands the navgroup.
		startTheApp( testConfig, TestContentTypeName, "Content types" );

		// Did we navigate to the correct Content Types page? There should be an H1 with content type label at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( TestContentTypeName );

		// Is there a Single [Content type] explainer at the top? Example looks a bit weird due to the naming of content type in this test.
		const SingleSettingsHeader = findHeadersByText( `Single ${ TestContentTypeName }`, 2 )[ 0 ];
		expect( SingleSettingsHeader.tagName ).toBe( "H2" );

		// There a description following the header.
		expect( SingleSettingsHeader.nextSibling.textContent )
			.toEqual( `These settings are specifically for setting up defaults for your single ${ TestContentTypeName }.` );

		// There should be two Search appearance sections. One for single and one for archive.
		const SearchAppearanceHeaders = screen.getAllByText( "Search appearance" );
		expect( SearchAppearanceHeaders.length ).toBe( 2 );

		// The first header is the single Search Appearance header.
		const SearchAppearanceHeader = SearchAppearanceHeaders[ 0 ];
		expect( SearchAppearanceHeader.tagName ).toBe( "H2" );
		expect( SearchAppearanceHeader.nextSibling.textContent )
			.toEqual( `Choose how your ${ TestContentTypeName } should look in search engines by default. ` +
				`You can always customize this for individual ${ TestContentTypeName }.` );

		// There is a toggle for showing the search results:
		const ToggleLabelSpan = screen.getByText( `Show ${ TestContentTypeName } in search results` );
		expect( ToggleLabelSpan.nextSibling.textContent ).toBe(
			`Be aware that disabling this toggle has serious consequences: ${ TestContentTypeName } ` +
			"will not be indexed by search engines and will be excluded from XML sitemaps.",
		);
		const SwitchElement = screen.getByLabelText( ToggleLabelSpan.parentElement.textContent );
		expect( SwitchElement.getAttribute( "role" ) ).toBe( "switch" );
		expect( SwitchElement.parentElement.nextSibling.tagName ).toBe( "HR" );

		// There are single and archive settings, so there should be two SEO title inputs.
		expect( screen.getAllByLabelText( "SEO title" ).length ).toBe( 2 );

		// There are single and archive settings, so there should be two Meta description inputs.
		expect( screen.getAllByLabelText( "Meta description" ).length ).toBe( 2 );

		// There is a Schema header because all of those are set to true in the options. Both in the single & archive sections.
		expect( findHeadersByText( "Schema", 2 ) ).toHaveLength( 2 );
		screen.getByText( `Choose how your ${ TestContentTypeName } should be described by default in your site's Schema.org markup.` );

		/*
		 The schema selects are present and have correct default values.
		 Note that the selects are actually buttons with a span reflecting the value.
		 */
		const PageTypeSelect = screen.getAllByLabelText( "Page type" )[ 0 ];
		expect( PageTypeSelect.firstChild.innerHTML ).toBe( "Web Page (default)" );
		const ArticleTypeSelect = screen.getAllByLabelText( "Article type" )[ 0 ];
		expect( ArticleTypeSelect.firstChild.innerHTML ).toBe( "Article (default)" );

		// There are the first Social Appearance headers to be followed by explanatory text.
		expect( findHeadersByText( "Social Appearance", 2 )[ 0 ].nextSibling.innerHTML ).toBe(
			`Choose how your ${ TestContentTypeName } should look on social media by default. ` +
			`You can always customize this per individual ${ TestContentTypeName }.`,
		);
		// There are two image selects, and two social title and social description inputs.
		expect( screen.getAllByLabelText( "Social image" ) ).toHaveLength( 2 );
		expect( screen.getAllByLabelText( "Social title" ) ).toHaveLength( 2 );
		expect( screen.getAllByLabelText( "Social description" ) ).toHaveLength( 2 );

		// Expect image to be empty
		expect( document.getElementById( "single-social-image-no-image-svg" ) ).toBeInTheDocument();

		// There are two Additional settings headers because all of those are set to true in the options.
		expect( findHeadersByText( "Additional settings", 2 ) ).toHaveLength( 2 );

		// The section has a toggle to disable SEO settings, and an input field for additional fields.
		expect( screen.getByLabelText( `Enable Yoast SEO for ${ TestContentTypeName }`, { exact: false } ).tagName ).toBe( "BUTTON" );
		expect( screen.getByLabelText( "Add custom fields to page analysis" ).value ).toBe( "" );
	} );

	it( "has correct content type archive settings when appropriate", () => {
		const TestContentTypeName = "singleAndArchive";
		// Start and navigate to the Single only test content type. This also expands the navgroup.
		startTheApp( testConfig, TestContentTypeName, "Content types" );

		// Did we navigate to the correct Content Types page? There should be an H1 with content type label at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( TestContentTypeName );

		// Is there a Single [Content type] explainer at the top? Example looks a bit weird due to the naming of content type in this test.
		const ArchiveSettingsHeader = findHeadersByText( `${ TestContentTypeName } archive`, 2 )[ 0 ];
		expect( ArchiveSettingsHeader.tagName ).toBe( "H2" );

		// There a description following the header.
		expect( ArchiveSettingsHeader.nextSibling.textContent )
			.toEqual( `These settings are specifically for optimizing your ${ TestContentTypeName } archive.` );

		// Are there two Search appearance sections (one for single and one for archive)?
		const SearchAppearanceHeaders = screen.getAllByText( "Search appearance" );
		expect( SearchAppearanceHeaders.length ).toBe( 2 );

		// The second header is the Archive Search Appearance header.
		const SearchAppearanceHeader = SearchAppearanceHeaders[ 1 ];
		expect( SearchAppearanceHeader.tagName ).toBe( "H2" );
		expect( SearchAppearanceHeader.nextSibling.textContent )
			.toEqual( `Choose how your ${ TestContentTypeName } archive should look in search engines.` );

		// There is a toggle for showing the search results:
		const ToggleLabelSpan = screen.getByText( `Show the archive for ${ TestContentTypeName } in search results` );
		expect( ToggleLabelSpan.nextSibling.textContent ).toBe(
			`Be aware that disabling this toggle has serious consequences: ${ TestContentTypeName } ` +
			"will not be indexed by search engines and will be excluded from XML sitemaps.",
		);
		const SwitchElement = screen.getByLabelText( ToggleLabelSpan.parentElement.textContent );
		expect( SwitchElement.getAttribute( "role" ) ).toBe( "switch" );
		expect( SwitchElement.parentElement.nextSibling.tagName ).toBe( "HR" );

		// Expect there to be an empty social image for archives
		expect( document.getElementById( "archive-social-image-no-image-svg" ) ).toBeInTheDocument();

		// There is an additional settings section and breadcrumbs input.
		expect( screen.getByLabelText( "Breadcrumbs Title" ).value ).toBe( "" );

		// Other sections have already been tested by counting in the single content type settings test.
	} );
} );

describe( "A content types page with all options set to true and data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "renders the correct data in the fields", () => {
		const TestContentTypeName = "Locations";
		// Start and navigate to the Single only test content type. This also expands the navgroup.
		startTheApp( testConfig, TestContentTypeName, "Content types" );

		const expectedData = testConfig.data.contentTypes.locations;

		const ToggleLabelSpan = screen.getByText( `Show ${ TestContentTypeName } in search results` );
		const SwitchElement = screen.getByLabelText( ToggleLabelSpan.parentElement.textContent );

		expect( SwitchElement.getAttribute( "aria-checked" ) ).toEqual( "true" );
		within( screen.getAllByLabelText( "SEO title" )[ 0 ] ).getByText( expectedData.templates.seo.single.title );
		within( screen.getAllByLabelText( "Meta description" )[ 0 ] ).getByText( expectedData.templates.seo.single.description );
		within( screen.getAllByLabelText( "SEO title" )[ 1 ] ).getByText( expectedData.templates.seo.archive.title );
		within( screen.getAllByLabelText( "Meta description" )[ 1 ] ).getByText( expectedData.templates.seo.archive.description );

		const singleSchema = screen.getByText( "For Locations we automatically output ", { exact: false } );
		expect( singleSchema.textContent ).toBe(
			"For Locations we automatically output ItemPage Schema. Learn more about our Schema output for content types.",
		);
		const singleSchemaLink = within( singleSchema ).getByText( "Learn more about our Schema output for content types." );
		expect( singleSchemaLink ).toHaveAttribute( "href", expectedData.contentTypeSchemaInfoLink );

		const archiveSchema = screen.getByText( "For Locations archive we automatically output ", { exact: false } );
		expect( archiveSchema.textContent ).toBe(
			"For Locations archive we automatically output CollectionPage Schema. Learn more about our Schema output for content types.",
		);
		const archiveSchemaLink = within( archiveSchema ).getByText( "Learn more about our Schema output for content types." );
		expect( archiveSchemaLink ).toHaveAttribute( "href", expectedData.contentTypeSchemaInfoLink );

		expect( screen.getByLabelText( "Breadcrumbs Title" ).value ).toEqual( expectedData.breadcrumbsTitle );
	} );
} );
/* eslint-enable max-statements */
