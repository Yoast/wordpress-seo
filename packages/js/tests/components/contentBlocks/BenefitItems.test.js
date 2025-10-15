import { render, screen } from "@testing-library/react";
import { BenefitItems } from "../../../src/components/contentBlocks/BenefitItems";
import { PREMIUM_CONTENT_BLOCKS } from "../../../src/components/contentBlocks/ContentBlocks";

describe( "BenefitItems", () => {
	beforeEach( () => {
		// Reset window.wpseoScriptData before each test
		global.window.wpseoScriptData = {};
	} );

	it( "renders a list of benefits for non-pages", () => {
		global.window.wpseoScriptData.isPage = false;
		render( <BenefitItems id="test" /> );
		expect( screen.getByRole( "list" ) ).toBeInTheDocument();
		expect( screen.getAllByRole( "listitem" ) ).toHaveLength( PREMIUM_CONTENT_BLOCKS.length );
	} );

	it( "renders each benefit with correct title for non-pages", () => {
		global.window.wpseoScriptData.isPage = false;
		render( <BenefitItems id="test" /> );
		PREMIUM_CONTENT_BLOCKS.forEach( ( benefit ) => {
			expect( screen.getByText( benefit.title ) ).toBeInTheDocument();
		} );
	} );

	it( "renders benefits in the correct order for pages", () => {
		global.window.wpseoScriptData.isPage = true;
		render( <BenefitItems id="test" /> );

		const listItems = screen.getAllByRole( "listitem" );
		// For pages: AI Summarize, Estimated reading time, Related links, Siblings, Sub-pages, Table of contents
		expect( listItems ).toHaveLength( PREMIUM_CONTENT_BLOCKS.length + 2 );

		// Check that Siblings and Sub-pages appear before Table of contents
		expect( screen.getByText( "Siblings" ) ).toBeInTheDocument();
		expect( screen.getByText( "Sub-pages" ) ).toBeInTheDocument();
		expect( screen.getByText( "Table of contents" ) ).toBeInTheDocument();
	} );

	it( "does not render Siblings and Sub-pages for non-pages", () => {
		global.window.wpseoScriptData.isPage = false;
		render( <BenefitItems id="test" /> );

		expect( screen.queryByText( "Siblings" ) ).not.toBeInTheDocument();
		expect( screen.queryByText( "Sub-pages" ) ).not.toBeInTheDocument();
	} );
} );
