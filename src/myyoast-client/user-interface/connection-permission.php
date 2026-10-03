<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

/**
 * Single source of truth for the HTTP-boundary check that gates managing the
 * site's MyYoast connection.
 *
 * Deliberately a user-interface concern, not an application one: the WP-CLI
 * entry point (`wp yoast auth`) is trusted by virtue of shell access and runs
 * with no logged-in user, so the capability check must live at the HTTP
 * boundary and never leak into `MyYoast_Client` or the application layer.
 * Pushing it down would break CLI usage or force a `--user=` flag on every
 * command.
 */
class Connection_Permission {

	/**
	 * The capability required to manage the MyYoast connection over HTTP.
	 *
	 * @var string
	 */
	private const MANAGE_CAPABILITY = 'wpseo_manage_options';

	/**
	 * Whether the current HTTP user may manage the MyYoast connection.
	 *
	 * @return bool
	 */
	public function can_manage(): bool {
		return \current_user_can( self::MANAGE_CAPABILITY );
	}
}
