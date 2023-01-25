import * as renderer from "react-test-renderer";
import BlockAppender from "../../../src/functions/presenters/BlockAppender";

jest.mock( "@wordpress/block-editor", () =>  ( {
	Inserter: () => "BlockInserter",
} ) );

describe( "The BlockAppender", () => {
	it( "renders correctly", () => {
		const tree = renderer
			.create( BlockAppender( { clientId: "1234-abcd", label: "Add a block to your job posting..." } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
