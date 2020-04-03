<?php
/**
 * Presenter class for the rel next meta tag.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Rel_Next_Presenter
 */
class Rel_Next_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the rel prev meta tag.
	 *
	 * @return string The rel next tag.
	 */
	public function present() {
		if ( \in_array( 'noindex', $this->presentation->robots, true ) ) {
			return '';
		}

		$rel_next = $this->filter();

		if ( \is_string( $rel_next ) && $rel_next !== '' ) {
			$link = \sprintf( '<link rel="next" href="%s" />', \esc_url( $rel_next ) );

			/**
			 * Filter: 'wpseo_next_rel_link' - Allow changing link rel output by Yoast SEO.
			 *
			 * @api string $unsigned The full `<link` element.
			 */
			return \apply_filters( 'wpseo_next_rel_link', $link );
		}

		return '';
	}

	/**
	 * Run the canonical content through the `wpseo_adjacent_rel_url` filter.
	 *
	 * @return string $rel_next The filtered adjacent link.
	 */
	private function filter() {
		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow filtering of the rel next URL put out by Yoast SEO.
		 *
		 * @api string $rel_next The rel next URL.
		 *
		 * @param string                 $rel          Link relationship, prev or next.
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_adjacent_rel_url', $this->presentation->rel_next, 'next', $this->presentation ) );
	}
}
