<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Interface for providing current site URL.
 */
interface Current_Site_URL_Provider_Interface {

	/**
	 * Gets the current site's home URL with trailing slash.
	 *
	 * @return string The current site's home URL.
	 */
	public function get_current_site_url(): string;
}
