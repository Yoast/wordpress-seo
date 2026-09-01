import classNames from "classnames";
import React from "react";
import { useContentTabsContext } from "./context";

/**
 * The content area a `ContentTabs.TabButton` selection drives. Fully agnostic about its content: renders
 * whatever `children` the caller passes — a freeform panel, a table, a spec sheet, anything.
 *
 * Automatically labelled by the active tab's id via `aria-labelledby`, so screen readers announce
 * it as a region owned by that tab. `activeTab` is only ever set through `ContentTabs`'s context
 * (or omitted entirely for standalone usage), so this label always points at a real, rendered tab
 * — never a stale or missing one. Override `aria-labelledby` (or `role`) via props if needed.
 *
 * @param {React.ReactNode} children The panel's content.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The panel.
 */
const Panel = ( { children, className = "", ...props } ) => {
	const { activeTab } = useContentTabsContext();

	return (
		<div
			role="region"
			aria-labelledby={ activeTab }
			className={ classNames( "yst-content-tabs__panel", className ) }
			{ ...props }
		>
			{ children }
		</div>
	);
};

Panel.displayName = "ContentTabs.Panel";

export default Panel;
