<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Current_Site_URL_Provider_Interface;

/**
 * WordPress implementation of current site URL provider.
 */
class WordPress_Current_Site_URL_Provider implements Current_Site_URL_Provider_Interface {

	/**
	 * Gets the current site's home URL with trailing slash.
	 *
	 * @return string The current site's home URL.
	 */
	public function get_current_site_url(): string {
		$blog_id = \get_current_blog_id();
		return \trailingslashit( \get_home_url( $blog_id ) );
	}
}
