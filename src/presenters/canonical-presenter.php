<?php

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Presenter class for the canonical.
 */
class Canonical_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<link rel="canonical" href="%s" />';

	/**
	 * The method of escaping to use.
	 *
	 * @var string
	 */
	protected $escaping = 'url';

	/**
	 * Run the canonical content through the `wpseo_canonical` filter.
	 *
	 * @return string $canonical The filtered canonical.
	 */
	public function get() {
		if ( \in_array( 'noindex', $this->presentation->robots, true ) ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_canonical' - Allow filtering of the canonical URL put out by Yoast SEO.
		 *
		 * @api string $canonical The canonical URL.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \urldecode( (string) \trim( \apply_filters( 'wpseo_canonical', $this->presentation->canonical, $this->presentation ) ) );
	}
}
