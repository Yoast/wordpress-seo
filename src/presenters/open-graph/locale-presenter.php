<?php
/**
 * Final presenter class for the Open Graph locale.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Site_Open_Graph_Locale_Presenter
 */
final class Locale_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the debug close marker.
	 *
	 * @return string The debug close marker.
	 */
	public function present() {
		$locale = $this->filter( $this->presentation->open_graph_locale );
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
		 * Filter: 'wpseo_og_locale' - Allow changing the Yoast SEO Open Graph locale.
		 *
		 * @api string The locale string
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_og_locale', $locale, $this->presentation ) );
	}
}
