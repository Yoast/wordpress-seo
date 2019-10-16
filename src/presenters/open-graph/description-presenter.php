<?php
/**
 * Presenter class for the OpenGraph description.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Description_Presenter
 */
class Description_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the OpenGraph description.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The OpenGraph description's meta tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$description = $this->filter( $this->replace_vars( $presentation->og_description, $presentation ) );

		if ( is_string( $description ) && $description !== '' ) {
			return sprintf( '<meta property="og:description" content="%s" />', \esc_attr( $description ) );
		}

		return '';
	}

	/**
	 * Run the OpenGraph description through the `wpseo_opengraph_desc` filter.
	 *
	 * @param string $description The description to filter.
	 *
	 * @return string $description The filtered description.
	 */
	private function filter( $description ) {
		/**
		 * Filter: 'wpseo_opengraph_desc' - Allow changing the Yoast SEO generated OpenGraph description.
		 *
		 * @api string The description.
		 */
		return trim( \apply_filters( 'wpseo_opengraph_desc', $description ) );
	}
}
