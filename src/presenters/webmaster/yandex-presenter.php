<?php

namespace Yoast\WP\SEO\Presenters\Webmaster;

use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;

/**
 * Presenter class for the Yandex Webmaster verification setting.
 */
class Yandex_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	const KEY = 'yandex-verification';

	/**
	 * Retrieves the webmaster tool site verification value from the settings.
	 *
	 * @return string The webmaster tool site verification value.
	 */
	public function refresh() {
		return $this->helpers->options->get( 'yandexverify', '' );
	}
}
