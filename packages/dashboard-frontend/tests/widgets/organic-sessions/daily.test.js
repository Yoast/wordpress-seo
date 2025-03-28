import { describe, expect, it, jest } from "@jest/globals";
import { forEach } from "lodash";
import { OrganicSessionsDaily } from "../../../src/widgets/organic-sessions/daily";
import { render } from "../../test-utils";

// Mock the Chart.js library. Preventing the error:
// > Failed to create chart: can't acquire context from the given item.
// Note: this also prevents the canvas from being rendered.
jest.mock( "chart.js" );
jest.mock( "react-chartjs-2" );

describe( "OrganicSessionsDaily", () => {
	const data = {
		labels: [
			"Jan 30",
			"Jan 31",
			"Feb 1",
			"Feb 2",
			"Feb 3",
			"Feb 4",
			"Feb 5",
			"Feb 6",
			"Feb 7",
			"Feb 8",
			"Feb 9",
			"Feb 10",
			"Feb 11",
			"Feb 12",
			"Feb 13",
			"Feb 14",
			"Feb 15",
			"Feb 16",
			"Feb 17",
			"Feb 18",
			"Feb 19",
			"Feb 20",
			"Feb 21",
			"Feb 22",
			"Feb 23",
			"Feb 24",
			"Feb 25",
			"Feb 26",
		],
		datasets: [
			{
				fill: "origin",
				data: [
					{
						date: "Jan 30",
						sessions: 0,
					},
					{
						date: "Jan 31",
						sessions: 0,
					},
					{
						date: "Feb 1",
						sessions: 0,
					},
					{
						date: "Feb 2",
						sessions: 0,
					},
					{
						date: "Feb 3",
						sessions: 0,
					},
					{
						date: "Feb 4",
						sessions: 0,
					},
					{
						date: "Feb 5",
						sessions: 0,
					},
					{
						date: "Feb 6",
						sessions: 0,
					},
					{
						date: "Feb 7",
						sessions: 2,
					},
					{
						date: "Feb 8",
						sessions: 0,
					},
					{
						date: "Feb 9",
						sessions: 1,
					},
					{
						date: "Feb 10",
						sessions: 1,
					},
					{
						date: "Feb 11",
						sessions: 0,
					},
					{
						date: "Feb 12",
						sessions: 0,
					},
					{
						date: "Feb 13",
						sessions: 0,
					},
					{
						date: "Feb 14",
						sessions: 1,
					},
					{
						date: "Feb 15",
						sessions: 0,
					},
					{
						date: "Feb 16",
						sessions: 0,
					},
					{
						date: "Feb 17",
						sessions: 1,
					},
					{
						date: "Feb 18",
						sessions: 1,
					},
					{
						date: "Feb 19",
						sessions: 1,
					},
					{
						date: "Feb 20",
						sessions: 2,
					},
					{
						date: "Feb 21",
						sessions: 0,
					},
					{
						date: "Feb 22",
						sessions: 0,
					},
					{
						date: "Feb 23",
						sessions: 0,
					},
					{
						date: "Feb 24",
						sessions: 0,
					},
					{
						date: "Feb 25",
						sessions: 1,
					},
					{
						date: "Feb 26",
						sessions: 0,
					},
				],
			},
		],
	};
	const supportLink = "https://yoa.st/support";

	it( "renders component with data", () => {
		const { getByText } = render(
			<OrganicSessionsDaily data={ data } isPending={ false } supportLink={ supportLink } />
		);

		forEach( data.labels, ( label ) => {
			expect( getByText( label ) ).toBeInTheDocument();
		} );
	} );

	it( "renders component with pending state", () => {
		const { queryByText } = render(
			<OrganicSessionsDaily data={ data } isPending={ true } supportLink={ supportLink } />
		);
		forEach( data.labels, ( label ) => {
			expect( queryByText( label ) ).not.toBeInTheDocument();
		} );
	} );

	it( "renders component with error", () => {
		const error = new Error( "An error occurred" );
		const { getByRole } = render(
			<OrganicSessionsDaily data={ data } isPending={ false } error={ error } supportLink={ supportLink } />
		);
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", supportLink );
	} );
} );

