<?php
/**
 * Presenter class for the OpenGraph article published time.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Published_Time_Presenter
 */
class Article_Published_Time_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the article published time tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The article published time tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$published_time = $presentation->og_article_published_time;

		if ( \is_string( $published_time ) && $published_time !== '' ) {
			return \sprintf( '<meta property="article:published_time" content="%s" />', \esc_attr( $published_time ) );
		}

		return '';
	}
}
