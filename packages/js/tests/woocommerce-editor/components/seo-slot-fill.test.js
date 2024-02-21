import { Fill, SlotFillProvider } from "@wordpress/components";
import SidebarItem from "../../../src/components/SidebarItem";
import { SeoFill, SeoSlot } from "../../../src/woocommerce-editor/components/seo-slot-fill";
import { render, screen } from "../../test-utils";

describe( "SeoSlotFill", () => {
	it( "fills the slot", () => {
		render( <SlotFillProvider>
			<SeoSlot />
			<SeoFill>Foo</SeoFill>
		</SlotFillProvider> );

		expect( screen.getByText( "Foo" ) ).toBeInTheDocument();
	} );

	it( "fills the slot when using the name", () => {
		render( <SlotFillProvider>
			<SeoSlot />
			<Fill name="yoast-seo/woocommerce-editor/seo">Foo</Fill>
		</SlotFillProvider> );

		expect( screen.getByText( "Foo" ) ).toBeInTheDocument();
	} );

	it( "sorts the fills by renderPriority", () => {
		render( <SlotFillProvider>
			<div data-testid={ 1 }>
				<SeoSlot />
				<SeoFill>
					<SidebarItem renderPriority={ 200 }>200</SidebarItem>
					<SidebarItem renderPriority={ 10 }>10</SidebarItem>
				</SeoFill>
			</div>
		</SlotFillProvider> );

		expect( screen.getByText( "200" ) ).toBeInTheDocument();
		expect( screen.getByText( "10" ) ).toBeInTheDocument();
		expect( screen.getByTestId( 1 ) ).toMatchSnapshot();
	} );
} );
