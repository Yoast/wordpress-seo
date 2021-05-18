<?php

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Presenter class for the Open Graph description.
 */
class Description_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="og:description" content="%s" />';

	/**
	 * Run the Open Graph description through replace vars and the `wpseo_opengraph_desc` filter.
	 *
	 * @return string The filtered description.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_opengraph_desc' - Allow changing the Yoast SEO generated Open Graph description.
		 *
		 * @api string The description.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_opengraph_desc', $this->replace_vars( $this->presentation->open_graph_description ), $this->presentation ) );
	}
}
