import { ImageAltTextPlaceholder } from "../../src/bulk-editor/components/image-alt-text-placeholder";
import { render, screen } from "../test-utils";

describe( "ImageAltTextPlaceholder", () => {
	it( "renders the placeholder message", () => {
		render( <ImageAltTextPlaceholder /> );

		expect( screen.getByText( "Content to be added in a follow-up PR." ) ).toBeInTheDocument();
	} );
} );
