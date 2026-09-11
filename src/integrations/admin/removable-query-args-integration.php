<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Registers Yoast's admin-only transient query args with WordPress core so
 * `wp_removable_query_args()` can strip them from the address bar after the
 * request that introduced them.
 */
class Removable_Query_Args_Integration implements Integration_Interface {

	/**
	 * The query args that should be stripped by core after the first request.
	 *
	 * @return string[]
	 */
	public static function get_removable_query_args(): array {
		return [
			'redirected_from_site_kit',
			'wpseo_tracked_action',
			'wpseo_tracking_nonce',
			'start-myyoast-connection',
			'_wpnonce',
			'install',
			'from_tools',
		];
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals(): array {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'removable_query_args', [ $this, 'add_removable_query_args' ] );
	}

	/**
	 * Adds the Yoast transient query args to the list stripped by core.
	 *
	 * @param array<string> $args The existing removable query args.
	 * @return array<string>
	 */
	public static function add_removable_query_args( array $args ): array {
		return \array_merge( $args, self::get_removable_query_args() );
	}
}
