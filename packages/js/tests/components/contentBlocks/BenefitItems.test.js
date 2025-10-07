import { render, screen } from "@testing-library/react";
import { BenefitItems } from "../../../src/components/contentBlocks/BenefitItems";
import { PREMIUM_CONTENT_BLOCKS } from "../../../src/components/contentBlocks/ContentBlocks";

describe( "BenefitItems", () => {
	it( "renders a list of benefits", () => {
		render( <BenefitItems id="test" /> );
		expect( screen.getByRole( "list" ) ).toBeInTheDocument();
		expect( screen.getAllByRole( "listitem" ) ).toHaveLength( PREMIUM_CONTENT_BLOCKS.length );
	} );

	it( "renders each benefit with correct title", () => {
		render( <BenefitItems id="test" /> );
		PREMIUM_CONTENT_BLOCKS.forEach( ( benefit ) => {
			expect( screen.getByText( benefit.title ) ).toBeInTheDocument();
		} );
	} );
} );
