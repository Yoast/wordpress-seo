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
		$article_author = $this->filter( $presentation->og_article_author, $presentation );

		if ( \is_string( $article_author ) && $article_author !== '' ) {
			return \sprintf( '<meta property="article:author" content="%s" />', \esc_attr( $article_author ) );
		}

		return '';
	}

	/**
	 * Run the article author's Facebook URL through the `wpseo_opengraph_author_facebook` filter.
	 *
	 * @param string                 $article_author The article author's Facebook URL to filter.
	 * @param Indexable_Presentation $presentation   The presentation of an indexable.
	 *
	 * @return string The filtered article author's Facebook URL.
	 */
	private function filter( $article_author, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_opengraph_author_facebook' - Allow developers to filter the article author's Facebook URL.
		 *
		 * @api bool|string $article_author The article author's Facebook URL, return false to disable.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_opengraph_author_facebook', $article_author, $presentation ) );
	}
}
