<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the MyYoast connection (OAuth client, WP-CLI
 * commands, and the key-rotation cron).
 *
 * Enable by defining `YOAST_SEO_MYYOAST_CONNECTION` as `true` in wp-config.php.
 */
class MyYoast_Connection_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'MYYOAST_CONNECTION';
	}
}
