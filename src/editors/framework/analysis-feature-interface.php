<?php

namespace Yoast\WP\SEO\Editors\Framework;

/**
 * This interface describes an Analysis feature implementation.
 */
interface Analysis_Feature_Interface {

	/**
	 * Returns If the analysis is enabled.
	 *
	 * @return bool
	 */
	public function is_enabled(): bool;

	/**
	 * Returns the name of the object.
	 *
	 * @return string
	 */
	public function get_name(): string;

	/**
	 * Returns the legacy key used in the front-end to determine if the feature is enabled.
	 *
	 * @return string
	 */
	public function get_legacy_key(): string;
}
