<?php
/**
 * Presenter class for the OpenGraph article author.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Author_Presenter
 */
class Article_Author_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the site article author tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The article author tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$article_author = $this->filter( $presentation->og_article_author );

		if ( is_string( $article_author ) && $article_author !== '' ) {
			return sprintf( '<meta property="article:author" content="%s" />', \esc_attr( $article_author ) );
		}

		return '';
	}

	/**
	 * Run the author through the `wpseo_opengraph_author_facebook` filter.
	 *
	 * @param string $article_author The article author to filter.
	 *
	 * @return string The filtered article author.
	 */
	private function filter( $article_author ) {
		/**
		 * Filter: 'wpseo_opengraph_author_facebook' - Allow developers to filter the Yoast SEO post authors facebook profile URL.
		 *
		 * @api bool|string $article_author The Facebook author URL, return false to disable.
		 */
		return trim( \apply_filters( 'wpseo_opengraph_author_facebook', $article_author ) );
	}
}
