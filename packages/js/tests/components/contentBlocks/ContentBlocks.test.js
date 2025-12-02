/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import { useContext } from "@wordpress/element";
import { ContentBlocks } from "../../../src/components/contentBlocks/ContentBlocks";

// Mock LocationContext
jest.mock( "@yoast/externals/contexts", () => ( {
	LocationContext: {
		Consumer: ( { children } ) => children( "sidebar" ),
		Provider: ( { children } ) => children,
	},
} ) );

// Mock dependencies
jest.mock( "@wordpress/element", () => ( {
	useCallback: jest.fn( ( fn ) => fn ),
	useContext: jest.fn(),
} ) );

jest.mock( "@yoast/ui-library", () => ( {
	Badge: ( { children, variant, size } ) => (
		<span data-testid="badge" data-variant={ variant } data-size={ size }>
			{ children }
		</span>
	),
} ) );

jest.mock( "../../../src/components/contentBlocks/ContentBlock", () => ( {
	ContentBlock: ( { blockTitle, blockName, isPremiumBlock, hasNewBadgeLabel, renderNewBadgeLabel } ) => (
		<div data-testid="content-block">
			<span data-testid="block-title">{ blockTitle }</span>
			<span data-testid="block-name">{ blockName }</span>
			<span data-testid="is-premium">{ isPremiumBlock.toString() }</span>
			<span data-testid="has-new-badge">{ hasNewBadgeLabel.toString() }</span>
			{ hasNewBadgeLabel && renderNewBadgeLabel && (
				<div data-testid="new-badge-rendered">{ renderNewBadgeLabel() }</div>
			) }
		</div>
	),
} ) );

jest.mock( "../../../src/components/MetaboxCollapsible", () =>
	( { id, title, hasNewBadgeLabel, renderNewBadgeLabel, className, children } ) => (
		<div data-testid="metabox-collapsible" data-id={ id } data-class={ className }>
			<h2 data-testid="collapsible-title">{ title }</h2>
			<span data-testid="has-new-badge-label">{ hasNewBadgeLabel.toString() }</span>
			{ renderNewBadgeLabel && (
				<div data-testid="collapsible-badge">{ renderNewBadgeLabel() }</div>
			) }
			{ children }
		</div>
	)
);

jest.mock( "../../../src/components/SidebarCollapsible", () =>
	( { id, title, hasNewBadgeLabel, renderNewBadgeLabel, className, children } ) => (
		<div data-testid="sidebar-collapsible" data-id={ id } data-class={ className }>
			<h2 data-testid="collapsible-title">{ title }</h2>
			<span data-testid="has-new-badge-label">{ hasNewBadgeLabel.toString() }</span>
			{ renderNewBadgeLabel && (
				<div data-testid="collapsible-badge">{ renderNewBadgeLabel() }</div>
			) }
			{ children }
		</div>
	)
);

describe( "ContentBlocks", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( "Location context handling", () => {
		it( "renders MetaboxCollapsible when location is metabox", () => {
			useContext.mockReturnValue( "metabox" );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "metabox-collapsible" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "sidebar-collapsible" ) ).not.toBeInTheDocument();
		} );

		it( "renders SidebarCollapsible when location is not metabox", () => {
			useContext.mockReturnValue( "sidebar" );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "sidebar-collapsible" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "metabox-collapsible" ) ).not.toBeInTheDocument();
		} );

		it( "renders SidebarCollapsible when location is undefined", () => {
			useContext.mockReturnValue( undefined );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "sidebar-collapsible" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "metabox-collapsible" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "Component properties", () => {
		it( "sets correct id for metabox location", () => {
			useContext.mockReturnValue( "metabox" );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "metabox-collapsible" ) ).toHaveAttribute(
				"data-id",
				"yoast-content-blocks-collapsible-metabox"
			);
		} );

		it( "sets correct id for sidebar location", () => {
			useContext.mockReturnValue( "sidebar" );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "sidebar-collapsible" ) ).toHaveAttribute(
				"data-id",
				"yoast-content-blocks-collapsible-sidebar"
			);
		} );

		it( "sets hasNewBadgeLabel to true", () => {
			useContext.mockReturnValue( "sidebar" );

			render( <ContentBlocks /> );

			expect( screen.getByTestId( "has-new-badge-label" ) ).toHaveTextContent( "true" );
		} );
	} );

	describe( "Content blocks rendering", () => {
		beforeEach( () => {
			useContext.mockReturnValue( "sidebar" );
		} );
		afterEach( () => {
			// Clean up the mock
			delete window.wpseoAiGenerator;
			jest.clearAllMocks();
		} );

		it( "renders all content blocks in correct order (premium first) and the AI feature is enabled", () => {
			// Mock window.wpseoAiGenerator
			window.wpseoAiGenerator = { hasConsent: "1" };
			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );
			const blockTitles = blocks.map( block =>
				block.querySelector( '[data-testid="block-title"]' ).textContent
			);

			expect( blockTitles ).toEqual( [
				"AI Summarize",
				"Estimated reading time",
				"Related links",
				"Table of contents",
				"Breadcrumbs",
				"FAQ",
				"How-to",
			] );
		} );

		it( "renders all content blocks in correct order (premium first) and the AI feature is disabled", () => {
			// Mock window.wpseoAiGenerator as undefined
			window.wpseoAiGenerator = undefined;
			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );
			const blockTitles = blocks.map( block =>
				block.querySelector( '[data-testid="block-title"]' ).textContent
			);

			expect( blockTitles ).toEqual( [
				"Estimated reading time",
				"Related links",
				"Table of contents",
				"Breadcrumbs",
				"FAQ",
				"How-to",
			] );
			expect( blockTitles ).not.toContain( "AI Summarize" );
		} );

		it( "renders premium blocks with correct properties", () => {
			// Mock window.wpseoAiGenerator
			window.wpseoAiGenerator = { hasConsent: "1" };
			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );

			// Check AI Summarize block (first premium block)
			const aiSummarizeBlock = blocks[ 0 ];
			expect( aiSummarizeBlock.querySelector( '[data-testid="block-name"]' ) ).toHaveTextContent( "yoast-seo/ai-summarize" );
			expect( aiSummarizeBlock.querySelector( '[data-testid="is-premium"]' ) ).toHaveTextContent( "true" );
			expect( aiSummarizeBlock.querySelector( '[data-testid="has-new-badge"]' ) ).toHaveTextContent( "true" );
		} );

		it( "renders non-premium blocks with correct properties", () => {
			// Mock window.wpseoAiGenerator
			window.wpseoAiGenerator = { hasConsent: "1" };
			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );

			// Check Breadcrumbs block (first non-premium block)
			const breadcrumbsBlock = blocks[ 4 ];
			expect( breadcrumbsBlock.querySelector( '[data-testid="block-name"]' ) ).toHaveTextContent( "yoast-seo/breadcrumbs" );
			expect( breadcrumbsBlock.querySelector( '[data-testid="is-premium"]' ) ).toHaveTextContent( "false" );
			expect( breadcrumbsBlock.querySelector( '[data-testid="has-new-badge"]' ) ).toHaveTextContent( "false" );
		} );

		it( "only shows new badge for AI Summarize block", () => {
			// Mock window.wpseoAiGenerator
			window.wpseoAiGenerator = { hasConsent: "1" };
			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );

			blocks.forEach( block => {
				const hasNewBadge = block.querySelector( '[data-testid="has-new-badge"]' ).textContent === "true";
				const blockTitle = block.querySelector( '[data-testid="block-title"]' ).textContent;

				if ( blockTitle === "AI Summarize" ) {
					expect( hasNewBadge ).toBe( true );
				} else {
					expect( hasNewBadge ).toBe( false );
				}
			} );
		} );

		it( "includes Siblings and Subpages blocks only for pages", () => {
			// Mock window.wpseoScriptData to indicate it's a page
			window.wpseoScriptData = { isPage: true };
			window.wpseoAiGenerator = { hasConsent: "1" };

			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );
			const blockTitles = blocks.map( block =>
				block.querySelector( '[data-testid="block-title"]' ).textContent
			);

			// Siblings and Subpages should be included for pages
			expect( blockTitles ).toContain( "Siblings" );
			expect( blockTitles ).toContain( "Subpages" );

			// Clean up
			delete window.wpseoScriptData;
		} );

		it( "excludes Siblings and Subpages blocks for non-page post types", () => {
			// Mock window.wpseoScriptData to indicate it's not a page
			window.wpseoScriptData = { isPage: false };
			window.wpseoAiGenerator = { hasConsent: "1" };

			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );
			const blockTitles = blocks.map( block =>
				block.querySelector( '[data-testid="block-title"]' ).textContent
			);

			// Siblings and Subpages should NOT be included for non-pages
			expect( blockTitles ).not.toContain( "Siblings" );
			expect( blockTitles ).not.toContain( "Subpages" );

			// Clean up
			delete window.wpseoScriptData;
		} );

		it( "places Siblings and Subpages blocks in correct order for pages", () => {
			// Mock window.wpseoScriptData to indicate it's a page
			window.wpseoScriptData = { isPage: true };
			window.wpseoAiGenerator = { hasConsent: "1" };

			render( <ContentBlocks /> );

			const blocks = screen.getAllByTestId( "content-block" );
			const blockTitles = blocks.map( block =>
				block.querySelector( '[data-testid="block-title"]' ).textContent
			);

			// Verify the correct order: premium blocks, then Siblings, Subpages, Table of contents, then free blocks
			expect( blockTitles ).toEqual( [
				"AI Summarize",
				"Estimated reading time",
				"Related links",
				"Siblings",
				"Subpages",
				"Table of contents",
				"Breadcrumbs",
				"FAQ",
				"How-to",
			] );

			// Clean up
			delete window.wpseoScriptData;
		} );
	} );

	describe( "Badge rendering", () => {
		beforeEach( () => {
			useContext.mockReturnValue( "sidebar" );
			// Mock window.wpseoAiGenerator
			window.wpseoAiGenerator = { hasConsent: "1" };
		} );
		afterEach( () => {
			// Clean up the mock
			delete window.wpseoAiGenerator;
			jest.clearAllMocks();
		} );

		it( "renders new badge label correctly", () => {
			render( <ContentBlocks /> );

			const collapsibleBadge = screen.getByTestId( "collapsible-badge" );
			const badge = collapsibleBadge.querySelector( '[data-testid="badge"]' );

			expect( badge ).toHaveAttribute( "data-variant", "info" );
			expect( badge ).toHaveAttribute( "data-size", "small" );
			expect( badge ).toHaveTextContent( "New" );
		} );

		it( "renders new badge in content blocks when applicable", () => {
			render( <ContentBlocks /> );

			const newBadgeRendered = screen.getAllByTestId( "new-badge-rendered" );
			expect( newBadgeRendered ).toHaveLength( 1 );
		} );
	} );

	describe( "Description text", () => {
		beforeEach( () => {
			useContext.mockReturnValue( "sidebar" );
		} );
		afterEach( () => {
			// Clean up the mock
			jest.clearAllMocks();
		} );

		it( "renders description text with correct styling", () => {
			render( <ContentBlocks /> );

			const description = screen.getByText( "While writing your post, add custom Yoast blocks directly from here to enhance your content." );
			expect( description ).toBeInTheDocument();
			expect( description ).toHaveClass( "yst-font-normal", "yst-text-sm" );
		} );
	} );
} );
