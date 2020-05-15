<?php
/**
 * Presenter class for the Open Graph type.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Class Type_Presenter
 */
class Type_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="og:type" content="%s" />';

	/**
	 * Run the opengraph type content through the `wpseo_opengraph_type` filter.
	 *
	 * @return string $type The filtered type.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_opengraph_type' - Allow changing the opengraph type.
		 *
		 * @api string $type The type.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_opengraph_type', $this->presentation->open_graph_type, $this->presentation );
	}
}
