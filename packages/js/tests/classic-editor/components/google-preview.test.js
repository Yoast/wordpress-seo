import { shallow } from "enzyme";
import { useSelect } from "@wordpress/data";

import GooglePreview from "../../../src/classic-editor/components/google-preview";
import { GooglePreviewContainer } from "@yoast/seo-integration";

jest.mock( "@wordpress/data" );

describe( "The GooglePreview component", () => {
	it( "renders with the correct id suffix", () => {
		const select = jest.fn();
		select.mockReturnValue( {
			getShoppingData: jest.fn(),
			getSiteIconUrlFromSettings: jest.fn(),
			selectAnalysisType: jest.fn(),
			selectFeaturedImage: jest.fn( () => ( {
				url: "https://example.org/images/image.jpeg",
			} ) ),
			selectContent: jest.fn(),
		} );

		useSelect.mockImplementation( func => func( select ) );
		const renderedComponent = shallow( <GooglePreview /> );
		expect( renderedComponent.find( GooglePreviewContainer ).props().idSuffix ).toEqual( "metabox" );
	} );
} );
