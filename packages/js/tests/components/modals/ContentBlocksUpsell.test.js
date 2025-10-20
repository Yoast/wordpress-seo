import { render, screen, fireEvent } from "@testing-library/react";
import { ContentBlocksUpsell } from "../../../src/components/modals/ContentBlocksUpsell";

// Mock dependencies
jest.mock( "@wordpress/element", () => ( {
	...jest.requireActual( "@wordpress/element" ),
	useCallback: ( fn ) => fn,
} ) );
jest.mock( "@wordpress/i18n", () => ( {
	__: ( str ) => str,
} ) );
jest.mock( "@wordpress/url", () => ( {
	addQueryArgs: ( url, args ) => `${url}?context=${args.context}`,
} ) );
jest.mock( "@yoast/externals/contexts", () => ( {
	useRootContext: () => ( { locationContext: "test-context" } ),
} ) );
jest.mock( "../../../src/components/modals/UpsellModal.js", () => ( {
	UpsellModal: ( props ) => (
		<div data-testid="upsell-modal">
			{ props.isOpen && <span>Modal Open</span> }
			<button onClick={ props.onClose }>Close</button>
			<span>{ props.upsellLink }</span>
			<span>{ props.modalTitle }</span>
			<span>{ props.title }</span>
			<span>{ props.description }</span>
			<span>{ props.note }</span>
			{ props.benefits() }
		</div>
	),
} ) );
jest.mock( "../../../src/components/contentBlocks/BenefitItems.js", () => ( {
	BenefitItems: ( { id } ) => <div data-testid="benefit-items">{ id }</div>,
} ) );

// Mock global
global.wpseoAdminL10n = {
	"shortlinks.upsell.sidebar.content_blocks": "https://buy-sidebar",
	"shortlinks.upsell.metabox.content_blocks": "https://buy-metabox",
};

describe( "ContentBlocksUpsell", () => {
	let mockCloseModal;
	beforeEach( () => {
		mockCloseModal = jest.fn();
	} );
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders correctly for sidebar location", () => {
		render(
			<ContentBlocksUpsell
				isOpen={ true }
				closeModal={ mockCloseModal }
				location="sidebar"
			/>
		);

		expect( screen.getByText( "Modal Open" ) ).toBeInTheDocument();
		expect( screen.getByText( "https://buy-sidebar?context=test-context" ) ).toBeInTheDocument();
		expect( screen.getByTestId( "benefit-items" ) ).toHaveTextContent( "yoast-content-blocks-upsell" );
		expect( screen.getByText( "Enhance your content" ) ).toBeInTheDocument();
		expect( screen.getByText( "Make your post more engaging at a click" ) ).toBeInTheDocument();
		expect( screen.getByText( "Add rich elements that improve readability, structure, and SEO. Easily insert smart blocks to enrich your content directly in the Block Editor. Includes:" ) ).toBeInTheDocument();
		expect( screen.getByText( "Get a tailored experience for the Block Editor" ) ).toBeInTheDocument();
	} );

	it( "renders correctly for metabox location", () => {
		render(
			<ContentBlocksUpsell
				isOpen={ true }
				closeModal={ mockCloseModal }
				location="metabox"
			/>
		);

		expect( screen.getByText( "https://buy-metabox?context=test-context" ) ).toBeInTheDocument();
	} );

	it( "calls closeModal when close button is clicked", () => {
		render(
			<ContentBlocksUpsell
				isOpen={ true }
				closeModal={ mockCloseModal }
				location="sidebar"
			/>
		);

		fireEvent.click( screen.getByText( "Close" ) );
		expect( mockCloseModal ).toHaveBeenCalled();
	} );

	it( "does not render modal when isOpen is false", () => {
		render(
			<ContentBlocksUpsell
				isOpen={ false }
				closeModal={ mockCloseModal }
				location="sidebar"
			/>
		);

		expect( screen.queryByText( "Modal Open" ) ).not.toBeInTheDocument();
	} );
} );
