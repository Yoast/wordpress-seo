<?php
/**
 * Final presenter class for the Open Graph locale.
 *
 * @package Yoast\YoastSEO\Presenters\Site
 */

namespace Yoast\WP\Free\Presenters\Site;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Site_Open_Graph_Locale_Presenter
 */
final class Open_Graph_Locale_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the debug close marker.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The debug close marker.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$locale = $this->filter( $presentation->og_locale );
		return '<meta property="og:locale" content="' . \esc_attr( $locale ) . '" />';
	}

	/**
	 * Run the locale through the `wpseo_og_locale` filter.
	 *
	 * @param string $locale The locale to filter.
	 *
	 * @return string $locale The filtered locale.
	 */
	private function filter( $locale ) {
		/**
		 * Filter: 'wpseo_og_locale' - Allow changing the Yoast SEO OpenGraph locale.
		 *
		 * @api string The locale string
		 */
		return (string) trim( \apply_filters( 'wpseo_og_locale', $locale ) );
	}
}
