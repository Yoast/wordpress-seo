<?php
/**
 * Presenter class for the Open Graph article modified time.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Class Article_Modified_Time_Presenter
 */
class Article_Modified_Time_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="article:modified_time" content="%s" />';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		return $this->presentation->open_graph_article_modified_time;
	}
}
