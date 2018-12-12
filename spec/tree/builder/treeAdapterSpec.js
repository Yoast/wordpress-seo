import TreeAdapter from "../../../src/tree/builder/TreeAdapter";
import StructuredIrrelevant from "../../../src/tree/values/nodes/StructuredIrrelevant";
import Heading from "../../../src/tree/values/nodes/Heading";
import Paragraph from "../../../src/tree/values/nodes/Paragraph";
import List from "../../../src/tree/values/nodes/List";
import ListItem from "../../../src/tree/values/nodes/ListItem";
import StructuredNode from "../../../src/tree/values/nodes/StructuredNode";

describe( "TreeAdapter constructor", () => {
	it( "can make a TreeAdapter", () => {
		const adapter = new TreeAdapter();

		expect( adapter.currentParentNode ).toBe( null );
	} );
} );

describe( "TreeAdapter createElement", () => {
	it( "can create an irrelevant structured node", () => {
		const adapter = new TreeAdapter();

		const expectedStructuredIrrelevant = adapter.createElement( "script" );

		expect( expectedStructuredIrrelevant instanceof StructuredIrrelevant ).toBe( true );
	} );

	it( "can create a heading node", () => {
		const adapter = new TreeAdapter();

		const expectedHeading = adapter.createElement( "h2" );

		expect( expectedHeading instanceof Heading ).toBe( true );
		expect( expectedHeading.level ).toBe( 2 );
	} );

	it( "can create a paragraph node", () => {
		const adapter = new TreeAdapter();

		const expectedParagraph = adapter.createElement( "p" );

		expect( expectedParagraph instanceof Paragraph ).toBe( true );
	} );

	it( "can create an ordered list node", () => {
		const adapter = new TreeAdapter();

		const expectedList = adapter.createElement( "ol" );

		expect( expectedList instanceof List ).toBe( true );
		expect( expectedList.ordered ).toBe( true );
	} );

	it( "can create an unordered list node", () => {
		const adapter = new TreeAdapter();

		const expectedList = adapter.createElement( "ul" );

		expect( expectedList instanceof List ).toBe( true );
		expect( expectedList.ordered ).toBe( false );
	} );

	it( "can create a listItem node", () => {
		const adapter = new TreeAdapter();

		const expectedListItem = adapter.createElement( "li" );

		expect( expectedListItem instanceof ListItem ).toBe( true );
	} );

	it( "can create a default structured node with a tag", () => {
		const adapter = new TreeAdapter();

		const expectedStructuredNode = adapter.createElement( "div" );

		expect( expectedStructuredNode instanceof StructuredNode ).toBe( true );
	} );

	it( "can create a default structured node without a tag", () => {
		const adapter = new TreeAdapter();

		const expectedStructuredNode = adapter.createElement( "" );

		expect( expectedStructuredNode instanceof StructuredNode ).toBe( true );
	} );
} );
