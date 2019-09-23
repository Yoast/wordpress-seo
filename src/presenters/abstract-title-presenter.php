<?php
/**
 * Abstract presenter class for the title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

abstract class Abstract_Title_Presenter implements Presenter_Interface {
	/**
	 * Returns the title for a URL.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title tag.
	 */
	public function present( Indexable $indexable ) {
		$meta_description = $this->filter( $this->generate( $indexable ) );

		if ( is_string( $meta_description ) && $meta_description !== '' ) {
			return '<meta name="description" content="' . \esc_attr( \wp_strip_all_tags( \stripslashes( $meta_description ) ) ) . '"/>' . "\n";
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_metadesc` filter.
	 *
	 * @param string $meta_description The title to filter.
	 *
	 * @return string $meta_description The filtered title.
	 */
	private function filter( $meta_description ) {
		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO title sentence.
		 *
		 * @api string $meta_description The description sentence.
		 */
		return (string) trim( \apply_filters( 'wpseo_metadesc', $meta_description ) );
	}

	/**
	 * Generates the title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	protected abstract function generate( Indexable $indexable );
}
