import { render, screen } from "../../test-utils";
import SocialMetadata from "../../../src/components/social/SocialMetadata";

// The editors are Redux containers; this suite is about the section chrome around them.
jest.mock( "../../../src/containers/FacebookEditor", () => ( {
	__esModule: true,
	"default": () => "Facebook editor",
} ) );
jest.mock( "../../../src/containers/TwitterEditor", () => ( {
	__esModule: true,
	"default": () => "X editor",
} ) );

describe( "SocialMetadata", () => {
	beforeEach( () => {
		global.wpseoAdminL10n = {
			"shortlinks.social_previews_info": "https://example.com/social-previews",
		};
	} );

	it( "links the social media appearance header to the social previews page", () => {
		render( <SocialMetadata useOpenGraphData={ true } useTwitterData={ true } /> );

		const link = screen.getByRole( "link", { name: /Learn more about social previews/ } );

		expect( link ).toHaveAttribute( "href", "https://example.com/social-previews" );
	} );

	it( "renders the help link outside the collapsible's toggle button", () => {
		render( <SocialMetadata useOpenGraphData={ true } useTwitterData={ true } /> );

		const link = screen.getByRole( "link", { name: /Learn more about social previews/ } );

		/*
		 * A link inside the toggle button would be invalid HTML, and a click on it would open the
		 * link and collapse the section at the same time.
		 */
		expect( link.closest( "button" ) ).toBeNull();
	} );

	it( "keeps the X appearance section without a help link", () => {
		render( <SocialMetadata useOpenGraphData={ true } useTwitterData={ true } /> );

		expect( screen.getAllByRole( "link", { name: /Learn more about social previews/ } ) ).toHaveLength( 1 );
	} );

	it( "still offers the help link when X appearance is disabled", () => {
		// Without X appearance the section is not a collapsible, so the link follows the description.
		render( <SocialMetadata useOpenGraphData={ true } useTwitterData={ false } /> );

		expect( screen.getByRole( "link", { name: /Learn more about social previews/ } ) ).toBeInTheDocument();
	} );
} );
