import { render, screen } from "../../test-utils.js";
import "@testing-library/jest-dom";
import { DashboardTable } from "../../../src/dashboard/components/dashboard-table.js";
import { SCORE_META } from "../../../src/dashboard/scores/score-meta.js";

describe( "DashboardTable", () => {
	const columns = [
		{ name: "landing-page", label: "Landing page" },
		{ name: "clicks", label: "Clicks" },
		{ name: "impressions", label: "Impressions" },
		{ name: "ctr", label: "CTR" },
		{ name: "average-position", label: "Average position" },
		{ name: "seo-score", label: "SEO score" },
	];

	const data = [
		[ "https://example.com1", 10, 1001, 10, 1, "good" ],
		[ "https://example.com2", 90, 1002, 9, 3, "bad" ],
		[ "https://example.com3", 50, 1003, 8, 5, "good" ],
		[ "https://example.com4", 0, 1004, 7, 2, "ok" ],
		[ "https://example.com5", 70, 1005, 6, 4, "ok" ],
	];

	it( "renders the table with correct title and columns", () => {
		render( <DashboardTable title="Test Table" columns={ columns } data={ data } /> );
		expect( screen.getByText( "Test Table" ) ).toBeInTheDocument();
		columns.forEach( ( column ) => {
			expect( screen.getByText( column.label ) ).toBeInTheDocument();
		} );
	} );

	it( "renders the table rows correctly", () => {
		render( <DashboardTable title="Test Table" columns={ columns } data={ data } /> );
		data.forEach( ( row ) => {
			const rowElement = screen.getByText( row[ 0 ] ).closest( "tr" );
			expect( rowElement ).toHaveTextContent( row[ 0 ] );
			expect( rowElement ).toHaveTextContent( String( row[ 1 ] ) );
			expect( rowElement ).toHaveTextContent( String( row[ 2 ] ) );
			expect( rowElement ).toHaveTextContent( String( row[ 3 ] ) );
			expect( rowElement ).toHaveTextContent( String( row[ 4 ] ) );
			expect( rowElement ).toHaveTextContent( SCORE_META[ row[ 5 ] ].label );
		} );
	} );
} );
