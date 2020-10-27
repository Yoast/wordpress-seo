<?php

namespace Yoast\WP\SEO\Presenters\Admin;

/**
 * Presenter class for the warning that is given when the Category URLs (stripcategorybase) option is touched.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Indexation_Permalink_Warning_Presenter extends Indexation_Warning_Presenter {

	/**
	 * Represents the reason that the permalink settings are changed.
	 */
	const REASON_PERMALINK_SETTINGS = 'permalink_settings_changed';

	/**
	 * Represents the reason that the category base is changed.
	 */
	const REASON_CATEGORY_BASE_PREFIX = 'category_base_changed';

	/**
	 * Represents the reason that the home url option is changed.
	 */
	const REASON_HOME_URL_OPTION = 'home_url_option_changed';

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return '';
	}
}
