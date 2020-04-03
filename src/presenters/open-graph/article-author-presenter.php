<?php
/**
 * Presenter class for the Open Graph article author.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Author_Presenter
 */
class Article_Author_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the site article author tag.
	 *
	 * @return string The article author tag.
	 */
	public function present() {
		$article_author = $this->filter( $this->presentation->open_graph_article_author );

		if ( \is_string( $article_author ) && $article_author !== '' ) {
			return \sprintf( '<meta property="article:author" content="%s" />', \esc_attr( $article_author ) );
		}

		return '';
	}

	/**
	 * Run the article author's Facebook URL through the `wpseo_opengraph_author_facebook` filter.
	 *
	 * @param string $article_author The article author's Facebook URL to filter.
	 *
	 * @return string The filtered article author's Facebook URL.
	 */
	private function filter( $article_author ) {
		/**
		 * Filter: 'wpseo_opengraph_author_facebook' - Allow developers to filter the article author's Facebook URL.
		 *
		 * @api bool|string $article_author The article author's Facebook URL, return false to disable.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_opengraph_author_facebook', $article_author, $this->presentation ) );
	}
}
