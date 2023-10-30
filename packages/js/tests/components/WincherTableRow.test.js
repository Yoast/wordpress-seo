import WincherTableRow from "../../src/components/WincherTableRow";
import { render, screen, within } from "../test-utils";
import { noop } from "lodash";

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
		render( <WincherTableRow
			rowData={ keyphrasesData[ "woocommerce seo" ] }
			keyphrase="woocommerce seo"
			onSelectKeyphrases={ noop }
			isSelected={ false }
		/> );

		const rows = screen.getAllByRole( "cell" );
		expect( rows.length ).toBe( 4 );
		expect( rows[ 1 ].textContent ).toContain( "woocommerce seo" );
		const loadingText = screen.getByText( "Tracking the ranking position..." );
		expect( loadingText ).toBeInTheDocument();
	} );

	it( "should render a row with the available data and with chart data", () => {
		render( <WincherTableRow
			rowData={ keyphrasesData[ "yoast seo" ] }
			keyphrase="yoast seo"
			onSelectKeyphrases={ noop }
			isSelected={ false }
		/> );

		const rows = screen.getAllByRole( "row" );
		const toggle = within( rows[ 0 ] ).getAllByRole( "checkbox" );
		expect( toggle.length ).toBe( 2 );
		expect( toggle[ 1 ] ).toBeChecked();
		const positionOverTimeChart = within( rows[ 0 ] ).getAllByRole( "button" );
		expect( positionOverTimeChart.length ).toBe( 1 );
		const keyfrase = within( rows[ 0 ] ).getByText( "yoast seo" );
		expect( keyfrase ).toBeInTheDocument();
	} );

	it( "should not render an enabled toggle or any position and chart data when no data is available", () => {
		render( <WincherTableRow
			rowData={ {} }
			keyphrase="yoast seo"
			onSelectKeyphrases={ noop }
			isSelected={ false }
		/> );

		const rows = screen.getAllByRole( "row" );
		const toggle = within( rows[ 0 ] ).getAllByRole( "checkbox" );
		expect( toggle.length ).toBe( 1 );
		expect( toggle[ 0 ] ).not.toBeChecked();

		const cells = within( rows[ 0 ] ).getAllByRole( "cell" );
		expect( cells.length ).toBe( 4 );


		const positionOverTimeChart = screen.queryByRole( "button", { name: /example button/i } );
		expect( positionOverTimeChart ).not.toBeInTheDocument();

		const keyfrase = within( rows[ 0 ] ).getByText( "yoast seo" );
		expect( keyfrase ).toBeInTheDocument();
	} );
} );
