<?php

namespace Yoast\WP\SEO\Introductions\Domain;

/**
 * Represents an introduction.
 */
interface Introduction_Interface {

	/**
	 * Returns the unique name.
	 *
	 * @return string
	 */
	public function get_name();

	/**
	 * Returns the plugin this feature belongs to.
	 * This is used in the version compare.s
	 *
	 * @return string
	 */
	public function get_plugin();

	/**
	 * Returns the version when the feature was introduced.
	 *
	 * @return string
	 */
	public function get_version();

	/**
	 * Returns the applicable pages.
	 *
	 * @return string[]
	 */
	public function get_pages();

	/**
	 * Returns the required user capabilities.
	 *
	 * @return string[]
	 */
	public function get_capabilities();

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int
	 */
	public function get_priority();

	/**
	 * Returns can override (in another plugin).
	 *
	 * @return bool
	 */
	public function get_can_override();
}
