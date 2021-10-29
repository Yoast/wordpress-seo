import { shallow } from "enzyme";

import WincherTableRow, { PositionOverTimeChart } from "../../src/components/WincherTableRow";
import { Toggle } from "@yoast/components";
import WincherSEOPerformanceLoading from "../../src/components/modals/WincherSEOPerformanceLoading";

const keyphrasesData = {
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
		// eslint-disable-next-line camelcase
		updated_at: new Date(),
	},
	"woocommerce seo": {
		id: "54321",
		keyword: "woocommerce seo",
		position: null,
		// eslint-disable-next-line camelcase
		updated_at: null,
	},
};

describe( "WincherTableRow", () => {
	it( "should render a row with the available data but without chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "woocommerce seo" ] }
			keyphrase="woocommerce seo"
		/> );

		expect( component.find( "td" ).length ).toEqual( 3 );
		expect( component.find( "td" ).at( 1 ).text() ).toEqual( "woocommerce seo" );
		expect( component.find( "td" ).at( 2 ).getElement().props.children ).toEqual( <WincherSEOPerformanceLoading /> );
	} );

	it( "should render a row with the available data and with chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "yoast seo" ] }
			keyphrase="yoast seo"
		/> );

		expect( component.find( "td" ).length ).toEqual( 5 );
		expect( component.find( Toggle ).length ).toEqual( 1 );
		expect( component.find( PositionOverTimeChart ).length ).toEqual( 1 );

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
		expect( component.find( PositionOverTimeChart ).length ).toEqual( 0 );

		expect( component.find( Toggle ).getElement().props.id ).toBe( "toggle-keyphrase-tracking-yoast seo" );
		expect( component.find( Toggle ).getElement().props.isEnabled ).toBe( false );
		expect( component.find( "td" ).at( 1 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 2 ).text() ).toEqual( "?" );
		expect( component.find( "td" ).at( 3 ).text() ).toEqual( "?" );
	} );
} );
