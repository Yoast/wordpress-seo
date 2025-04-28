import { describe, expect, it } from "@jest/globals";
import { NoDataParagraph } from "../../src/components/no-data-paragraph";
import { render } from "@testing-library/react";

describe( "NoDataParagraph", () => {
	it( "should render the copy in a paragraph", () => {
		const { getByText } = render( <NoDataParagraph /> );
		expect( getByText( "No data to display: Your site hasn't received any visitors yet." ) ).toBeInstanceOf( HTMLParagraphElement );
	} );
} );
