import { SlotFillProvider } from "@wordpress/components";
import { LocationConsumer, RootContext } from "@yoast/externals/contexts";
import { Edit } from "../../../../src/woocommerce-editor/blocks/seo/edit";
import { SeoFill } from "../../../../src/woocommerce-editor/components/seo-slot-fill";
import { render, screen } from "../../../test-utils";

jest.mock( "@woocommerce/block-templates", () => ( {
	useWooBlockProps: arg => arg,
} ) );

describe( "Edit", () => {
	it( "renders", () => {
		render( <Edit attributes={ { "data-testid": 1 } } context={ { postType: "product" } } /> );

		expect( screen.getByTestId( 1 ) ).toMatchSnapshot();
	} );

	it( "has a slot", () => {
		render( <SlotFillProvider>
			<Edit attributes={ { "data-testid": 1 } } context={ { postType: "product" } } />
			<SeoFill>Foo</SeoFill>
		</SlotFillProvider> );

		expect( screen.getByText( "Foo" ) ).toBeInTheDocument();
		expect( screen.getByTestId( 1 ) ).toMatchSnapshot();
	} );

	it( "provides the location", () => {
		render( <SlotFillProvider>
			<Edit attributes={ { "data-testid": 1 } } context={ { postType: "product" } } />
			<SeoFill>
				<LocationConsumer>
					{ ( location ) => location }
				</LocationConsumer>
			</SeoFill>
		</SlotFillProvider> );

		expect( screen.getByText( "sidebar" ) ).toBeInTheDocument();
		expect( screen.getByTestId( 1 ) ).toMatchSnapshot();
	} );

	it( "provides the locationContext", () => {
		render( <SlotFillProvider>
			<Edit attributes={ { "data-testid": 1 } } context={ { postType: "product" } } />
			<SeoFill>
				<RootContext.Consumer>
					{ ( { locationContext } ) => locationContext }
				</RootContext.Consumer>
			</SeoFill>
		</SlotFillProvider> );

		expect( screen.getByText( "product-seo" ) ).toBeInTheDocument();
		expect( screen.getByTestId( 1 ) ).toMatchSnapshot();
	} );

	it( "provides the postType", () => {
		render( <SlotFillProvider>
			<Edit attributes={ {} } context={ { postType: "product" } } />
			<SeoFill>
				<RootContext.Consumer>
					{ ( { postType } ) => postType }
				</RootContext.Consumer>
			</SeoFill>
		</SlotFillProvider> );

		expect( screen.getByText( "product" ) ).toBeInTheDocument();
	} );
} );
