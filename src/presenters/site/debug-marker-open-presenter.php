<?php
/**
 * Final presenter class for the Open Graph locale.
 *
 * @package Yoast\YoastSEO\Presenters\Site
 */

namespace Yoast\WP\Free\Presenters\Site;

use Yoast\WP\Free\Helpers\Product_Name;

/**
 * Class Debug_Marker_Open_Presenter
 */
final class Debug_Marker_Open_Presenter implements Site_Presenter_Interface {
	/**
	 * Returns the Open Graph locale for the site.
	 *
	 * @return string The og:locale tag.
	 */
	public function present() {
		$marker = $this->generate();
		return $marker;
	}

	/**
	 * Retrieves the locale for the site.
	 *
	 * @return string The og:locale.
	 */
	public function generate() {
		return sprintf(
			'<!-- This site is optimized with the %1$s %2$s - https://yoast.com/wordpress/plugins/seo/ -->',
			\esc_html( Product_Name::get() ),
			/**
			 * Filter: 'wpseo_hide_version' - can be used to hide the Yoast SEO version in the debug marker (only available in Yoast SEO Premium).
			 *
			 * @api bool
			 */
			( ( \apply_filters( 'wpseo_hide_version', false ) && \WPSEO_Utils::is_yoast_seo_premium() ) ? '' : 'v' . \WPSEO_VERSION )
		);
	}

}
