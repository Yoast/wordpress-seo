<?php
/**
 * Presenter class for the Open Graph URL.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Url_Presenter
 */
class Url_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the open graph url.
	 *
	 * @return string The open graph URL tag.
	 */
	public function present() {
		$open_graph_url = $this->filter( $this->presentation->open_graph_url );

		if ( \is_string( $open_graph_url ) && $open_graph_url !== '' ) {
			return '<meta property="og:url" content="' . \esc_url( $open_graph_url ) . '" />';
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_opengraph_url` filter.
	 *
	 * @param string $open_graph_url The open graph URL to filter.
	 *
	 * @return string $title The filtered title.
	 */
	private function filter( $open_graph_url ) {
		/**
		 * Filter: 'wpseo_opengraph_url' - Allow changing the Yoast SEO generated open graph URL.
		 *
		 * @api string $title The open graph URL.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_opengraph_url', $open_graph_url, $this->presentation );
	}
}
