<?php
/**
 * Presenter class for the rel next meta tag.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Rel_Next_Presenter
 */
class Rel_Next_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the rel prev meta tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The rel next tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		if ( \in_array( 'noindex', $presentation->robots, true ) ) {
			return '';
		}

		$rel_next = $this->filter( $presentation->rel_next );

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
	 * @param string $rel_next The adjacent link to filter.
	 *
	 * @return string $rel_next The filtered adjacent link.
	 */
	private function filter( $rel_next ) {
		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow filtering of the rel next URL put out by Yoast SEO.
		 *
		 * @api string $rel_next The rel next URL.
		 *
		 * @param string $rel Link relationship, prev or next.
		 */
		return (string) trim( \apply_filters( 'wpseo_adjacent_rel_url', $rel_next, 'next' ) );
	}
}
