import { shallow } from "enzyme";
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

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "",
				isLoggedIn: true,
			};

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate( "click" );

			expect( props.onOpenWithNoKeyphrase ).toHaveBeenCalled();
		} );
	} );

	describe( "onModalClose", () => {
		it( "successfully calls the close method", () => {
			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			component.instance().onModalClose();

			expect( props.onClose ).toHaveBeenCalled();
		} );
	} );
} );
