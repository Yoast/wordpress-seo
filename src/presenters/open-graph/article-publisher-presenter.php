<?php
/**
 * Presenter class for the OpenGraph article publisher.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

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
		$article_publisher = $this->filter( $presentation->og_article_publisher );

		if ( is_string( $article_publisher ) && $article_publisher !== '' ) {
			return sprintf( '<meta property="article:publisher" content="%s" />', \esc_attr( $article_publisher ) );
		}

		return '';
	}

	/**
	 * Run the article publisher's Facebook URL through the `wpseo_og_article_publisher` filter.
	 *
	 * @param string $article_publisher The article publisher's Facebook URL to filter.
	 *
	 * @return string The filtered article publisher's Facebook URL.
	 */
	private function filter( $article_publisher ) {
		/**
		 * Filter: 'wpseo_og_article_publisher' - Allow developers to filter the article publisher's Facebook URL.
		 *
		 * @api bool|string $article_publisher The article publisher's Facebook URL, return false to disable.
		 */
		return trim( \apply_filters( 'wpseo_og_article_publisher', $article_publisher ) );
	}
}
