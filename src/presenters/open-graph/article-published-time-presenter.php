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
<<<<<<< HEAD
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 * @param bool                   $output_tag   Optional. Whether or not to output the HTML tag. Defaults to true.
	 *
	 * @return string The article published time tag.
	 */
	public function present( Indexable_Presentation $presentation, $output_tag = true ) {
		$published_time = $presentation->open_graph_article_published_time;
=======
	 * @return string The article published time tag.
	 */
	public function present() {
		$published_time = $this->presentation->open_graph_article_published_time;
>>>>>>> e2e9a4b81435c68471e9fd6075fb2ae7ffa3a8b1

		if ( \is_string( $published_time ) && $published_time !== '' ) {
			if ( ! $output_tag ) {
				return $published_time;
			}

			return \sprintf( '<meta property="article:published_time" content="%s" />', \esc_attr( $published_time ) );
		}

		return '';
	}
}
