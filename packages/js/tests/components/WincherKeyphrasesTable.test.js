import { shallow } from "enzyme";

global.window.wpseoAdminGlobalL10n = [];
global.window.wpseoAdminGlobalL10n[ "links.wincher.login" ] = "test.com";

import WincherKeyphrasesTable
	from "../../../js/src/components/WincherKeyphrasesTable";
import { noop } from "lodash";
import WincherTableRow from "../../src/components/WincherTableRow";


const keyphrases = [ "yoast seo" ];

const keyphrasesData = {
	"yoast seo": {
		id: "12345",
		keyword: "yoast seo",
		// eslint-disable-next-line camelcase
		updated_at: new Date().toISOString(),
		position: {
			value: 10,
			history: [
				{
					datetime: "2021-08-02T22:00:00Z",
					value: 40,
				},
				{
					datetime: "2021-08-03T22:00:00Z",
					value: 38,
				},
			],
		},
	},
	"woocommerce seo": {
		id: "54321",
		keyword: "woocommerce seo",
	},
};

describe( "WincherKeyphrasesTable", () => {
	it( "should fill the table with 1 element", () => {
		const component = shallow( <WincherKeyphrasesTable
			keyphrases={ keyphrases }
			onAuthentication={ noop }
			addTrackingKeyphrase={ noop }
			newRequest={ noop }
			setKeyphraseLimitReached={ noop }
			setTrackedKeyphrases={ noop }
			setRequestFailed={ noop }
			setRequestSucceeded={ noop }
			addTrackedKeyphrase={ noop }
			removeTrackedKeyphrase={ noop }
			permalink=""
		/> );

		expect( component.find( "tbody" ).getElement().props.children.length ).toEqual( 1 );
	} );

	it( "should have the right keyphrases present", () => {
		const component = shallow( <WincherKeyphrasesTable
			keyphrases={ keyphrases }
			trackedKeyphrases={ keyphrasesData }
			onAuthentication={ noop }
			addTrackingKeyphrase={ noop }
			newRequest={ noop }
			setKeyphraseLimitReached={ noop }
			setTrackedKeyphrases={ noop }
			setRequestFailed={ noop }
			setRequestSucceeded={ noop }
			addTrackedKeyphrase={ noop }
			removeTrackedKeyphrase={ noop }
			permalink=""
		/> );

		expect( component.find( WincherTableRow ).length ).toEqual( 1 );
		expect( component.instance().getKeyphraseData( "yoast seo" ) ).toEqual( keyphrasesData[ "yoast seo" ] );
	} );

	it( "should track all keyphrases", () => {
		const component = shallow( <WincherKeyphrasesTable
			keyphrases={ keyphrases }
			trackedKeyphrases={ keyphrasesData }
			onAuthentication={ noop }
			addTrackingKeyphrase={ noop }
			newRequest={ noop }
			setKeyphraseLimitReached={ noop }
			setTrackedKeyphrases={ noop }
			setRequestFailed={ noop }
			setRequestSucceeded={ noop }
			addTrackedKeyphrase={ noop }
			removeTrackedKeyphrase={ noop }
			isLoggedIn={ true }
			trackAll={ true }
			permalink=""
		/> );

		const spy = jest.spyOn( component.instance(), "performTrackingRequest" );

		component.instance().componentDidMount();

		expect( spy ).toHaveBeenCalled();
	} );
} );
