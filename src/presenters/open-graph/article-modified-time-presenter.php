<?php
/**
 * Presenter class for the OpenGraph article modified time.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Article_Modified_Time_Presenter
 */
class Article_Modified_Time_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the article modified time tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The article modified time tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$modified_time = $presentation->og_article_modified_time;

		if ( \is_string( $modified_time ) && $modified_time !== '' ) {
			return \sprintf( '<meta property="article:modified_time" content="%s" />', \esc_attr( $modified_time ) );
		}

		return '';
	}
}
