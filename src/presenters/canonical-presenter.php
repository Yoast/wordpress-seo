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
<<<<<<< HEAD
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 * @param bool                   $output_tag   Optional. Whether or not to output the HTML tag. Defaults to true.
	 *
	 * @return string The canonical tag.
	 */
	public function present( Indexable_Presentation $presentation, $output_tag = true ) {
		if ( \in_array( 'noindex', $presentation->robots, true ) ) {
=======
	 * @return string The canonical tag.
	 */
	public function present() {
		if ( \in_array( 'noindex', $this->presentation->robots, true ) ) {
>>>>>>> e2e9a4b81435c68471e9fd6075fb2ae7ffa3a8b1
			return '';
		}

		$canonical = $this->filter();
		if ( \is_string( $canonical ) && $canonical !== '' ) {
			if ( ! $output_tag ) {
				return $canonical;
			}
			return \sprintf( '<link rel="canonical" href="%s" />', \esc_url( $canonical, null, 'other' ) );
		}

		return '';
	}

	/**
	 * Run the canonical content through the `wpseo_canonical` filter.
	 *
	 * @return string $canonical The filtered canonical.
	 */
	private function filter() {
		/**
		 * Filter: 'wpseo_canonical' - Allow filtering of the canonical URL put out by Yoast SEO.
		 *
		 * @api string $canonical The canonical URL.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_canonical', $this->presentation->canonical, $this->presentation ) );
	}
}
