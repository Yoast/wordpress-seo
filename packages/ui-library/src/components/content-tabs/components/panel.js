import classNames from "classnames";
import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { PanelSlotContext, useContentTabsContext } from "../context";

/**
 * The content area for one tab. Renders only when `tabId` matches the active tab in `ContentTabs`
 * context, and returns `null` otherwise. Renders whatever `children` the caller passes — a freeform
 * panel, a table, a spec sheet, anything.
 *
 * Labelled by `tabId` via `aria-labelledby` so screen readers can announce it as a region owned by
 * that tab. Carries `aria-live="polite"` so screen readers announce the incoming content on tab
 * switch. Override via props if needed.
 *
 * In an accordion layout, it renders right below its tab button and only while that tab is open:
 * a collapsed panel unmounts, or stays mounted but hidden with `keepMounted` set to true.
 *
 * @param {React.ReactNode} children The panel's content.
 * @param {string} [tabId=""] The id of the tab this panel belongs to. Matched against `activeTab`
 *   in `ContentTabs` context to determine visibility.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element|null} The panel, or null when inactive (or collapsed, unless kept mounted).
 */
export const Panel = ( { children, className = "", tabId = "", ...props } ) => {
	const { activeTab, isAccordion, isExpanded, keepMounted } = useContentTabsContext();
	const panelSlot = useContext( PanelSlotContext );

	if ( activeTab !== tabId ) {
		return null;
	}

	const panel = (
		<div
			role="region"
			aria-labelledby={ tabId }
			aria-live="polite"
			className={ classNames( "yst-content-tabs__panel", className ) }
			{ ...props }
		>
			{ children }
		</div>
	);

	if ( ! isAccordion ) {
		return panel;
	}
	if ( panelSlot?.tabId !== tabId || ( ! isExpanded && ! keepMounted ) ) {
		return null;
	}
	return createPortal( panel, panelSlot.element );
};

Panel.displayName = "ContentTabs.Panel";
