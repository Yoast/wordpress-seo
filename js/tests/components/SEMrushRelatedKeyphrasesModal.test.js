import { mount, shallow } from "enzyme";
import SEMrushRelatedKeyphrasesModal from "../../src/components/SEMrushRelatedKeyphrasesModal";

describe( "SEMrushRelatedKeyphrasesModal", () => {
	let props = {};

	beforeEach( () => {
		props = {
			onOpen: jest.fn(),
			onOpenWithNoKeyphrase: jest.fn(),
			onClose: jest.fn(),
			location: "metabox",
		};
	} );

	describe( "onModalOpen", () => {
		it( "successfully opens the modal when the user is logged in, a keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: true,
			};

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate( "click" );

			expect( props.onOpen ).toHaveBeenCalled();
		} );

		it( "successfully opens the pop-up when the user isn't logged in the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};

			const component = mount( <SEMrushRelatedKeyphrasesModal { ...props } /> );

			jest.spyOn(component.instance(), "onLinkClick" ).mockImplementation( ( e ) => jest.fn() )
			component.instance().forceUpdate();

			console.log( component.find( "#yoast-get-related-keyphrases-metabox" ) )
			const button = component.find( "#yoast-get-related-keyphrases-metabox" ).simulate( "click" );


			expect( component.onLinkClick ).toHaveBeenCalled();
		} );
	} );
} );
