<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Current_Site_URL_Provider_Interface;

/**
 * WordPress implementation of site info provider.
 */
class WordPress_Current_Site_URL_Provider implements Current_Site_URL_Provider_Interface {

	/**
	 * Gets the current site's home URL with trailing slash.
	 *
	 * @return string The current site's home URL.
	 */
	public function get_current_site_url(): string {
		$blog_id = $this->get_current_blog_id();
		return $this->get_home_url( $blog_id );
	}

	/**
	 * Gets the current blog ID.
	 *
	 * @return int The blog ID.
	 */
	private function get_current_blog_id(): int {
		return \get_current_blog_id();
	}

	/**
	 * Gets the home URL for the given blog ID.
	 *
	 * @param int|null $blog_id The blog ID. If null, uses the current blog.
	 *
	 * @return string The home URL with trailing slash.
	 */
	private function get_home_url( ?int $blog_id = null ): string {
		return \trailingslashit( \get_home_url( $blog_id ) );
	}
}
