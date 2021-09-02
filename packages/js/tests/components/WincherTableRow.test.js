import { shallow } from "enzyme";

global.window.wpseoAdminL10n = [];
global.window.wpseoAdminL10n[ "shortlinks.semrush.volume_help" ] = "test.com";

import WincherTableRow from "../../src/components/WincherTableRow";
import AreaChart from "../../src/components/AreaChart";
import { Toggle } from "@yoast/components";
import WincherSEOPerformanceLoading from "../../src/components/modals/WincherSEOPerformanceLoading";

const keyphrases = [ "yoast seo" ];

const keyphrasesData = {
	"yoast seo": {
		id: "12345",
		keyword: "yoast seo",
	},
	"woocommerce seo": {
		id: "54321",
		keyword: "woocommerce seo",
	},
};

const chartData = {
	"yoast seo": {
		id: "12345",
		keyword: "yoast seo",
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
};

const expectedGraphData = [
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 1 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 1 ], [ 0.67 ], [ 0.45 ], [ 0.45 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.3 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 1 ], [ 1 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.45 ], [ 0.45 ], [ 0.45 ], [ 0.55 ], [ 0.45 ], [ 0.55 ], [ 0.55 ], [ 0.55 ], [ 1 ], [ 0.82 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.67 ], [ 0.67 ], [ 0.67 ], [ 0.82 ], [ 0.82 ], [ 1 ], [ 1 ], [ 0.82 ], [ 0.82 ], [ 1 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0 ], [ 1 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ .06 ], [ 1 ], [ 0.2 ], [ 0.11 ], [ 0.11 ], [ 0.11 ], [ 0.13 ], [ 0.13 ], [ 0.13 ], [ 0.11 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.13 ], [ 1 ], [ 0.25 ], [ 0.13 ], [ 0.13 ], [ 0.13 ], [ 0.16 ], [ 0.16 ], [ 0.37 ], [ 0.37 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0 ], [ 1 ], [ 0.04 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.02 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.06 ], [ 0.02 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.02 ], [ 0.01 ], [ 0.05 ], [ 0.2 ] ],
	},
];


describe( "WincherTableRow", () => {
	it( "should render a row with the available data but without chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "yoast seo" ] }
			keyphrase="yoast seo"
		/> );

		expect( component.find( "td" ).length ).toEqual( 3 );
		expect( component.find( "td" ).at( 1 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 2 ).getElement().props.children ).toEqual( <WincherSEOPerformanceLoading /> );
	} );

	it( "should render a row with the available data and with chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "yoast seo" ] }
			chartData={ chartData[ "yoast seo" ] }
			keyphrase="yoast seo"
		/> );

		expect( component.find( "td" ).length ).toEqual( 5 );
		expect( component.find( Toggle ).length ).toEqual( 1 );
		expect( component.find( AreaChart ).length ).toEqual( 1 );

		expect( component.find( Toggle ).getElement().props.id ).toBe( "toggle-keyphrase-tracking-yoast seo" );
		expect( component.find( Toggle ).getElement().props.isEnabled ).toBe( true );
		expect( component.find( Toggle ).getElement().props.showToggleStateLabel ).toBe( false );

		expect( component.find( "td" ).at( 1 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 2 ).text() ).toEqual( "10" );
	} );

	it( "should not render an enabled toggle or any position and chart data when no data is available", () => {
		const component = shallow( <WincherTableRow
			rowData={ {} }
			keyphrase="yoast seo"
		/> );

		expect( component.find( "td" ).length ).toEqual( 5 );
		expect( component.find( Toggle ).length ).toEqual( 1 );
		expect( component.find( AreaChart ).length ).toEqual( 0 );

		expect( component.find( Toggle ).getElement().props.id ).toBe( "toggle-keyphrase-tracking-yoast seo" );
		expect( component.find( Toggle ).getElement().props.isEnabled ).toBe( false );
		expect( component.find( "td" ).at( 1 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 2 ).text() ).toEqual( "?" );
		expect( component.find( "td" ).at( 3 ).text() ).toEqual( "?" );
	} );

	it( "should have the right calculated graph points", () => {
		// const component = shallow( <WincherTableRow
		// 	keyphrase={ "yoast seo" }
		// 	relatedKeyphrases={ [ "yoast" ] } countryCode={ "us" } data={ testData } renderAction={ noop }
		// /> );
		//
		// const graphElements = component.find( { className: "yoast-table--nopadding" } ).getElements();
		// let elementIndex, expectedValueIndex;
		// for ( elementIndex = 0; elementIndex < graphElements.length; elementIndex++ ) {
		// 	for ( expectedValueIndex = 0; expectedValueIndex < graphElements.length; expectedValueIndex++ ) {
		// 		expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].x )
		// 			.toEqual( expectedGraphData[ elementIndex ].x[ expectedValueIndex ][ 0 ] );
		// 		expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].y )
		// 			.toEqual( expectedGraphData[ elementIndex ].y[ expectedValueIndex ][ 0 ] );
		// 	}
		// }
	} );
} );
