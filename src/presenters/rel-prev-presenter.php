<?php
/**
 * Presenter class for the rel prev meta tag.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

/**
 * Class Rel_Prev_Presenter
 */
class Rel_Prev_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the rel prev meta tag.
	 *
	 * @return string The rel prev tag.
	 */
	public function present() {
		if ( \in_array( 'noindex', $this->presentation->robots, true ) ) {
			return '';
		}

		$rel_prev = $this->filter();

		if ( \is_string( $rel_prev ) && $rel_prev !== '' ) {
			$link = \sprintf( '<link rel="prev" href="%s" />', \esc_url( $rel_prev ) );

			/**
			 * Filter: 'wpseo_prev_rel_link' - Allow changing link rel output by Yoast SEO.
			 *
			 * @api string $unsigned The full `<link` element.
			 */
			return \apply_filters( 'wpseo_prev_rel_link', $link );
		}

		return '';
	}

	/**
	 * Run the rel prev content through the `wpseo_adjacent_rel_url` filter.
	 *
	 * @return string $rel_prev The filtered adjacent link.
	 */
	private function filter() {
		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow filtering of the rel prev URL put out by Yoast SEO.
		 *
		 * @api string $canonical The rel prev URL.
		 *
		 * @param string                 $rel          Link relationship, prev or next.
		 */
		return (string) \trim( \apply_filters( 'wpseo_adjacent_rel_url', $this->presentation->rel_prev, 'prev', $this->presentation ) );
	}
}
