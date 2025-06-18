import { fireEvent, render } from "../../test-utils";
import { UpsellModalContent } from "../../../src/ai-generator/components/upsell-modal-content";
import { useSelect, useDispatch } from "@wordpress/data";
import { expect } from "@jest/globals";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn(),
		useSelect: jest.fn(),
		combineReducers: jest.fn(),
		registerStore: jest.fn(),
	};
} );

describe( "UpsellModalContent", () => {
	let activateFreeSparksMock;
	let setWistiaEmbedPermissionMock;
	const onActivateFreeSparksMock = jest.fn();
	beforeEach( () => {
		activateFreeSparksMock = jest.fn();
		setWistiaEmbedPermissionMock = jest.fn();

		useDispatch.mockImplementation( storeName => {
			if ( storeName === "yoast-seo/editor" ) {
				return { setWistiaEmbedPermission: setWistiaEmbedPermissionMock };
			}
			if ( storeName === "yoast-seo/ai-generator" ) {
				return { activateFreeSparks: activateFreeSparksMock };
			}
			return {};
		} );
	} );

	it( "renders the component correctly for default props", () => {
		useSelect.mockImplementation( selectFn => {
			// Simulate the select function for both stores
			return selectFn( storeName => {
				if ( storeName === "yoast-seo/editor" ) {
					return {
						selectLink: url => url,
						selectImageLink: () => "image.png",
						selectWistiaEmbedPermissionValue: () => true,
						selectWistiaEmbedPermissionStatus: () => "granted",
						getIsWooCommerceActive: () => false,
						getIsProduct: () => false,
						getIsPremium: () => false,
						getIsWooSeoActive: () => false,
						getIsProductEntity: () => false,
					};
				}
				if ( storeName === "yoast-seo/ai-generator" ) {
					return {
						isUsageCountLimitReached: () => false,
						selectFreeSparksActiveEndpoint: () => "/free-sparks-endpoint",
					};
				}
				return {};
			} );
		} );
		const { getByText } = render( <UpsellModalContent onActivateFreeSparks={ onActivateFreeSparksMock } /> );
		expect( getByText( "Let AI do some of the thinking for you and help you save time. Get high-quality suggestions for titles and meta descriptions to make your content rank high and look good on social media." ) ).toBeInTheDocument();
		expect( getByText( "Yoast SEO Premium" ) ).toBeInTheDocument();
		expect( getByText( "Unlock with Yoast SEO Premium" ) ).toBeInTheDocument();
		expect( getByText( "Use AI to generate your titles & descriptions!" ) ).toBeInTheDocument();
		expect( getByText( "Learn more" ) ).toBeInTheDocument();
		expect( getByText( "Try for free" ) ).toBeInTheDocument();
	} );

	it( "should call startFreeSparks when the 'Try for free' button is clicked", () => {
		useSelect.mockImplementation( selectFn => {
			// Simulate the select function for both stores
			return selectFn( storeName => {
				if ( storeName === "yoast-seo/editor" ) {
					return {
						selectLink: url => url,
						selectImageLink: () => "image.png",
						selectWistiaEmbedPermissionValue: () => true,
						selectWistiaEmbedPermissionStatus: () => "granted",
						getIsWooCommerceActive: () => false,
						getIsProduct: () => false,
						getIsPremium: () => false,
						getIsWooSeoActive: () => false,
						getIsProductEntity: () => false,
					};
				}
				if ( storeName === "yoast-seo/ai-generator" ) {
					return {
						isUsageCountLimitReached: () => false,
						selectFreeSparksActiveEndpoint: () => "/free-sparks-endpoint",
					};
				}
				return {};
			} );
		} );
		const { getByText } = render( <UpsellModalContent onActivateFreeSparks={ onActivateFreeSparksMock } /> );
		const tryButton = getByText( "Try for free" );
		fireEvent.click( tryButton );
		expect( onActivateFreeSparksMock ).toHaveBeenCalled();
		expect( activateFreeSparksMock ).toHaveBeenCalledWith( { endpoint: "/free-sparks-endpoint" } );
	} );

	it( "should show the alert when isUsageCountLimitReached is true and the 'try for free' button is not rendered", () => {
		useSelect.mockImplementationOnce( selectFn => {
			return selectFn( storeName => {
				if ( storeName === "yoast-seo/editor" ) {
					return {
						selectLink: url => url,
						selectImageLink: () => "image.png",
						selectWistiaEmbedPermissionValue: () => true,
						selectWistiaEmbedPermissionStatus: () => "granted",
						getIsWooCommerceActive: () => false,
						getIsProduct: () => false,
					};
				}
				if ( storeName === "yoast-seo/ai-generator" ) {
					return {
						isUsageCountLimitReached: () => true,
						selectFreeSparksActiveEndpoint: () => "/free-sparks-endpoint",
					};
				}
				return {};
			} );
		} );
		const { getByText, queryByText } = render( <UpsellModalContent onActivateFreeSparks={ onActivateFreeSparksMock } /> );
		expect( getByText( "Oh no! Its seems like you're out of free Sparks. Keep the momentum going, unlock unlimited sparks with Yoast SEO Premium!" ) ).toBeInTheDocument();
		expect( queryByText( "Try for free" ) ).not.toBeInTheDocument();
	} );
} );
