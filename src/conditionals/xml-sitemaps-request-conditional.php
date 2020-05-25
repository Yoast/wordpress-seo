<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when in the admin.
 */
class XML_Sitemaps_Request_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		$sitemap = get_query_var( 'sitemap' );
		return ! empty( $sitemap );
	}
}
