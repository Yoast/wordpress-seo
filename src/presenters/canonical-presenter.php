<?php
/**
 * Presenter class for the canonical.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Abstract_Meta_Description_Presenter
 */
class Canonical_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the canonical for a post.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The canonical tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		if ( \in_array( 'noindex', $presentation->robots, true ) ) {
			return '';
		}

		$canonical = $this->filter( $presentation->canonical, $presentation );
		if ( \is_string( $canonical ) && $canonical !== '' ) {
			return \sprintf( '<link rel="canonical" href="%s" />', \esc_url( $canonical, null, 'other' ) );
		}

		return '';
	}

	/**
	 * Run the canonical content through the `wpseo_canonical` filter.
	 *
	 * @param string                 $canonical    The canonical to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string $canonical The filtered canonical.
	 */
	private function filter( $canonical, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_canonical' - Allow filtering of the canonical URL put out by Yoast SEO.
		 *
		 * @api string $canonical The canonical URL.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_canonical', $canonical, $presentation ) );
	}
}
