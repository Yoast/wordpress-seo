import { useCallback, useRef } from "@wordpress/element";
import { Button } from "@yoast/ui-library";
import classNames from "classnames";

/**
 * One tab definition.
 *
 * @typedef {Object} BulkEditorTab
 * @property {string} id    The tab identifier (e.g. a field set id).
 * @property {string} label The visible tab label.
 */

/**
 * The DOM id for a tab button.
 *
 * @param {string} tabId The tab identifier.
 *
 * @returns {string} The DOM id.
 */
export const getTabId = ( tabId ) => `bulk-editor-tab-${ tabId }`;

/**
 * The DOM id for a tab panel.
 *
 * @param {string} tabId The tab identifier.
 *
 * @returns {string} The DOM id.
 */
export const getTabPanelId = ( tabId ) => `bulk-editor-tabpanel-${ tabId }`;

/**
 * Resolves which tab index a keyboard event should activate, following the APG tabs pattern
 *
 * @param {string}  key          The pressed key.
 * @param {number}  currentIndex The index of the currently active tab.
 * @param {number}  tabCount     The number of tabs.
 * @param {boolean} isRtl        Whether the tab list is rendered right-to-left.
 *
 * @returns {?number} The index to activate, or null when the key is not handled.
 */
const getNextTabIndex = ( key, currentIndex, tabCount, isRtl ) => {
	const next = ( currentIndex + 1 ) % tabCount;
	const previous = ( currentIndex - 1 + tabCount ) % tabCount;
	const targets = {
		ArrowRight: isRtl ? previous : next,
		ArrowLeft: isRtl ? next : previous,
		Home: 0,
		End: tabCount - 1,
	};

	return targets[ key ] ?? null;
};

/**
 * One tab button within the tab list.
 *
 * @param {Object}        props           The props.
 * @param {BulkEditorTab} props.tab       The tab definition.
 * @param {boolean}       props.isActive  Whether this tab is active.
 * @param {boolean}       props.disabled  Whether the tab is disabled.
 * @param {Function}      props.onChange  Called with the tab id when the tab is activated.
 * @param {Function}      props.onKeyDown The shared tablist keydown handler.
 *
 * @returns {JSX.Element} The tab button.
 */
const Tab = ( { tab, isActive, disabled = false, onChange, onKeyDown } ) => {
	const handleClick = useCallback( () => onChange( tab.id ), [ onChange, tab.id ] );

	return (
		<Button
			id={ getTabId( tab.id ) }
			role="tab"
			variant="tertiary"
			aria-selected={ isActive }
			aria-controls={ getTabPanelId( tab.id ) }
			tabIndex={ isActive ? 0 : -1 }
			disabled={ disabled }
			onClick={ handleClick }
			onKeyDown={ onKeyDown }
			className={ classNames(
				isActive ? "yst-bg-slate-100 yst-text-slate-800" : "yst-text-slate-600 hover:yst-bg-slate-100",
				"hover:yst-font-medium focus:yst-text-slate-800 hover:yst-text-slate-800 hover:yst-bg-slate-100 hover:yst-text-opacity-100 !yst-leading-[19px]"
			) }
		>
			{ tab.label }
		</Button>
	);
};

/**
 * The bulk editor tab list (Search appearance / Social appearance).
 *
 * Controlled and store-free.
 *
 * @param {Object}          props             The props.
 * @param {BulkEditorTab[]} props.tabs        The tabs, in display order.
 * @param {string}          props.activeTab   The id of the active tab.
 * @param {boolean}         props.disabled    Whether all tabs are disabled.
 * @param {Function}        props.onChange    Called with a tab id when a tab is activated.
 * @param {string}          props.label       The accessible name for the tab list.
 *
 * @returns {JSX.Element} The tab list.
 */
export const BulkEditorTabs = ( { tabs, activeTab, disabled = false, onChange, label } ) => {
	const listRef = useRef( null );

	const handleKeyDown = useCallback( ( event ) => {
		if ( disabled ) {
			return;
		}
		const currentIndex = tabs.findIndex( ( tab ) => tab.id === activeTab );
		const isRtl = listRef.current ? getComputedStyle( listRef.current ).direction === "rtl" : false;
		const nextIndex = getNextTabIndex( event.key, currentIndex, tabs.length, isRtl );

		if ( nextIndex === null ) {
			return;
		}
		event.preventDefault();
		const nextTab = tabs[ nextIndex ];
		onChange( nextTab.id );
		document.getElementById( getTabId( nextTab.id ) )?.focus();
	}, [ tabs, activeTab, onChange, disabled ] );

	return (
		<div ref={ listRef } role="tablist" aria-label={ label } className="yst-flex yst-gap-4">
			{ tabs.map( ( tab ) => (
				<Tab
					key={ tab.id }
					tab={ tab }
					isActive={ tab.id === activeTab }
					disabled={ disabled }
					onChange={ onChange }
					onKeyDown={ handleKeyDown }
				/>
			) ) }
		</div>
	);
};

/**
 * The panel a tab controls. Rendered (not unmounted) for every tab so panel ids stay stable; inactive panels
 * are hidden.
 *
 * @param {Object}    props          The props.
 * @param {string}    props.tabId    The id of the tab this panel belongs to.
 * @param {boolean}   props.isActive Whether this panel's tab is active.
 * @param {JSX.node}  props.children The panel content.
 *
 * @returns {JSX.Element} The tab panel.
 */
export const BulkEditorTabPanel = ( { tabId, isActive, children } ) => (
	<div
		id={ getTabPanelId( tabId ) }
		role="tabpanel"
		aria-labelledby={ getTabId( tabId ) }
		hidden={ ! isActive }
	>
		{ children }
	</div>
);
