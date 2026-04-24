<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

/**
 * Port for retrieving the site URL.
 */
interface Site_URL_Provider_Interface {

	/**
	 * Returns the site URL.
	 *
	 * @return string The site URL.
	 */
	public function get(): string;
}
