import { render } from "../../test-utils";
import { RouteLayout } from "../../../src/general/components/route-layout";

describe( "RouteLayout", () => {
	const props = {
		children: <>empty component </>,
		title: "Title",
		description: "Description",
	};

	it( "renders the component correctly for default props", () => {
		const { container } = render( <RouteLayout { ...props } /> );
		expect( container ).toMatchSnapshot();
	} );

	it( "renders the component correctly for custom props", () => {
		const { container } = render( <RouteLayout
			{ ...props }
			title="Custom title"
			description="custom description"
		/> );
		expect( container ).toMatchSnapshot();
	} );
} );
