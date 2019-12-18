<?php
/**
 * Presenter class for the OpenGraph type.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Type_Presenter
 */
class Type_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the opengraph type for a post.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The open graph type tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$og_type = $this->filter( $presentation->og_type, $presentation );

		if ( \is_string( $og_type ) && $og_type !== '' ) {
			return '<meta property="og:type" content="' . \esc_attr( $og_type ) . '"/>';
		}

		return '';
	}

	/**
	 * Run the opengraph type content through the `wpseo_opengraph_type` filter.
	 *
	 * @param string                 $type         The type to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string $type The filtered type.
	 */
	private function filter( $type, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_opengraph_type' - Allow changing the opengraph type.
		 *
		 * @api string $type The type.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_opengraph_type', $type, $presentation );
	}
}
