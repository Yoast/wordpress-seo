<?php
/**
 * Presenter class for the OpenGraph URL.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Url_Presenter
 */
class Url_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the open graph url.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The open graph URL tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$og_url = $this->filter( $presentation->og_url );

		if ( is_string( $og_url ) && $og_url !== '' ) {
			return '<meta property="og:url" content="' . \esc_url( $og_url ) . '"/>';
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_opengraph_url` filter.
	 *
	 * @param string $og_url The open graph URL to filter.
	 *
	 * @return string $title The filtered title.
	 */
	private function filter( $og_url ) {
		/**
		 * Filter: 'wpseo_opengraph_url' - Allow changing the Yoast SEO generated open graph URL.
		 *
		 * @api string $title The open graph URL.
		 */
		return (string) \apply_filters( 'wpseo_opengraph_url', $og_url );
	}
}
