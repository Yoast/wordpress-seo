import { useSelect } from "@wordpress/data";
import { render, screen } from "../test-utils";
import { ImageAltTextPlaceholder } from "../../src/bulk-editor/components/image-alt-text-placeholder";

jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: () => ( {
		upsellLabel: "Unlock with Yoast WooCommerce SEO",
		upsellLink: "https://yoa.st/bulk-editor-ai-upsell-woo",
		ctbId: "5b32250e-e6f0-44ae-ad74-3cefc8e427f9",
	} ),
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

/**
 * Sets up the useSelect mock to return the given store preferences.
 *
 * @param {Object} preferences The preferences.
 *
 * @returns {void}
 */
const mockPreferences = ( preferences ) => {
	useSelect.mockImplementation( ( selector ) => selector( () => ( {
		selectPreference: ( key, defaultValue ) => ( key in preferences ? preferences[ key ] : defaultValue ),
		selectLink: ( link ) => link,
	} ) ) );
};

const UPSELL_HEADING = "From flagged to fixed: image alt text across your whole catalog";

describe( "ImageAltTextPlaceholder", () => {
	it( "shows the Yoast WooCommerce SEO upsell when the add-on is not active", () => {
		mockPreferences( { isWooSeoActive: false } );

		render( <ImageAltTextPlaceholder /> );

		expect( screen.getByRole( "heading", { name: UPSELL_HEADING } ) ).toBeInTheDocument();
	} );

	it( "shows the upsell when the preference is missing", () => {
		mockPreferences( {} );

		render( <ImageAltTextPlaceholder /> );

		expect( screen.getByRole( "heading", { name: UPSELL_HEADING } ) ).toBeInTheDocument();
	} );

	it( "stays empty when the add-on is active but did not fill the slot", () => {
		mockPreferences( { isWooSeoActive: true } );

		const { container } = render( <ImageAltTextPlaceholder /> );

		expect( screen.queryByRole( "heading", { name: UPSELL_HEADING } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "link" ) ).not.toBeInTheDocument();
		expect( container.firstChild ).toBeEmptyDOMElement();
	} );
} );
