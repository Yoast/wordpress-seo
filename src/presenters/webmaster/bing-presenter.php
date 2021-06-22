<?php

namespace Yoast\WP\SEO\Presenters\Webmaster;

use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;

/**
 * Presenter class for the Bing Webmaster verification setting.
 */
class Bing_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	const KEY = 'msvalidate.01';

	/**
	 * Retrieves the webmaster tool site verification value from the settings.
	 *
	 * @return string The webmaster tool site verification value.
	 */
	public function refresh() {
		return $this->helpers->options->get( 'msverify', '' );
	}
}
