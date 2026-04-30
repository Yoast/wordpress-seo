import { render, fireEvent } from "../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { addFilter } from "@wordpress/hooks";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( "@wordpress/hooks", () => ( {
	addFilter: jest.fn(),
} ) );

jest.mock( "@wordpress/compose", () => ( {
	createHigherOrderComponent: ( hoc ) => hoc,
} ) );

jest.mock( "../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: ( { onDismiss, onClick } ) => (
		<div data-testid="inline-banner">
			<button data-testid="banner-dismiss" onClick={ onDismiss }>dismiss</button>
			<button data-testid="banner-cta" onClick={ onClick }>cta</button>
		</div>
	),
} ) );

jest.mock( "../../src/ai-content-planner/hooks/use-fetch-content-suggestions", () => ( {
	useFetchContentSuggestions: jest.fn( () => jest.fn() ),
} ) );

const { registerBannerFilter } = require( "../../src/ai-content-planner/banner-filter" );

const InnerBlock = ( props ) => <div data-testid="inner-block" data-client={ props.clientId } />;

const getHoc = () => {
	registerBannerFilter();
	const calls = addFilter.mock.calls.filter( ( [ hookName ] ) => hookName === "editor.BlockListBlock" );
	const hoc = calls[ calls.length - 1 ][ 2 ];
	return hoc( InnerBlock );
};

const defaultStores = {
	blockOrder: [ "para-1" ],
	status: "auto-draft",
	postType: "post",
	minPostsMet: true,
	isNewPost: true,
	isBannerDismissed: false,
	isBannerRendered: false,
	isPremium: false,
	hasConsent: false,
};

const mockSelectors = ( overrides = {} ) => {
	const opts = { ...defaultStores, ...overrides };
	const stores = {
		"core/block-editor": {
			getBlockOrder: () => opts.blockOrder,
		},
		"core/editor": {
			getEditedPostAttribute: ( attr ) => ( attr === "status" ? opts.status : null ),
			getCurrentPostType: () => opts.postType,
			isEditedPostNew: () => opts.isNewPost,
		},
		"yoast-seo/content-planner": {
			selectIsMinPostsMet: () => opts.minPostsMet,
			selectIsBannerDismissed: () => opts.isBannerDismissed,
			selectIsBannerRendered: () => opts.isBannerRendered,
		},
		"yoast-seo/editor": {
			getIsPremium: () => opts.isPremium,
		},
		"yoast-seo/ai-generator": {
			selectHasAiGeneratorConsent: () => opts.hasConsent,
		},
	};
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => stores[ storeName ] ) );
};

describe( "withInlineBanner (editor.BlockListBlock filter)", () => {
	let mockSetFeatureModalStatus;
	let mockSetBannerDismissed;
	let mockSetBannerRendered;

	beforeEach( () => {
		mockSetFeatureModalStatus = jest.fn();
		mockSetBannerDismissed = jest.fn();
		mockSetBannerRendered = jest.fn();
		useDispatch.mockImplementation( ( storeName ) => {
			if ( storeName === "yoast-seo/content-planner" ) {
				return {
					setFeatureModalStatus: mockSetFeatureModalStatus,
					setBannerDismissed: mockSetBannerDismissed,
					setBannerRendered: mockSetBannerRendered,
				};
			}
			return {};
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "renders the inline banner before the first block on a new post", () => {
		mockSelectors();
		const Wrapped = getHoc();
		const { getByTestId, container } = render( <Wrapped clientId="para-1" /> );
		const banner = getByTestId( "inline-banner" );
		const block = getByTestId( "inner-block" );
		expect( banner ).toBeInTheDocument();
		expect( block ).toBeInTheDocument();
		const nodes = Array.from( container.querySelectorAll( "[data-testid]" ) );
		expect( nodes.indexOf( banner ) ).toBeLessThan( nodes.indexOf( block ) );
	} );

	test( "marks the banner as rendered the first time it shows", () => {
		mockSelectors();
		const Wrapped = getHoc();
		render( <Wrapped clientId="para-1" /> );
		expect( mockSetBannerRendered ).toHaveBeenCalled();
	} );

	test( "does not redundantly mark the banner as rendered when the store already says so", () => {
		mockSelectors( { isBannerRendered: true, isNewPost: false } );
		const Wrapped = getHoc();
		render( <Wrapped clientId="para-1" /> );
		expect( mockSetBannerRendered ).not.toHaveBeenCalled();
	} );

	test( "renders the banner when the first block is not a paragraph", () => {
		mockSelectors( { blockOrder: [ "heading-1" ] } );
		const Wrapped = getHoc();
		const { getByTestId } = render( <Wrapped clientId="heading-1" /> );
		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when the wrapped block is not the first block", () => {
		mockSelectors();
		const Wrapped = getHoc();
		const { queryByTestId } = render( <Wrapped clientId="other-block" /> );
		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when dismissed", () => {
		mockSelectors( { isBannerDismissed: true } );
		const Wrapped = getHoc();
		const { queryByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner on a saved post that has never seen it", () => {
		mockSelectors( { isNewPost: false, isBannerRendered: false } );
		const Wrapped = getHoc();
		const { queryByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "renders the banner on a saved post when it was rendered before", () => {
		mockSelectors( { isNewPost: false, isBannerRendered: true } );
		const Wrapped = getHoc();
		const { getByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when post type is not 'post'", () => {
		mockSelectors( { postType: "page" } );
		const Wrapped = getHoc();
		const { queryByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when minPostsMet is false", () => {
		mockSelectors( { minPostsMet: false } );
		const Wrapped = getHoc();
		const { queryByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "keeps rendering the banner after the post is published", () => {
		mockSelectors( { status: "publish", isNewPost: false, isBannerRendered: true } );
		const Wrapped = getHoc();
		const { getByTestId } = render( <Wrapped clientId="para-1" /> );
		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
	} );

	test( "dispatches setBannerDismissed when dismiss is clicked", () => {
		mockSelectors();
		const Wrapped = getHoc();
		const { getByTestId } = render( <Wrapped clientId="para-1" /> );
		fireEvent.click( getByTestId( "banner-dismiss" ) );
		expect( mockSetBannerDismissed ).toHaveBeenCalled();
	} );

	test( "opens the consent modal on CTA click when consent is missing", () => {
		mockSelectors( { hasConsent: false } );
		const Wrapped = getHoc();
		const { getByTestId } = render( <Wrapped clientId="para-1" /> );
		fireEvent.click( getByTestId( "banner-cta" ) );
		expect( mockSetFeatureModalStatus ).toHaveBeenCalledWith( "consent" );
	} );
} );
