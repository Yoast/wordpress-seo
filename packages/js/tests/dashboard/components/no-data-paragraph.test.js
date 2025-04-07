import { describe, expect, it } from "@jest/globals";
import { NoDataParagraph } from "../../../src/dashboard/components/no-data-paragraph";
import { render } from "../../test-utils";

describe( "NoDataParagraph", () => {
	it( "should render the copy in a paragraph", () => {
		const { getByText } = render( <NoDataParagraph /> );
		expect( getByText( "No data to display: Your site hasn't received any visitors yet." ) ).toBeInstanceOf( HTMLParagraphElement );
	} );
} );
