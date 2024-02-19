<?php

namespace Yoast\WP\SEO\Editors\Framework;

/**
 * Describes if the previously used keyword feature should be enabled.
 */
class Previously_Used_Keyword implements Analysis_Feature_Interface {

	/**
	 * Whether this analysis is enabled.
	 *
	 * @return bool Whether this analysis is enabled.
	 */
	public function is_enabled(): bool {
		/**
		 * Filter to determine whether the PreviouslyUsedKeyword assessment should run.
		 *
		 * @param bool $previouslyUsedKeywordActive Whether the PreviouslyUsedKeyword assessment should run.
		 */
		return \apply_filters( 'wpseo_previously_used_keyword_active', true );
	}

	/**
	 * Returns the name of the object.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'previouslyUsedKeyword';
	}

	/**
	 * Gets the legacy key.
	 *
	 * @return string The legacy key.
	 */
	public function get_legacy_key(): string {
		return 'previouslyUsedKeywordActive';
	}
}
