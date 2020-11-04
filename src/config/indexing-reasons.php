<?php

namespace Yoast\WP\SEO\Config;

/**
 * Class Indexing_Reasons. Contains constants that aren't context specific.
 */
class Indexing_Reasons {

	/**
	 * Represents the reason that the indexing process failed and should be tried again.
	 */
	const REASON_INDEXING_FAILED = 'indexing_failed';

	/**
	 * Represents the reason that the permalink settings are changed.
	 */
	const REASON_PERMALINK_SETTINGS = 'permalink_settings_changed';

	/**
	 * Represents the reason that the category base is changed.
	 */
	const REASON_CATEGORY_BASE_PREFIX = 'category_base_changed';

	/**
	 * Represents the reason that the tag base is changed.
	 */
	const REASON_TAG_BASE_PREFIX = 'tag_base_changed';

	/**
	 * Represents the reason that the home url option is changed.
	 */
	const REASON_HOME_URL_OPTION = 'home_url_option_changed';
}
