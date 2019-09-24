<?php
/**
 * A helper object to retrieve the product name.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Current_Post_Helper
 */
class Product_Name {
	/**
	 * Get the product name in the head section.
	 *
	 * @return string
	 */
	public static function get() {
		if ( \WPSEO_Utils::is_yoast_seo_premium() ) {
			return 'Yoast SEO Premium plugin';
		}

		return 'Yoast SEO plugin';
	}
}