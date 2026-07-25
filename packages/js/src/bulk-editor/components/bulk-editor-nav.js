import DuplicateIcon from "@heroicons/react/outline/DuplicateIcon";
import { useCallback } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Link, SidebarNavigation, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { noop } from "lodash";
import { YoastLogo } from "../../shared-admin/components";
import { BackToToolsLink } from "./back-to-tools-link";

/**
 * One content type entry.
 *
 * @typedef {Object} BulkEditorContentType
 * @property {string} id    The content type identifier (e.g. the post type name).
 * @property {string} label The visible label (e.g. "Pages").
 */

/**
 * One content type item. Selecting a content type changes view state, it does not navigate.
 * The active state comes from the SidebarNavigation context.
 *
 * @param {Object}                props             The props.
 * @param {BulkEditorContentType} props.contentType The content type.
 * @param {boolean}               props.disabled    Whether the item is disabled.
 * @param {Function}              props.onChange    Called with the content type id when selected.
 *
 * @returns {JSX.Element} The item.
 */
const ContentTypeItem = ( { contentType, disabled, onChange } ) => {
	const handleClick = useCallback( () => onChange( contentType.id ), [ onChange, contentType.id ] );

	return (
		<SidebarNavigation.SubmenuItem
			as="button"
			type="button"
			pathProp="value"
			value={ contentType.id }
			label={ contentType.label }
			disabled={ disabled }
			onClick={ handleClick }
			className={ classNames( "yst-w-full", { "yst-opacity-50": disabled } ) }
		/>
	);
};

/**
 * The Yoast logo link at the top of the menu. Its click routes through onNavigate so the hard page navigation to
 * the dashboard can be guarded when there are unsaved edits.
 *
 * @param {Object}   props              The props.
 * @param {string}   props.logoHref     Where the logo links to.
 * @param {boolean}  props.isPremium    Whether Premium is active (affects the accessible label).
 * @param {string}   props.idSuffix     Suffix appended to the element id to avoid duplicates.
 * @param {boolean}  [props.disabled]   Whether the logo link is disabled (e.g. during AI generation).
 * @param {Function} props.onNavigate   Called with (event, href) when the logo is clicked, to guard the navigation.
 *
 * @returns {JSX.Element} The logo link.
 */
const NavLogo = ( { logoHref, isPremium, idSuffix, disabled, onNavigate } ) => {
	const svgAriaProps = useSvgAria();
	const handleClick = useCallback( ( event ) => {
		if ( disabled ) {
			event.preventDefault();
			return;
		}
		onNavigate( event, logoHref );
	}, [ disabled, onNavigate, logoHref ] );

	return (
		<Link
			id={ `link-bulk-editor-logo${ idSuffix }` }
			href={ logoHref }
			onClick={ handleClick }
			aria-disabled={ disabled }
			className={ classNames( "yst-inline-block yst-rounded-md focus:yst-ring-primary-500", { "yst-opacity-50 yst-cursor-not-allowed": disabled } ) }
			aria-label={ isPremium ? "Yoast SEO Premium" : "Yoast SEO" }
		>
			<YoastLogo className="yst-w-40" { ...svgAriaProps } />
		</Link>
	);
};

/**
 * The bulk editor menu content: the Yoast logo, a "Back to Tools" link and the content type list,
 * limited to `visibleLimit` items with a "Show N more" toggle.
 *
 * @param {Object}                  props                The props.
 * @param {BulkEditorContentType[]} props.contentTypes   The content types, in display order.
 * @param {Function}                props.onChange       Called with a content type id when one is selected.
 * @param {string}                  props.backToToolsUrl The URL of the Tools page.
 * @param {boolean}                 [props.disabled]     Whether navigation links and content type items are disabled.
 * @param {Function}                [props.onNavigate=noop]   Called with (event, href) when a hard-navigation link (logo,
 *                                                       Back to Tools) is clicked, to guard the navigation.
 * @param {string}                  [props.logoHref]     Where the Yoast SEO logo links to.
 * @param {boolean}                 [props.isPremium]    Whether Premium is active (affects the logo label).
 * @param {number}                  [props.visibleLimit] How many content types to show before "Show N more".
 * @param {string}                  [props.idSuffix]     Suffix appended to element ids to avoid duplicates.
 *
 * @returns {JSX.Element} The menu content.
 */
export const BulkEditorNavMenu = ( {
	contentTypes,
	onChange,
	backToToolsUrl,
	disabled,
	onNavigate = noop,
	logoHref = "/wp-admin/",
	isPremium = false,
	visibleLimit = 5,
	idSuffix = "",
} ) => {
	const hiddenCount = contentTypes.length - visibleLimit;

	const showMoreLabel = sprintf(
		/* translators: %d expands to the number of additional content types. */
		_n( "Show %d more", "Show %d more", hiddenCount, "wordpress-seo" ),
		hiddenCount
	);

	return (
		<div className="yst-space-y-6">
			<NavLogo logoHref={ logoHref } isPremium={ isPremium } idSuffix={ idSuffix } disabled={ disabled } onNavigate={ onNavigate } />
			<BackToToolsLink href={ backToToolsUrl } disabled={ disabled } onNavigate={ onNavigate } />
			<SidebarNavigation.MenuItemWithLimiter
				id={ `bulk-editor-nav-content-types${ idSuffix }` }
				label={ __( "Bulk editor", "wordpress-seo" ) }
				icon={ DuplicateIcon }
				defaultOpen={ true }
				limit={ visibleLimit }
				buttonId={ `bulk-editor-nav-more${ idSuffix }` }
				showMoreLabel={ showMoreLabel }
				showLessLabel={ __( "Show less", "wordpress-seo" ) }
			>
				{ contentTypes.map( ( contentType ) => (
					<ContentTypeItem key={ contentType.id } contentType={ contentType } disabled={ disabled } onChange={ onChange } />
				) ) }
			</SidebarNavigation.MenuItemWithLimiter>
		</div>
	);
};
