import { describe, expect, it } from "@jest/globals";
import { BaseCard } from "../../../../src/plans/components/cards/base-card";
import { render } from "../../../test-utils";

const PROPS = {
	header: "FooHeader",
	title: "FooTitle",
	description: "FooDescription",
	list: [ "Feature 1", "Feature 2", "Feature 3" ],
	buyLink: "https://example.com/buy",
	manageLink: "https://example.com/manage",
	learnMoreLink: "https://example.com/learn-more",
	isManageAvailable: false,
};

it( "should contain the header", () => {
	const { getByText } = render( <BaseCard { ...PROPS } /> );
	expect( getByText( "FooHeader" ) ).toBeInTheDocument();
} );

it( "should contain the heading", () => {
	const { getByRole } = render( <BaseCard { ...PROPS } /> );
	expect( getByRole( "heading", { level: 2 } ) ).toHaveTextContent( "Title" );
} );

it( "should contain the description", () => {
	const { getByText } = render( <BaseCard { ...PROPS } /> );
	expect( getByText( "FooDescription" ) ).toBeInTheDocument();
} );

describe( "listDescription", () => {
	it( "should contain the list description", () => {
		const { getByText } = render( <BaseCard { ...PROPS } listDescription="FooListDescription" /> );
		expect( getByText( "FooListDescription" ) ).toBeInTheDocument();
	} );

	it( "should not contain the list description by default", () => {
		const { queryByText } = render( <BaseCard { ...PROPS } /> );
		expect( queryByText( "FooListDescription" ) ).not.toBeInTheDocument();
	} );
} );

it( "should contain the list", () => {
	const { getAllByRole, getByRole } = render( <BaseCard { ...PROPS } /> );
	expect( getByRole( "list" ) ).toBeInTheDocument();
	const listItems = getAllByRole( "listitem" );
	expect( listItems ).toHaveLength( 3 );
	expect( listItems[ 0 ] ).toHaveTextContent( "Feature 1" );
	expect( listItems[ 1 ] ).toHaveTextContent( "Feature 2" );
	expect( listItems[ 2 ] ).toHaveTextContent( "Feature 3" );
} );

describe( "includes", () => {
	it( "should contain the includes section", () => {
		const { getByText } = render( <BaseCard { ...PROPS } includes={ <span>FooIncludes</span> } /> );
		expect( getByText( "Now includes:" ) ).toBeInTheDocument();
		expect( getByText( "FooIncludes" ) ).toBeInTheDocument();
	} );

	it( "should not contain the includes section by default", () => {
		const { queryByText } = render( <BaseCard { ...PROPS } /> );
		expect( queryByText( "FooIncludes" ) ).not.toBeInTheDocument();
	} );
} );

it( "should have a separator", () => {
	const { getByRole } = render( <BaseCard { ...PROPS } /> );
	expect( getByRole( "separator" ) ).toBeInTheDocument();
} );

describe( "links", () => {
	it( "should have a learn more link", () => {
		const { getByRole } = render( <BaseCard { ...PROPS } /> );
		expect( getByRole( "link", { name: "Learn more (Opens in a new browser tab)" } ) )
			.toHaveAttribute( "href", "https://example.com/learn-more" );
	} );

	it( "should have a manage link", () => {
		const { getByRole } = render( <BaseCard { ...PROPS } isManageAvailable={ true } /> );
		expect( getByRole( "link", { name: "Manage in MyYoast (Opens in a new browser tab)" } ) )
			.toHaveAttribute( "href", "https://example.com/manage" );
	} );

	it( "should have a buy link", () => {
		const { getByRole } = render( <BaseCard { ...PROPS } isManageAvailable={ false } /> );
		expect( getByRole( "link", { name: "Buy product (Opens in a new browser tab)" } ) )
			.toHaveAttribute( "href", "https://example.com/buy" );
	} );
} );

describe( "highlighting", () => {
	it( "should have an active highlight", () => {
		const { container, getByText } = render( <BaseCard { ...PROPS } hasHighlight={ true } isActiveHighlight={ true } /> );

		expect( getByText( "Current active plan" ) ).toBeInTheDocument();
		expect( container.firstChild.firstChild.className ).toContain( "yst-border-green-400" );
		expect( container.firstChild.firstChild.className ).toContain( "yst-shadow" );
	} );

	it( "should have an inactive highlight", () => {
		const { container, getByText } = render( <BaseCard { ...PROPS } hasHighlight={ true } isActiveHighlight={ false } /> );

		expect( getByText( "Plan not activated" ) ).toBeInTheDocument();
		expect( container.firstChild.firstChild.className ).toContain( "yst-border-red-400" );
		expect( container.firstChild.firstChild.className ).toContain( "yst-shadow" );
	} );
} );
