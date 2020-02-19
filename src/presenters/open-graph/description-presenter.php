<?php
/**
 * Presenter class for the Open Graph description.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Description_Presenter
 */
class Description_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the Open Graph description.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The Open Graph description's meta tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$description = $this->filter( $this->replace_vars( $presentation->open_graph_description, $presentation ), $presentation );

		if ( \is_string( $description ) && $description !== '' ) {
			return \sprintf( '<meta property="og:description" content="%s" />', \esc_attr( $description ) );
		}

		return '';
	}

	/**
	 * Run the Open Graph description through the `wpseo_opengraph_desc` filter.
	 *
	 * @param string                 $description  The description to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string $description The filtered description.
	 */
	private function filter( $description, $presentation ) {
		/**
		 * Filter: 'wpseo_opengraph_desc' - Allow changing the Yoast SEO generated Open Graph description.
		 *
		 * @api string The description.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_opengraph_desc', $description, $presentation ) );
	}
}
