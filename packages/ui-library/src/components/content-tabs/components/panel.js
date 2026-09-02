import classNames from "classnames";
import React from "react";
import { useContentTabsContext } from "../context";
import { Transition } from "@headlessui/react";

/**
 * The content area for one tab. Shows when `tabId` matches the active tab in `ContentTabs` context,
 * and fades in/out on transitions. Renders whatever `children` the caller passes — a freeform panel,
 * a table, a spec sheet, anything.
 *
 * Labelled by `tabId` via `aria-labelledby` so screen readers can announce it as a region owned by
 * that tab. Carries `aria-live="polite"` so screen readers announce the incoming content on tab
 * switch. Override via props if needed. Extra props are spread onto the underlying `Transition` wrapper.
 *
 * @param {React.ReactNode} children The panel's content.
 * @param {string} [tabId=""] The id of the tab this panel belongs to. Matched against `activeTab`
 *   in `ContentTabs` context to determine visibility.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the `Transition` wrapper.
 *
 * @returns {JSX.Element} The panel.
 */
export const Panel = ( { children, className = "", tabId = "", ...props } ) => {
	const { activeTab } = useContentTabsContext();

	return (
		<Transition
			as={ "div" }
			show={ activeTab === tabId }
			role="region"
			aria-labelledby={ tabId }
			aria-live="polite"
			className={ classNames( "yst-content-tabs__panel", className ) }
			enter="yst-transition-opacity yst-ease-out yst-duration-150"
			enterFrom="yst-opacity-0"
			enterTo="yst-opacity-100"
			leave="yst-transition-opacity yst-ease-in yst-duration-150"
			leaveFrom="yst-opacity-100"
			leaveTo="yst-opacity-0"
			{ ...props }
		>
			{ children }
		</Transition>
	);
};

Panel.displayName = "ContentTabs.Panel";
