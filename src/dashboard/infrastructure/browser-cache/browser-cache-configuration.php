<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache;

/**
 * Responsible for the browser cache configuration.
 */
class Browser_Cache_Configuration {

	/**
	 * Gets the Time To Live for each widget's cache.
	 *
	 * @return array<string, array<string, int>> The cache TTL for each widget.
	 */
	private function get_widgets_cache_ttl() {
		return [
			'topPages' => [
				'ttl'  => ( 1 * \MINUTE_IN_SECONDS ),
			],
			'topQueries' => [
				'ttl'  => ( 1 * \HOUR_IN_SECONDS ),
			],
			'searchRankingCompare' => [
				'ttl'  => ( 1 * \HOUR_IN_SECONDS ),
			],
			'organicSessions' => [
				'ttl'  => ( 1 * \HOUR_IN_SECONDS ),
			],
		];
	}

	/**
	 * Gets the prefix for the client side cache key.
	 *
	 * Cache key is scoped to user session and blog_id to isolate the
	 * cache between users and sites (in multisite).
	 *
	 * @return string
	 */
	private function get_storage_prefix() {
		$current_user  = \wp_get_current_user();
		$auth_cookie   = \wp_parse_auth_cookie();
		$blog_id       = \get_current_blog_id();
		$session_token = isset( $auth_cookie['token'] ) ? $auth_cookie['token'] : '';

		return \wp_hash( $current_user->user_login . '|' . $session_token . '|' . $blog_id );
	}

	/**
	 * Returns the browser cache configuration.
	 *
	 * @return array<string, string|array<string, array<string, int>>>
	 */
	public function get_configuration(): array {
		return [
			'storagePrefix'   => $this->get_storage_prefix(),
			'yoastVersion'    => \WPSEO_VERSION,
			'widgetsCacheTtl' => $this->get_widgets_cache_ttl(),
		];
	}
}
