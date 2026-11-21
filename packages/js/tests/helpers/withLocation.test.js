import { createElement } from "@wordpress/element";
import { LocationProvider } from "@yoast/externals/contexts";
import { render, screen } from "../test-utils";
import withLocation from "../../src/helpers/withLocation";

const Probe = ( { location, marker } ) => createElement( "p", null, `${ marker }-${ location }` );
const LocatedProbe = withLocation()( Probe );

describe( "withLocation", () => {
	it( "passes the location from context as a prop", () => {
		render(
			<LocationProvider value="metabox">
				<LocatedProbe marker="loc" />
			</LocationProvider>
		);

		expect( screen.getByText( "loc-metabox" ) ).toBeInTheDocument();
	} );
} );
