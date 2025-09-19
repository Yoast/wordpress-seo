import { render, screen } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { ContentBlock } from "../../../src/components/contentBlocks/ContentBlock";

// Mock dependencies
jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

jest.mock( "@yoast/ui-library", () => ( {
	Badge: ( { children, className, size, variant } ) => (
		<div data-testid="badge" className={ className } data-size={ size } data-variant={ variant }>
			{ children }
		</div>
	),
	useSvgAria: jest.fn( () => ( { "aria-hidden": true } ) ),
} ) );

jest.mock( "@yoast/components", () => ( {
	SvgIcon: ( { icon, size } ) => (
		<div data-testid="svg-icon" data-icon={ icon } data-size={ size } />
	),
} ) );

jest.mock( "../../../src/components/contentBlocks/AddBlockButton", () => ( {
	AddBlockButton: ( { showUpsellBadge, blockName } ) => (
		<button
			data-testid="add-block-button"
			data-show-upsell={ showUpsellBadge }
			data-block-name={ blockName }
		>
			Add Block
		</button>
	),
} ) );

jest.mock( "@heroicons/react/solid", () => ( {
	LockClosedIcon: ( props ) => (
		<div data-testid="lock-icon" { ...props } />
	),
} ) );

jest.mock( "@heroicons/react/outline", () => ( {
	CheckIcon: ( props ) => (
		<div data-testid="check-icon" { ...props } />
	),
} ) );

describe( "ContentBlock", () => {
	const defaultProps = {
		blockTitle: "Test Block",
		blockName: "test/block",
		isPremiumBlock: false,
		hasNewBadgeLabel: false,
		renderNewBadgeLabel: jest.fn( () => <span data-testid="new-badge">New</span> ),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( "Basic rendering", () => {
		it( "renders block title and icon", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } /> );

			expect( screen.getByText( "Test Block" ) ).toBeInTheDocument();
			expect( screen.getByTestId( "svg-icon" ) ).toHaveAttribute( "data-icon", "circle" );
			expect( screen.getByTestId( "svg-icon" ) ).toHaveAttribute( "data-size", "4px" );
		} );

		it( "renders horizontal rule", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			const { container } = render( <ContentBlock { ...defaultProps } /> );
			const hr = container.querySelector( "hr" );

			expect( hr ).toBeInTheDocument();
			expect( hr ).toHaveClass( "yst-border-t-slate-200", "yst-mx-0", "yst-w-auto", "yst-my-4" );
		} );
	} );

	describe( "New badge rendering", () => {
		it( "renders new badge when hasNewBadgeLabel is true", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } hasNewBadgeLabel={ true } /> );

			expect( screen.getByTestId( "new-badge" ) ).toBeInTheDocument();
			expect( defaultProps.renderNewBadgeLabel ).toHaveBeenCalled();
		} );

		it( "does not render new badge when hasNewBadgeLabel is false", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } hasNewBadgeLabel={ false } /> );

			expect( screen.queryByTestId( "new-badge" ) ).not.toBeInTheDocument();
			expect( defaultProps.renderNewBadgeLabel ).not.toHaveBeenCalled();
		} );
	} );

	describe( "Block not present scenarios", () => {
		it( "shows add button when block is not present", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } /> );

			expect( screen.getByTestId( "add-block-button" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "check-icon" ) ).not.toBeInTheDocument();
		} );

		it( "shows upsell badge for premium block when user is not premium", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } isPremiumBlock={ true } /> );

			const addButton = screen.getByTestId( "add-block-button" );
			expect( addButton ).toHaveAttribute( "data-show-upsell", "true" );

			expect( screen.getByTestId( "badge" ) ).toBeInTheDocument();
			expect( screen.getByTestId( "lock-icon" ) ).toBeInTheDocument();
		} );

		it( "does not show upsell badge for premium block when user is premium", () => {
			useSelect.mockReturnValue( {
				isPremium: true,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } isPremiumBlock={ true } /> );

			const addButton = screen.getByTestId( "add-block-button" );
			expect( addButton ).toHaveAttribute( "data-show-upsell", "false" );

			expect( screen.queryByTestId( "badge" ) ).not.toBeInTheDocument();
			expect( screen.queryByTestId( "lock-icon" ) ).not.toBeInTheDocument();
		} );

		it( "does not show upsell badge for non-premium block", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } isPremiumBlock={ false } /> );

			const addButton = screen.getByTestId( "add-block-button" );
			expect( addButton ).toHaveAttribute( "data-show-upsell", "false" );

			expect( screen.queryByTestId( "badge" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "Block present scenarios", () => {
		it( "shows check icon when block is present", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [ { name: "test/block" } ],
			} );

			render( <ContentBlock { ...defaultProps } /> );

			expect( screen.getByTestId( "check-icon" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "add-block-button" ) ).not.toBeInTheDocument();
		} );

		it( "applies correct classes to check icon", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [ { name: "test/block" } ],
			} );

			render( <ContentBlock { ...defaultProps } /> );

			const checkIcon = screen.getByTestId( "check-icon" );
			expect( checkIcon ).toHaveClass( "yst-h-4", "yst-w-4", "yst-stroke-green-700" );
		} );
	} );

	describe( "Block state changes", () => {
		it( "updates state when addedBlock changes from empty to present", () => {
			const { rerender } = render( <ContentBlock { ...defaultProps } /> );

			// Initially no block
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );
			rerender( <ContentBlock { ...defaultProps } /> );
			expect( screen.getByTestId( "add-block-button" ) ).toBeInTheDocument();

			// Block gets added
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [ { name: "test/block" } ],
			} );
			rerender( <ContentBlock { ...defaultProps } /> );
			expect( screen.getByTestId( "check-icon" ) ).toBeInTheDocument();
		} );

		it( "updates state when addedBlock changes from present to empty", () => {
			// Initially block present
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [ { name: "test/block" } ],
			} );

			const { rerender } = render( <ContentBlock { ...defaultProps } /> );
			expect( screen.getByTestId( "check-icon" ) ).toBeInTheDocument();

			// Block gets removed
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );
			rerender( <ContentBlock { ...defaultProps } /> );
			expect( screen.getByTestId( "add-block-button" ) ).toBeInTheDocument();
		} );
	} );

	describe( "Badge styling and positioning", () => {
		it( "applies correct classes to upsell badge", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } isPremiumBlock={ true } /> );

			const badge = screen.getByTestId( "badge" );
			expect( badge ).toHaveClass( "yst-absolute", "yst-p-0.5", "yst--end-[6.5px]", "yst--top-[6.5px]" );
			expect( badge ).toHaveAttribute( "data-size", "small" );
			expect( badge ).toHaveAttribute( "data-variant", "upsell" );
		} );

		it( "applies correct classes to lock icon", () => {
			useSelect.mockReturnValue( {
				isPremium: false,
				addedBlock: [],
			} );

			render( <ContentBlock { ...defaultProps } isPremiumBlock={ true } /> );

			const lockIcon = screen.getByTestId( "lock-icon" );
			expect( lockIcon ).toHaveClass( "yst-w-2.5", "yst-h-2.5", "yst-shrink-0" );
		} );
	} );
} );
