// import { act } from "react-dom/test-utils";

global.window.wpseoAdminGlobalL10n = [];
global.window.wpseoAdminGlobalL10n[ "links.wincher.login" ] = "test.com";

// import WincherKeyphrasesTable
// 	from "../../../js/src/components/WincherKeyphrasesTable";
// import { noop } from "lodash";
// import WincherTableRow from "../../src/components/WincherTableRow";
import { trackKeyphrases } from "../../src/helpers/wincherEndpoints";

jest.mock( "../../src/helpers/wincherEndpoints" );
trackKeyphrases.mockImplementation( async fn => {
	return fn;
} );

// const keyphrases = [ "yoast seo" ];

// const keyphrasesData = {
// 	"yoast seo": {
// 		id: "12345",
// 		keyword: "yoast seo",
// 		// eslint-disable-next-line camelcase
// 		updated_at: new Date().toISOString(),
// 		position: {
// 			value: 10,
// 			history: [
// 				{
// 					datetime: "2021-08-02T22:00:00Z",
// 					value: 40,
// 				},
// 				{
// 					datetime: "2021-08-03T22:00:00Z",
// 					value: 38,
// 				},
// 			],
// 		},
// 	},
// 	"woocommerce seo": {
// 		id: "54321",
// 		keyword: "woocommerce seo",
// 	},
// };

describe( "WincherKeyphrasesTable", () => {
	it( "should fill the table with 1 element", () => {

	} );

	it( "should have the right keyphrases present", () => {

	} );

	it( "should track all keyphrases", async() => {

	} );

	it( "should add an asterisk after the focus keyphrase, even if the keyphrase contains capital letters", () => {

	} );
} );
