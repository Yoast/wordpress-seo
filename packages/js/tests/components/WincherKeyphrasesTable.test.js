import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

global.window.wpseoAdminGlobalL10n = [];
global.window.wpseoAdminGlobalL10n[ "links.wincher.login" ] = "test.com";

import WincherKeyphrasesTable
	from "../../../js/src/components/WincherKeyphrasesTable";
import { noop } from "lodash";
import WincherTableRow from "../../src/components/WincherTableRow";
import { trackKeyphrases } from "../../src/helpers/wincherEndpoints";

jest.mock( "../../src/helpers/wincherEndpoints" );
trackKeyphrases.mockImplementation( async fn => {
	await fn();
} );

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
			setHasTrackedAll={ noop }
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
			setHasTrackedAll={ noop }
			permalink=""
		/> );

		const rows = component.find( WincherTableRow );
		expect( rows.length ).toEqual( 1 );
		expect( rows.first().props().keyphrase ).toEqual( keyphrases[ 0 ] );
	} );

	it( "should track all keyphrases", async() => {
		await act( async() => {
			mount( <WincherKeyphrasesTable
				keyphrases={ keyphrases }
				trackedKeyphrases={ {} }
				onAuthentication={ noop }
				addTrackingKeyphrase={ noop }
				newRequest={ noop }
				setKeyphraseLimitReached={ noop }
				setTrackedKeyphrases={ noop }
				setRequestFailed={ noop }
				setRequestSucceeded={ noop }
				addTrackedKeyphrase={ noop }
				removeTrackedKeyphrase={ noop }
				setHasTrackedAll={ noop }
				isLoggedIn={ true }
				trackAll={ true }
				permalink=""
			/> );
		} );

		expect( trackKeyphrases ).toHaveBeenCalledWith( keyphrases );
	} );
} );
