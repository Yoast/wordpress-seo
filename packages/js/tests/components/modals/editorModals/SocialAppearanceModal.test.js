import { render, screen } from "../../../test-utils";
import EditorModal from "../../../../src/components/modals/editorModals/EditorModal";
import SocialAppearanceModal from "../../../../src/components/modals/editorModals/SocialAppearanceModal";
import { noop } from "lodash";

/**
 * Mocked EditorModal container.
 *
 * Renders the modal open, without the WP data store the container normally reads from.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The element.
 */
const EditorModalMock = props => (
	<EditorModal { ...props } postTypeName="post" isOpen={ true } open={ noop } close={ noop } />
);

jest.mock( "../../../../src/containers/EditorModal", () => EditorModalMock );

// The editors are Redux containers; this suite is about the modal chrome around them.
jest.mock( "../../../../src/containers/FacebookEditor", () => ( {
	__esModule: true,
	"default": () => "Facebook editor",
} ) );
jest.mock( "../../../../src/containers/TwitterEditor", () => ( {
	__esModule: true,
	"default": () => "X editor",
} ) );

describe( "SocialAppearanceModal", () => {
	beforeEach( () => {
		global.wpseoAdminL10n = {
			"shortlinks.social_previews_info": "https://example.com/social-previews",
		};
	} );

	it( "links the modal title to the social previews page when Open Graph is enabled", () => {
		render( <SocialAppearanceModal useOpenGraphData={ true } useTwitterData={ true } /> );

		const link = screen.getByRole( "link", { name: /Learn more about social previews/ } );

		expect( link ).toHaveAttribute( "href", "https://example.com/social-previews" );
	} );

	it( "still offers the help link when X appearance is disabled", () => {
		render( <SocialAppearanceModal useOpenGraphData={ true } useTwitterData={ false } /> );

		expect( screen.getByRole( "link", { name: /Learn more about social previews/ } ) ).toBeInTheDocument();
	} );

	it( "does not offer the help link when Open Graph is disabled", () => {
		// Only the X appearance editor remains, matching the metabox, which has no link in that case either.
		render( <SocialAppearanceModal useOpenGraphData={ false } useTwitterData={ true } /> );

		expect( screen.getByText( "X editor" ) ).toBeInTheDocument();
		expect( screen.queryByRole( "link", { name: /Learn more about social previews/ } ) ).toBeNull();
	} );
} );
