<?php
/**
 * Presenter class for the Open Graph site name.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Site_Name_Presenter
 */
class Site_Name_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the site name.
	 *
	 * @return string The title tag.
	 */
	public function present() {
		$site_name = $this->filter( $this->presentation->open_graph_site_name );

		if ( \is_string( $site_name ) && $site_name !== '' ) {
			return \sprintf( '<meta property="og:site_name" content="%s" />', \esc_attr( $site_name ) );
		}

		return '';
	}

	/**
	 * Runs the site name through the `wpseo_opengraph_site_name` filter.
	 *
	 * @param string $site_name The site_name to filter.
	 *
	 * @return string $site_name The filtered site_name.
	 */
	private function filter( $site_name ) {
		/**
		 * Filter: 'wpseo_opengraph_site_name' - Allow changing the Yoast SEO generated Open Graph site name.
		 *
		 * @api string $site_name The site_name.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_opengraph_site_name', $site_name, $this->presentation ) );
	}
}
