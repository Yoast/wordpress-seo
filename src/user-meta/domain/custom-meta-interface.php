<?php

namespace Yoast\WP\SEO\User_Meta\Domain;

/**
 * This interface describes a custom meta.
 */
interface Custom_Meta_Interface {

	/**
	 * Returns the db key of the custom meta.
	 *
	 * @return string
	 */
	public function get_key(): string;

	/**
	 * Returns the id of the custom meta's form field.
	 *
	 * @return string
	 */
	public function get_field_id(): string;

	/**
	 * Returns whether the custom meta is allowed to be empty.
	 *
	 * @return bool
	 */
	public function is_empty_allowed(): bool;
}
