import SidebarCollapsible from "../../src/components/SidebarCollapsible";
import { fireEvent, render, screen } from "../test-utils";

const defaultArgs = {
	title: "Test title",
	children: <div id="inner-div">Test children</div>,
};

describe( "SidebarCollapsible", () => {
	it( "is opened", async() => {
		const { container } = render( <SidebarCollapsible { ...defaultArgs } /> );
		const button = screen.getByRole( "button" );
		fireEvent.click( button );
		const innerDiv = container.querySelector( "#inner-div" );
		expect( innerDiv ).toBeInTheDocument();
		expect( container ).toMatchSnapshot();
	} );

	it( "is closed", async() => {
		const { container } = render( <SidebarCollapsible { ...defaultArgs } /> );
		const innerDiv = container.querySelector( "#inner-div" );
		expect( innerDiv ).not.toBeInTheDocument();
		expect( container ).toMatchSnapshot();
	} );

	it( "has beta badge", async() => {
		const { container } = render( <SidebarCollapsible hasBetaBadgeLabel={ true } { ...defaultArgs } /> );
		const badge = container.querySelector( ".yoast-beta-badge" );
		expect( badge ).toBeInTheDocument();
	} );

	it( "has svg prefix icon", async() => {
		const { container } = render( <SidebarCollapsible prefixIcon={ { icon: "gear", color: "green" } } { ...defaultArgs } /> );
		const icon = container.querySelector( "svg" );

		expect( icon ).toBeInTheDocument();
	} );

	it( "has id associated to inner button", async() => {
		const { container } = render( <SidebarCollapsible buttonId="test-button-id" { ...defaultArgs } /> );
		const button = container.querySelector( "#test-button-id" );
		expect( button ).toBeInTheDocument();
	} );
} );
