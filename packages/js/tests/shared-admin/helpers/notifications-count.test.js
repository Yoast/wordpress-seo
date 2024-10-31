/* eslint-disable react/prop-types */
import { describe, expect, it } from "@jest/globals";
import { updateNotificationsCount } from "../../../src/shared-admin/helpers";
import { render } from "../../test-utils";

/**
 * Simplified version of the admin bar count. With incorrect singular/plural.
 * @param {number} total The total number of notifications.
 * @returns {JSX.Element} The admin menu count.
 */
const AdminMenuCountHtml = ( { total } ) => (
	<span className={ `update-plugins count-${ total }` }>
		<span className="plugin-count" aria-hidden="true">{ total }</span>
		<span className="screen-reader-text">{ total } notifications</span>
	</span>
);

/**
 * Creates a fake admin menu.
 * The content is a simplified copy of the admin menu structure from the WordPress admin.
 * But with only the Yoast SEO list item in the menu.
 * @param {number} total The total number of notifications.
 * @returns {JSX.Element} The element.
 */
const FakeAdminMenu = ( { total = 2 } ) => (
	<div id="adminmenuwrap">
		<ul id="adminmenu">
			<li id="toplevel_page_wpseo_dashboard">
				<a href="admin.php?page=wpseo_dashboard">
					<div className="wp-menu-name">
						Yoast SEO <AdminMenuCountHtml total={ total } />
					</div>
				</a>
				<ul className="wp-submenu wp-submenu-wrap">
					<li className="wp-submenu-head" aria-hidden="true">
						Yoast SEO <AdminMenuCountHtml total={ total } />
					</li>
				</ul>
			</li>
		</ul>
	</div>
);

/**
 * Simplified version of the admin bar count. With incorrect singular/plural.
 * @param {number} total The total number of notifications.
 * @returns {JSX.Element} The admin bar count.
 */
const AdminBarCountHtml = ( { total } ) => (
	<div className={ `wp-core-ui wp-ui-notification yoast-issue-counter${ total === 0 ? " wpseo-no-adminbar-notifications" : "" }` }>
		<span className="yoast-issues-count" aria-hidden="true">${ total }</span>
		<span className="screen-reader-text">${ total } notifications</span>
	</div>
);

/**
 * Creates a fake admin bar.
 * The content is a simplified copy of the admin bar structure from the WordPress admin.
 * But with only the Yoast SEO section in the first menu.
 * @param {number} total The total number of notifications.
 * @returns {JSX.Element} The element.
 */
const FakeAdminBar = ( { total = 2 } ) => (
	<div id="wpadminbar" className="no-js">
		<div className="quicklinks" id="wp-toolbar" role="navigation" aria-label="Toolbar">
			<ul role="menu" id="wp-admin-bar-root-default" className="ab-top-menu">
				<li role="group" id="wp-admin-bar-wpseo-menu" className="menupop">
					<a className="ab-item" role="menuitem" aria-expanded="false" href="/wp-admin/admin.php?page=wpseo_dashboard">
						<AdminBarCountHtml total={ total } />
					</a>
					<div className="ab-sub-wrapper">
						<ul role="menu" id="wp-admin-bar-wpseo-menu-default" className="ab-submenu">
							<li role="group" id="wp-admin-bar-wpseo-notifications">
								<a className="ab-item" role="menuitem" href="/wp-admin/admin.php?page=wpseo_dashboard">
									Notifications <AdminBarCountHtml total={ total } />
								</a>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
	</div>
);

describe( "updateNotificationsCount", () => {
	it( "does not throw an error when the elements are not there", () => {
		expect( updateNotificationsCount ).not.toThrow();
	} );

	it( "does not throw an error when the inner elements are not there", () => {
		render( <>
			<div id="toplevel_page_wpseo_dashboard">
				<div className="update-plugins" />
			</div>
			<div id="wp-admin-bar-wpseo-menu">
				<div className="yoast-issue-counter" />
			</div>
		</> );
		expect( updateNotificationsCount ).not.toThrow();
	} );

	test.each( [
		[ 3, "screen-reader plural in English" ],
		[ 1, "screen-reader singular in English" ],
		[ 0, "count-0 class triggering hidden css" ],
	] )( "updates the total in the admin menu to %i [%s]", ( total ) => {
		const { container } = render( <FakeAdminMenu /> );
		updateNotificationsCount( total );
		expect( container ).toMatchSnapshot();
	} );

	test.each( [
		[ 3, "screen-reader plural in English" ],
		[ 1, "screen-reader singular in English" ],
		[ 0, "wpseo-no-adminbar-notifications class triggering hidden css" ],
	] )( "updates the total in the admin bar to %i [%s]", ( total ) => {
		const { container } = render( <FakeAdminBar /> );
		updateNotificationsCount( total );
		expect( container ).toMatchSnapshot();
	} );
} );
