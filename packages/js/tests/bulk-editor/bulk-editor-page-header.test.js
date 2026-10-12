import { render, screen } from "../test-utils";
import { BulkEditorPageHeader } from "../../src/bulk-editor/components/bulk-editor-page-header";

describe( "BulkEditorPageHeader", () => {
	it( "renders the title as a heading inside a banner", () => {
		render( <BulkEditorPageHeader title="Bulk editor: Pages" /> );

		expect( screen.getByRole( "banner" ) ).toBeInTheDocument();
		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
	} );

	it( "renders the description when given", () => {
		render( <BulkEditorPageHeader title="Bulk editor: Pages" description="Quickly make changes to multiple pages." /> );

		expect( screen.getByText( "Quickly make changes to multiple pages." ) ).toBeInTheDocument();
	} );

	it( "renders no description paragraph when omitted", () => {
		const { container } = render( <BulkEditorPageHeader title="Bulk editor: Pages" /> );

		expect( container.querySelector( "p" ) ).not.toBeInTheDocument();
	} );
} );
