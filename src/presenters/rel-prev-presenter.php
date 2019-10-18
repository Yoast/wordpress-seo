<?php
/**
 * Presenter class for the rel prev meta tag.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Rel_Prev_Presenter
 */
class Rel_Prev_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the rel prev meta tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The rel prev tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		if ( \in_array( 'noindex', $presentation->robots, true ) ) {
			return '';
		}

		$rel_prev = $this->filter( $presentation->rel_prev );
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
	 * @param string $rel_prev The adjacent link to filter.
	 *
	 * @return string $rel_prev The filtered adjacent link.
	 */
	private function filter( $rel_prev ) {
		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow filtering of the rel prev URL put out by Yoast SEO.
		 *
		 * @api string $canonical The rel prev URL.
		 *
		 * @param string $rel Link relationship, prev or next.
		 */
		return (string) trim( \apply_filters( 'wpseo_adjacent_rel_url', $rel_prev, 'prev' ) );
	}
}
