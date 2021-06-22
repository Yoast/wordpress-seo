<?php

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;

/**
 * Presenter class for the Open Graph description.
 */
class Description_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	const KEY = 'og:description';

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = self::META_PROPERTY_CONTENT;

	/**
	 * Run the Open Graph description through replace vars and the `wpseo_opengraph_desc` filter.
	 *
	 * @return string The filtered description.
	 */
	public function refresh() {
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
