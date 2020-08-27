import { mount, shallow } from "enzyme";

global.window.wpseoAdminL10n = [];
global.window.wpseoAdminL10n[ "shortlinks.semrush.volume_help" ] = "test.com";

import SEMrushKeyphrasesTable
	from "../../../js/src/components/modals/SEMrushKeyphrasesTable";

const testData = {
	"results":{
		"columnNames":[
			"Keyword",
			"Search Volume",
			"Trends"
		],
		"rows":[
			[
				"a",
				"1500000",
				"0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,1.00,1.00,1.00"
			],
			[
				"ice",
				"301000",
				"1.00,0.67,0.45,0.45,0.37,0.37,0.37,0.37,0.37,0.30,0.37,0.45"
			],
			[
				"record",
				"135000",
				"0.82,0.82,0.82,0.82,1.00,1.00,0.82,0.82,0.82,0.82,0.82,0.82"
			],
			[
				"ever",
				"49500",
				"0.45,0.45,0.45,0.55,0.45,0.55,0.55,0.55,1.00,0.82,0.82,0.45"
			],
			[
				"year",
				"40500",
				"0.67,0.67,0.67,0.82,0.82,1.00,1.00,0.82,0.82,1.00,1.00,1.00"
			],
			[
				"president donald trump greenland",
				"33100",
				"0.00,1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00"
			],
			[
				"greenland map",
				"27100",
				"0.06,1.00,0.20,0.11,0.11,0.11,0.13,0.13,0.13,0.11,0.09,0.07"
			],
			[
				"greenland population",
				"27100",
				"0.13,1.00,0.25,0.13,0.13,0.13,0.16,0.16,0.37,0.37,0.16,0.16"
			],
			[
				"trump greenland",
				"18100",
				"0.00,1.00,0.04,0.01,0.01,0.01,0.01,0.01,0.01,0.02,0.01,0.01"
			],
			[
				"greenland movie",
				"12100",
				"0.06,0.02,0.01,0.01,0.01,0.01,0.02,0.01,0.05,0.20,0.05,1.00"
			]
		]
	},
	"status":200
}


describe( "SEMrushKeyphrasesTable", () => {
	it( "should fill the table with 10 elements", () => {
		const component = shallow(<SEMrushKeyphrasesTable keyphrase={"yoast seo"}
		relatedKeyphrases={["yoast"]} countryCode={"us"} data={ testData } renderAction={() => {}} />) ;

		expect( component.find("tbody").getElement().props.children.length).toEqual(10);
	} );

} );
