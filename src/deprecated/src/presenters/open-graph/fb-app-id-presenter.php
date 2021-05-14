<?php

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

// Mark this file as deprecated.
\_deprecated_file( __FILE__, 'WPSEO 15.5' );

/**
 * Presenter class for the Open Graph FB app ID.
 *
 * @deprecated 15.5
 * @codeCoverageIgnore
 */
class FB_App_ID_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="fb:app_id" content="%s" />';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		return $this->presentation->open_graph_fb_app_id;
	}
}
