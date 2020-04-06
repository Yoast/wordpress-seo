<?php
/**
 * Presenter class for the Open Graph article modified time.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Modified_Time_Presenter
 */
class Article_Modified_Time_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the article modified time tag.
	 *
	 * @return string The article modified time tag.
	 */
	public function present() {
		$modified_time = $this->presentation->open_graph_article_modified_time;

		if ( \is_string( $modified_time ) && $modified_time !== '' ) {
			return \sprintf( '<meta property="article:modified_time" content="%s" />', \esc_attr( $modified_time ) );
		}

		return '';
	}
}
