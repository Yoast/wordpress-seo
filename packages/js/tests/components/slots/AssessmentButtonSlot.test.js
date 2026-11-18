import { Fill, SlotFillProvider } from "@wordpress/components";
import { LocationProvider } from "@yoast/externals/contexts";
import { getAssessmentButtonSlotName } from "../../../src/analysis/constants";
import AssessmentButtonSlot from "../../../src/components/slots/AssessmentButtonSlot";
import { render, screen } from "../../test-utils";

/**
 * Renders the slot for one location, together with the fills passed in.
 *
 * @param {string} location The location to render the slot for.
 * @param {?JSX.Element} fills The fills to render alongside it, or null to render the slot on its own.
 *
 * @returns {import("@testing-library/react").RenderResult} The render result.
 */
const renderSlotWithFills = ( location, fills ) => render(
	<SlotFillProvider>
		{ fills }
		<LocationProvider value={ location }>
			<AssessmentButtonSlot id="imageAltTags" />
		</LocationProvider>
	</SlotFillProvider>
);

describe( "AssessmentButtonSlot", () => {
	it( "renders nothing when nothing fills the slot", () => {
		const { container } = renderSlotWithFills( "metabox", null );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( "renders what fills the slot for its own location", () => {
		renderSlotWithFills(
			"metabox",
			<Fill name={ getAssessmentButtonSlotName( "imageAltTags", "metabox" ) }>
				<button>Generate image alt text</button>
			</Fill>
		);

		expect( screen.getByRole( "button", { name: "Generate image alt text" } ) ).toBeInTheDocument();
	} );

	it( "ignores a fill meant for another location", () => {
		renderSlotWithFills(
			"metabox",
			<Fill name={ getAssessmentButtonSlotName( "imageAltTags", "sidebar" ) }>
				<button>Generate image alt text</button>
			</Fill>
		);

		expect( screen.queryByRole( "button" ) ).not.toBeInTheDocument();
	} );

	it( "keeps the metabox and the sidebar apart when both are mounted", () => {
		render(
			<SlotFillProvider>
				<Fill name={ getAssessmentButtonSlotName( "imageAltTags", "metabox" ) }>
					<button>Metabox button</button>
				</Fill>
				<Fill name={ getAssessmentButtonSlotName( "imageAltTags", "sidebar" ) }>
					<button>Sidebar button</button>
				</Fill>
				<LocationProvider value="metabox">
					<AssessmentButtonSlot id="imageAltTags" />
				</LocationProvider>
				<LocationProvider value="sidebar">
					<AssessmentButtonSlot id="imageAltTags" />
				</LocationProvider>
			</SlotFillProvider>
		);

		expect( screen.getByRole( "button", { name: "Metabox button" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Sidebar button" } ) ).toBeInTheDocument();
	} );

	it( "ignores a fill meant for another assessment", () => {
		renderSlotWithFills(
			"metabox",
			<Fill name={ getAssessmentButtonSlotName( "altTextLength", "metabox" ) }>
				<button>Fix with AI</button>
			</Fill>
		);

		expect( screen.queryByRole( "button" ) ).not.toBeInTheDocument();
	} );

	it( "keeps the slot names of the existing alt text assessments", () => {
		// Add-ons build these names with a literal fallback, so changing them would silently break older add-ons.
		expect( getAssessmentButtonSlotName( "imageAltTags", "metabox" ) ).toBe( "yoast.seoAnalysis.imageAltTagsButton.metabox" );
		expect( getAssessmentButtonSlotName( "altTextLength", "sidebar" ) ).toBe( "yoast.seoAnalysis.altTextLengthButton.sidebar" );
	} );
} );
