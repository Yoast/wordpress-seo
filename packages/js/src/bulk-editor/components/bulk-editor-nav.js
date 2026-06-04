import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, ChildrenLimiter, SidebarNavigation } from "@yoast/ui-library";
import classNames from "classnames";
import { BackToToolsLink } from "./back-to-tools-link";

/**
 * One content type entry.
 *
 * @typedef {Object} BulkEditorContentType
 * @property {string} id    The content type identifier (e.g. the post type name).
 * @property {string} label The visible label (e.g. "Pages").
 */

/**
 * One content type item. A button (not a link): selecting a content type changes view state, it does not
 * navigate. The active state and `aria-current` come from the SidebarNavigation context by matching the
 * item's `value` against the `activePath`.
 *
 * @param {Object}                props             The props.
 * @param {BulkEditorContentType} props.contentType The content type.
 * @param {Function}              props.onChange    Called with the content type id when selected.
 *
 * @returns {JSX.Element} The item.
 */
const ContentTypeItem = ( { contentType, onChange } ) => {
	const handleClick = useCallback( () => onChange( contentType.id ), [ onChange, contentType.id ] );

	return (
		<SidebarNavigation.SubmenuItem
			as="button"
			type="button"
			pathProp="value"
			value={ contentType.id }
			label={ contentType.label }
			onClick={ handleClick }
			className="yst-w-full"
		/>
	);
};

/**
 * The left sub-navigation of the bulk editor: a "Back to Tools" link and the content type list, limited to
 * `visibleLimit` items with a "Show N more" toggle.
 *
 * Controlled and store-free: the active content type and the change handler are props, so Free-FE 1 can wire
 * them to the view-state store and localized data.
 *
 * @param {Object}                  props                  The props.
 * @param {BulkEditorContentType[]} props.contentTypes     The content types, in display order.
 * @param {string}                  props.activeContentType The id of the active content type.
 * @param {Function}                props.onChange         Called with a content type id when one is selected.
 * @param {string}                  props.backToToolsUrl   The URL of the Tools page.
 * @param {number}                  [props.visibleLimit]   How many content types to show before "Show N more".
 *
 * @returns {JSX.Element} The sub-navigation.
 */
export const BulkEditorNav = ( { contentTypes, activeContentType, onChange, backToToolsUrl, visibleLimit = 5 } ) => {
	const hiddenCount = contentTypes.length - visibleLimit;

	const renderShowMoreButton = useCallback( ( { show, toggle, ariaProps } ) => {
		/* translators: %d expands to the number of additional content types. */
		const showMoreLabel = sprintf( __( "Show %d more", "wordpress-seo" ), hiddenCount );

		// Per the design: a rounded pill with a thin divider line on each side.
		return (
			<div className="yst-flex yst-items-center yst-gap-2 yst-mt-2">
				<span className="yst-grow yst-border-t yst-border-slate-200" aria-hidden="true" />
				<Button variant="secondary" size="small" className="yst-rounded-full" onClick={ toggle } { ...ariaProps }>
					{ show ? __( "Show less", "wordpress-seo" ) : showMoreLabel }
					<ChevronDownIcon className={ classNames( "yst-w-4 yst-h-4 yst-ms-1", show && "yst-rotate-180" ) } aria-hidden="true" />
				</Button>
				<span className="yst-grow yst-border-t yst-border-slate-200" aria-hidden="true" />
			</div>
		);
	}, [ hiddenCount ] );

	return (
		<SidebarNavigation activePath={ activeContentType }>
			<SidebarNavigation.Sidebar aria-label={ __( "Bulk editor menu", "wordpress-seo" ) } className="yst-space-y-6">
				<BackToToolsLink href={ backToToolsUrl } />
				<SidebarNavigation.MenuItem id="bulk-editor-nav-content-types" label={ __( "Bulk editor", "wordpress-seo" ) }>
					<ChildrenLimiter limit={ visibleLimit } id="bulk-editor-nav-more" renderButton={ renderShowMoreButton }>
						{ contentTypes.map( ( contentType ) => (
							<ContentTypeItem key={ contentType.id } contentType={ contentType } onChange={ onChange } />
						) ) }
					</ChildrenLimiter>
				</SidebarNavigation.MenuItem>
			</SidebarNavigation.Sidebar>
		</SidebarNavigation>
	);
};
