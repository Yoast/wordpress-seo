<?php
/**
 * Abstract presenter class for the canonical URL.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

abstract class Abstract_Canonical_Presenter implements Presenter_Interface {
	/**
	 * Returns the canonical for a URL.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The canonical tag.
	 */
	public function present( Indexable $indexable ) {
		$canonical = $this->filter( $this->generate( $indexable ) );

		if ( is_string( $canonical ) && '' !== $canonical ) {
			return '<link rel="canonical" href="' . esc_url( $canonical, null, 'other' ) . '" />' . "\n";
		}

		return '';
	}

	/**
	 * Run the canonical URL through the `wpseo_canonical` filter.
	 *
	 * @param string $canonical The canonical URL to filter.
	 *
	 * @return string The filtered canonical URL.
	 */
	private function filter( $canonical ) {
		/**
		 * Filter: 'wpseo_canonical' - Allow changing the canonical URL.
		 *
		 * @api string $canonical The canonical URL.
		 */
		return (string) trim( \apply_filters( 'wpseo_canonical', $canonical ) );
	}

	/**
	 * Generates the canonical URL for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The canonical URL.
	 */
	protected abstract function generate( Indexable $indexable );
}
