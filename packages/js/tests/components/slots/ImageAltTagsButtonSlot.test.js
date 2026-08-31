import { Fill, SlotFillProvider } from "@wordpress/components";
import { LocationProvider } from "@yoast/externals/contexts";
import { getImageAltTagsButtonSlotName } from "../../../src/analysis/constants";
import ImageAltTagsButtonSlot from "../../../src/components/slots/ImageAltTagsButtonSlot";
import { render, screen } from "../../test-utils";

/**
 * Renders the slot for one location, together with the fills passed in.
 *
 * @param {string} location The location to render the slot for.
 * @param {JSX.Element} fills The fills to render alongside it.
 *
 * @returns {void}
 */
const renderSlotWithFills = ( location, fills ) => render(
	<SlotFillProvider>
		{ fills }
		<LocationProvider value={ location }>
			<ImageAltTagsButtonSlot />
		</LocationProvider>
	</SlotFillProvider>
);

describe( "ImageAltTagsButtonSlot", () => {
	it( "renders nothing when nothing fills the slot", () => {
		const { container } = renderSlotWithFills( "metabox", null );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( "renders what fills the slot for its own location", () => {
		renderSlotWithFills(
			"metabox",
			<Fill name={ getImageAltTagsButtonSlotName( "metabox" ) }>
				<button>Generate image alt text</button>
			</Fill>
		);

		expect( screen.getByRole( "button", { name: "Generate image alt text" } ) ).toBeInTheDocument();
	} );

	it( "ignores a fill meant for another location", () => {
		renderSlotWithFills(
			"metabox",
			<Fill name={ getImageAltTagsButtonSlotName( "sidebar" ) }>
				<button>Generate image alt text</button>
			</Fill>
		);

		expect( screen.queryByRole( "button" ) ).not.toBeInTheDocument();
	} );

	it( "keeps the metabox and the sidebar apart when both are mounted", () => {
		render(
			<SlotFillProvider>
				<Fill name={ getImageAltTagsButtonSlotName( "metabox" ) }>
					<button>Metabox button</button>
				</Fill>
				<Fill name={ getImageAltTagsButtonSlotName( "sidebar" ) }>
					<button>Sidebar button</button>
				</Fill>
				<LocationProvider value="metabox">
					<ImageAltTagsButtonSlot />
				</LocationProvider>
				<LocationProvider value="sidebar">
					<ImageAltTagsButtonSlot />
				</LocationProvider>
			</SlotFillProvider>
		);

		expect( screen.getByRole( "button", { name: "Metabox button" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Sidebar button" } ) ).toBeInTheDocument();
	} );
} );
