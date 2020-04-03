<?php
/**
 * Presenter class for the Open Graph title.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the title for a post.
	 *
	 * @return string The title tag.
	 */
	public function present() {
		$title = $this->filter( $this->replace_vars( $this->presentation->open_graph_title ) );
		$title = $this->helpers->string->strip_all_tags( \stripslashes( $title ) );

		if ( \is_string( $title ) && $title !== '' ) {
			return '<meta property="og:title" content="' . \esc_attr( $title ) . '" />';
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_opengraph_title` filter.
	 *
	 * @param string $title The title to filter.
	 *
	 * @return string $title The filtered title.
	 */
	private function filter( $title ) {
		/**
		 * Filter: 'wpseo_opengraph_title' - Allow changing the Yoast SEO generated title.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 *
		 * @api string $title The title.
		 */
		return (string) \trim( \apply_filters( 'wpseo_opengraph_title', $title, $this->presentation ) );
	}
}
