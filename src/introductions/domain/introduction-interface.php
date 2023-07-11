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

	/**
	 * Returns whether this introduction is applicable.
	 *
	 * @return bool
	 */
	public function get_is_applicable();
}
