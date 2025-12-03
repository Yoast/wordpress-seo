import { AdjustmentsIcon } from "@heroicons/react/outline";
import { useEffect } from "@wordpress/element";
import { SidebarNavigation, useNavigationContext } from "@yoast/ui-library";
import { useLocation } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { MenuItemLink } from "../../shared-admin/components";

/**
 * The advanced menu component.
 *
 * @param {string} idSuffix Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The advanced menu element.
 */
export const AdvancedMenu = ( { idSuffix } ) => {
	const { pathname } = useLocation();
	const { history, addToHistory } = useNavigationContext();

	const advancedMenuItems = [
		{ to: "/llms-txt", label: __( "llms.txt", "wordpress-seo" ) },
		{ to: "/schema-framework", label: __( "Schema Framework", "wordpress-seo" ) },
		{ to: "/crawl-optimization", label: __( "Crawl optimization", "wordpress-seo" ) },
		{ to: "/breadcrumbs", label: __( "Breadcrumbs", "wordpress-seo" ) },
		{ to: "/author-archives", label: __( "Author archives", "wordpress-seo" ) },
		{ to: "/date-archives", label: __( "Date archives", "wordpress-seo" ) },
		{ to: "/format-archives", label: __( "Format archives", "wordpress-seo" ) },
		{ to: "/special-pages", label: __( "Special pages", "wordpress-seo" ) },
		{ to: "/media-pages", label: __( "Media pages", "wordpress-seo" ) },
		{ to: "/rss", label: __( "RSS", "wordpress-seo" ) },
	];

	useEffect( () => {
		if ( advancedMenuItems.map( item => item.to ).includes( pathname ) ) {
			addToHistory( `menu-advanced${ idSuffix }` );
		}
	}, [ pathname ] );

	return <SidebarNavigation.MenuItem
		id={ `menu-advanced${ idSuffix }` }
		icon={ AdjustmentsIcon }
		label={ __( "Advanced", "wordpress-seo" ) }
		defaultOpen={ history.includes( `menu-advanced${ idSuffix }` ) }
	>
		{
			advancedMenuItems.map( ( { to, label } ) => (
				<MenuItemLink
					key={ `link-advanced-${ to }` }
					to={ to }
					label={ label }
					idSuffix={ idSuffix }
				/>
			) )
		}
	</SidebarNavigation.MenuItem>;
};
