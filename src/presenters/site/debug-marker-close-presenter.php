<?php
/**
 * Final presenter class for the Open Graph locale.
 *
 * @package Yoast\YoastSEO\Presenters\Site
 */

namespace Yoast\WP\Free\Presenters\Site;

use Yoast\WP\Free\Helpers\Product_Name;

/**
 * Class Debug_Marker_Close_Presenter
 */
final class Debug_Marker_Close_Presenter implements Site_Presenter_Interface {
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
			"<!-- / %s. -->\n\n",
			\esc_html( Product_Name::get() )
		);
	}

}
