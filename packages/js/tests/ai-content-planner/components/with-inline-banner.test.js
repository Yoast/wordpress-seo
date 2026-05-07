import { render } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { withInlineBanner } from "../../../src/ai-content-planner/components/with-inline-banner";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( "@wordpress/compose", () => ( {
	createHigherOrderComponent: ( fn ) => fn,
} ) );

jest.mock( "../../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: ( { onDismiss, onDismissPermanently, onClick, isPremium } ) => (
		<div data-testid="inline-banner" data-is-premium={ isPremium }>
			<button data-testid="dismiss-btn" onClick={ onDismiss } />
			<button data-testid="dismiss-permanently-btn" onClick={ onDismissPermanently } />
			<button data-testid="click-btn" onClick={ onClick } />
		</div>
	),
} ) );

const mockFetchContentSuggestions = jest.fn();
jest.mock( "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions", () => ( {
	useFetchContentSuggestions: () => mockFetchContentSuggestions,
} ) );

jest.mock( "../../../src/ai-content-planner/constants", () => ( {
	CONTENT_PLANNER_STORE: "yoast-seo/content-planner",
	FEATURE_MODAL_STATUS: { consent: "consent" },
} ) );

jest.mock( "../../../src/ai-generator/constants", () => ( {
	STORE_NAME_AI: "yoast-seo/ai-generator",
	STORE_NAME_EDITOR: "yoast-seo/editor",
} ) );

const MockBlockListBlock = ( props ) => <div data-testid="block-list-block" { ...props } />;

const mockSetFeatureModalStatus = jest.fn();
const mockSetBannerDismissed = jest.fn();
const mockSetBannerRendered = jest.fn();
const mockDismissBannerPermanently = jest.fn();

const setupMocks = ( overrides = {} ) => {
	const defaults = {
		isFirstBlock: true,
		isNewPost: true,
		isBannerDismissed: false,
		isBannerPermanentlyDismissed: false,
		isBannerRendered: false,
		bannerPermanentDismissalEndpoint: "/wp-json/yoast/v1/ai_content_planner/banner_permanent_dismissal",
		hasConsent: false,
		isPremium: false,
		minPostsMet: true,
		learnMoreLink: "https://yoa.st/content-planner-learn-more",
	};
	const values = { ...defaults, ...overrides };

	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "core/block-editor" ) {
			return { getBlockOrder: () => values.isFirstBlock ? [ "client-1" ] : [ "other" ] };
		}
		if ( storeName === "core/editor" ) {
			return { isEditedPostNew: () => values.isNewPost };
		}
		if ( storeName === "yoast-seo/content-planner" ) {
			return {
				selectIsBannerDismissed: () => values.isBannerDismissed,
				selectIsBannerRendered: () => values.isBannerRendered,
				selectIsBannerPermanentlyDismissed: () => values.isBannerPermanentlyDismissed,
				selectBannerPermanentDismissalEndpoint: () => values.bannerPermanentDismissalEndpoint,
				selectIsMinPostsMet: () => values.minPostsMet,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return { getIsPremium: () => values.isPremium, selectLink: () => values.learnMoreLink };
		}
		if ( storeName === "yoast-seo/ai-generator" ) {
			return { selectHasAiGeneratorConsent: () => values.hasConsent };
		}
		return {};
	} ) );

	useDispatch.mockReturnValue( {
		setFeatureModalStatus: mockSetFeatureModalStatus,
		setBannerDismissed: mockSetBannerDismissed,
		setBannerRendered: mockSetBannerRendered,
		dismissBannerPermanently: mockDismissBannerPermanently,
	} );
};

// withInlineBanner is already unwrapped by our createHigherOrderComponent mock, so it's (BlockListBlock) => Component
const WithInlineBanner = withInlineBanner( MockBlockListBlock );

describe( "withInlineBanner", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	test( "renders the banner when conditions are met on a new post", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when it is dismissed", () => {
		setupMocks( { isBannerDismissed: true } );
		const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when it is permanently dismissed", () => {
		setupMocks( { isBannerPermanentlyDismissed: true } );
		const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when not the first block", () => {
		setupMocks( { isFirstBlock: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when minPostsMet is false", () => {
		setupMocks( { minPostsMet: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "renders the banner on an existing post when isBannerRendered is true", () => {
		setupMocks( { isNewPost: false, isBannerRendered: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner on an existing post when isBannerRendered is false", () => {
		setupMocks( { isNewPost: false, isBannerRendered: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "calls setBannerDismissed when dismiss button is clicked", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "dismiss-btn" ).click();
		expect( mockSetBannerDismissed ).toHaveBeenCalledTimes( 1 );
	} );

	test( "calls dismissBannerPermanently with the endpoint when the permanently-dismiss button is clicked", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "dismiss-permanently-btn" ).click();
		expect( mockDismissBannerPermanently ).toHaveBeenCalledWith( "/wp-json/yoast/v1/ai_content_planner/banner_permanent_dismissal" );
	} );

	test( "calls fetchContentSuggestions when click button is clicked and has consent", () => {
		setupMocks( { hasConsent: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "click-btn" ).click();
		expect( mockFetchContentSuggestions ).toHaveBeenCalledTimes( 1 );
	} );

	test( "opens consent modal when click button is clicked without consent", () => {
		setupMocks( { hasConsent: false } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "click-btn" ).click();
		expect( mockSetFeatureModalStatus ).toHaveBeenCalledWith( "consent" );
	} );

	test( "calls setBannerRendered when banner is shown for the first time", () => {
		setupMocks( { isBannerRendered: false } );
		render( <WithInlineBanner clientId="client-1" /> );

		expect( mockSetBannerRendered ).toHaveBeenCalledTimes( 1 );
	} );

	test( "does not call setBannerRendered when banner was already rendered", () => {
		setupMocks( { isBannerRendered: true } );
		render( <WithInlineBanner clientId="client-1" /> );

		expect( mockSetBannerRendered ).not.toHaveBeenCalled();
	} );

	test( "always renders the BlockListBlock", () => {
		setupMocks( { isBannerDismissed: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "wraps the banner in a div with the wp-block class so it inherits Gutenberg's per-block content-width rule", () => {
		// Regression guard: without this class, themes that constrain block width via the `.wp-block` selector
		// (rather than via direct children of `.is-layout-constrained`) render the banner full-canvas-width instead of matching adjacent blocks.
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		const wrapper = getByTestId( "inline-banner" ).parentElement;
		expect( wrapper ).toHaveClass( "wp-block" );
	} );
} );

