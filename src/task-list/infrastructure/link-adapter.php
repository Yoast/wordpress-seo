<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Task_List\Infrastructure;

/**
 * The adapter of links.
 */
class Link_Adapter {

	/**
	 * Gets the enhanced URL.
	 *
	 * @param string|null $url The URL to enhance.
	 *
	 * @return string The enhanced URL.
	 */
	public function enhance_link( ?string $url ): ?string {
		if ( $url === null ) {
			return null;
		}

		return \add_query_arg(
			[
				'wpseo_tracked_option' => 'task_first_actioned_on',
				'_wpnonce'             => \wp_create_nonce( 'wpseo_tracking_nonce' ),
			],
			$url
		);
	}
}
