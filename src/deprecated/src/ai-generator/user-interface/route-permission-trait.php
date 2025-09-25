<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\User_Interface;

/**
 * Trait for common permission checks in route classes.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
trait Route_Permission_Trait {

	/**
	 * Checks:
	 * - if the user is logged
	 * - if the user can edit posts
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the user is logged in, can edit posts and the feature is active.
	 */
	public function check_permissions(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Route_Permission_Trait::check_permissions' );

		return false;
	}
}
