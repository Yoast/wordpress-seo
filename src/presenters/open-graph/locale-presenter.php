<?php

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Final presenter class for the Open Graph locale.
 */
final class Locale_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="og:locale" content="%s" />';

	/**
	 * Run the locale through the `wpseo_og_locale` filter.
	 *
	 * @return string The filtered locale.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_og_locale' - Allow changing the Yoast SEO Open Graph locale.
		 *
		 * @api string The locale string
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_og_locale', $this->presentation->open_graph_locale, $this->presentation ) );
	}
}
