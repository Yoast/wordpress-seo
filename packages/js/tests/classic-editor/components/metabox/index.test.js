import Metabox  from "../../../../src/classic-editor/components/metabox";
import { shallow } from "enzyme";
import { useSelect } from "@wordpress/data";

jest.mock( "@wordpress/data" );
jest.mock( "@yoast/seo-integration" );
jest.mock( "../../../../src/containers/SchemaTab", () => jest.fn() );
jest.mock( "../../../../src/containers/SEMrushRelatedKeyphrases", () => jest.fn() );
jest.mock( "../../../../src/containers/Warning", () => jest.fn() );
jest.mock( "../../../../src/containers/AdvancedSettings", () => jest.fn() );
jest.mock( "../../../../src/containers/SEMrushRelatedKeyphrasesModal", () => jest.fn() );
jest.mock( "../../../../src/components/contentAnalysis/KeywordInput", () => jest.fn() );
jest.mock( "../../../../src/classic-editor/hooks/use-marker", () => ( {
	useMarker: jest.fn(),
	useMarkerStatus: jest.fn(),
} ) );

describe( "The Metabox component", () => {
	it( "renders a portal for the social forms and previews", () => {
		const preferences = {
			isCornerstoneActive: false,
			displayAdvancedTab: true,
			displaySchemaSettings: false,
			shouldUpsell: true,
			isWordFormRecognitionActive: false,
		};

		window.wpseoAdminL10n = {
			"shortlinks.focus_keyword_info": "https://yoa.st/focus-keyword-info",
			"shortlinks.cornerstone_content_info": "https://yoa.st/cornerstone_content_info",
		};

		window.wpseoScriptData = {
			metabox: {
				isPremium: "0",
			},
		};

		const select = jest.fn();
		select.mockReturnValue( {
			getPreferences: jest.fn( () => preferences ),
			selectIsSeoAnalysisActive: jest.fn( () => true ),
			selectIsReadabilityAnalysisActive: jest.fn( () => true ),
		} );

		useSelect.mockImplementation( func => func( select ) );

		const metabox = shallow( <Metabox /> );

		expect( metabox.find( "SocialMetadata" ) ).toBeDefined();
		expect( metabox.find( "Portal" ) ).toBeDefined();
		expect( metabox.find( "Portal" ).props().target ).toEqual( "wpseo-section-social" );
	} );
} );
