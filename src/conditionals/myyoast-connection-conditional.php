<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the MyYoast connection (OAuth client, WP-CLI
 * commands, and the key-rotation cron, etc.).
 *
 * Enable by defining `YOAST_SEO_MYYOAST_CONNECTION` as `true` in wp-config.php.
 * On top of the flag, the connection is rolled out gradually to a deterministic
 * share of sites — see {@see Gradual_Rollout_Conditional}.
 */
class MyYoast_Connection_Conditional extends Gradual_Rollout_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag(): string {
		return 'MYYOAST_CONNECTION';
	}

	/**
	 * The share of sites the connection is rolled out to, in per-mille (0-1000).
	 *
	 * Ships at 1%; raised release over release as the rollout widens.
	 *
	 * @return int The rollout share in per-mille.
	 */
	protected function get_rollout_share(): int {
		// 1%.
		return 10;
	}
}
