import { MostPopularTable } from "../../../src/dashboard/components/most-popular-table";
import { render } from "../../test-utils";

describe( "MostPopularTable", () => {
	it( "should render the one line with edit button", () => {
		const { getByRole } = render(
			<MostPopularTable
				data={ [
					{
						subject: "https://example.com/page1",
						clicks: 100,
						impressions: 1000,
						ctr: 0.020383459755,
						averagePosition: 5.568768,
						seoScore: "good",
						links: {
							edit: "https://example.com/page1/edit",
						},
					},
				] }
			/>
		);

		const editButton = getByRole( "link", { name: "Edit" } );
		expect( editButton ).toBeInTheDocument();
		expect( editButton ).toHaveAttribute( "href", "https://example.com/page1/edit" );
		expect( editButton ).toHaveAttribute( "aria-disabled", "false" );
	} );
	it( "should render the one line with disabled edit button", () => {
		const { getByRole } = render(
			<MostPopularTable
				data={ [
					{
						subject: "https://example.com/page1",
						clicks: 100,
						impressions: 1000,
						ctr: 0.020383459755,
						averagePosition: 5.568768,
						seoScore: "good",
						links: { edit: null },
					},
				] }
			/>
		);
		const editButton = getByRole( "link", { name: "Edit" } );
		expect( editButton ).toBeInTheDocument();
		expect( editButton ).not.toHaveAttribute( "href" );
		expect( editButton ).toHaveAttribute( "disabled" );
		expect( editButton ).toHaveAttribute( "aria-disabled", "true" );
	} );
} );
