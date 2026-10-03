<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\WordPress;

use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;

/**
 * WordPress implementation of the site URL provider.
 */
class Site_URL_Provider implements Site_URL_Provider_Interface {

	/**
	 * Returns the site URL.
	 *
	 * @return string The site URL.
	 */
	public function get(): string {
		return \site_url();
	}
}
