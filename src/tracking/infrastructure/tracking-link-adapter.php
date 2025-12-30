<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Tracking\Infrastructure;

/**
 * The adapter of tracking links.
 */
class Tracking_Link_Adapter {

	/**
	 * Creates the tracking link for tasks.
	 *
	 * @param string|null $url The URL to enhance.
	 *
	 * @return string The enhanced URL.
	 */
	public function create_tracking_link_for_tasks( ?string $url ): ?string {
		if ( $url === null ) {
			return null;
		}

		return \add_query_arg(
			[
				'wpseo_tracked_action' => 'task_first_actioned_on',
				'wpseo_tracking_nonce' => \wp_create_nonce( 'wpseo_tracking_nonce' ),
			],
			$url
		);
	}
}
