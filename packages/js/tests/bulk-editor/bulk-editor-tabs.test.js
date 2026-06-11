import { useState } from "@wordpress/element";
import { fireEvent, render, screen } from "../test-utils";
import { noop } from "lodash";
import { BulkEditorTabPanel, BulkEditorTabs, getTabId, getTabPanelId } from "../../src/bulk-editor/components/bulk-editor-tabs";

const tabs = [
	{ id: "search", label: "Search appearance" },
	{ id: "social", label: "Social appearance" },
];

/**
 * Renders the tabs with local state.
 *
 * @returns {JSX.Element} The harness.
 */
const TabsHarness = () => {
	const [ activeTab, setActiveTab ] = useState( "search" );

	return (
		<>
			<BulkEditorTabs tabs={ tabs } activeTab={ activeTab } onChange={ setActiveTab } label="Bulk editor tabs" />
			<BulkEditorTabPanel tabId="search" isActive={ activeTab === "search" }>Search content</BulkEditorTabPanel>
			<BulkEditorTabPanel tabId="social" isActive={ activeTab === "social" }>Social content</BulkEditorTabPanel>
		</>
	);
};

describe( "BulkEditorTabs", () => {
	it( "renders an accessible tab list with both tabs", () => {
		render( <BulkEditorTabs tabs={ tabs } activeTab="search" onChange={ noop } label="Bulk editor tabs" /> );

		expect( screen.getByRole( "tablist", { name: "Bulk editor tabs" } ) ).toBeInTheDocument();
		expect( screen.getAllByRole( "tab" ) ).toHaveLength( 2 );
	} );

	it( "marks the active tab selected and applies a roving tabindex", () => {
		render( <BulkEditorTabs tabs={ tabs } activeTab="social" onChange={ noop } label="Bulk editor tabs" /> );

		const search = screen.getByRole( "tab", { name: "Search appearance" } );
		const social = screen.getByRole( "tab", { name: "Social appearance" } );

		expect( social ).toHaveAttribute( "aria-selected", "true" );
		expect( social ).toHaveAttribute( "tabindex", "0" );
		expect( search ).toHaveAttribute( "aria-selected", "false" );
		expect( search ).toHaveAttribute( "tabindex", "-1" );
	} );

	it( "links each tab to its panel", () => {
		render( <TabsHarness /> );

		const search = screen.getByRole( "tab", { name: "Search appearance" } );
		expect( search ).toHaveAttribute( "aria-controls", getTabPanelId( "search" ) );

		const panel = screen.getByRole( "tabpanel" );
		expect( panel ).toHaveAttribute( "aria-labelledby", getTabId( "search" ) );
		expect( panel ).toHaveTextContent( "Search content" );
	} );

	it( "activates a tab on click and swaps the visible panel", () => {
		render( <TabsHarness /> );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tabpanel" ) ).toHaveTextContent( "Social content" );
	} );

	it( "moves selection and focus with the arrow keys, wrapping around", () => {
		render( <TabsHarness /> );
		const search = screen.getByRole( "tab", { name: "Search appearance" } );

		fireEvent.keyDown( search, { key: "ArrowRight" } );
		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveFocus();

		// Wraps from the last tab back to the first.
		fireEvent.keyDown( screen.getByRole( "tab", { name: "Social appearance" } ), { key: "ArrowRight" } );
		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
	} );

	it( "jumps to the first and last tab with Home and End", () => {
		render( <TabsHarness /> );

		fireEvent.keyDown( screen.getByRole( "tab", { name: "Search appearance" } ), { key: "End" } );
		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );

		fireEvent.keyDown( screen.getByRole( "tab", { name: "Social appearance" } ), { key: "Home" } );
		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
	} );

	it( "hides the inactive panel", () => {
		render( <TabsHarness /> );

		// Only the active panel is exposed; the inactive one is hidden.
		expect( screen.getAllByRole( "tabpanel" ) ).toHaveLength( 1 );
		expect( screen.getByText( "Social content" ) ).not.toBeVisible();
	} );
} );
