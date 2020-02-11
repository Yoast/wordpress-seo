<?php
/**
 * Presenter class for the OpenGraph article publisher.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Publisher_Presenter
 */
class Article_Publisher_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the site article publisher tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The article publisher tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$article_publisher = $this->filter( $presentation->open_graph_article_publisher, $presentation );

		if ( \is_string( $article_publisher ) && $article_publisher !== '' ) {
			return \sprintf( '<meta property="article:publisher" content="%s" />', \esc_attr( $article_publisher ) );
		}

		return '';
	}

	/**
	 * Run the article publisher's Facebook URL through the `wpseo_og_article_publisher` filter.
	 *
	 * @param string                 $article_publisher The article publisher's Facebook URL to filter.
	 * @param Indexable_Presentation $presentation      The presentation of an indexable.
	 *
	 * @return string The filtered article publisher's Facebook URL.
	 */
	private function filter( $article_publisher, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_og_article_publisher' - Allow developers to filter the article publisher's Facebook URL.
		 *
		 * @api bool|string $article_publisher The article publisher's Facebook URL, return false to disable.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_og_article_publisher', $article_publisher, $presentation ) );
	}
}
