<?php
/**
 * Presenter class for the Open Graph article published time.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Published_Time_Presenter
 */
class Article_Published_Time_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the article published time tag.
	 *
	 * @return string The article published time tag.
	 */
	public function present() {
		$published_time = $this->presentation->open_graph_article_published_time;

		if ( \is_string( $published_time ) && $published_time !== '' ) {
			return \sprintf( '<meta property="article:published_time" content="%s" />', \esc_attr( $published_time ) );
		}

		return '';
	}
}
