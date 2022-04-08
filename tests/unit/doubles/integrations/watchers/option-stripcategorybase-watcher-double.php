<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher;

class Option_Stripcategorybase_Watcher_Double extends Option_Stripcategorybase_Watcher {

	/**
	 * Public wrapper of protected method.
	 *
	 * @return string The parent's value.
	 */
	public function get_option_group_name()
	{
		return parent::get_option_group_name();
	}

	/**
	 * Public wrapper of protected method.
	 *
	 * @return string The parent's value.
	 */
	public function get_option_field_name()
	{
		return parent::get_option_field_name();
	}

	/**
	 * Public wrapper of protected method.
	 *
	 * @param array $old_value Unused.
	 * @param array $new_value Unused.
	 */
	public function handle_changed_option( $old_value, $new_value )
	{
		parent::handle_changed_option( $old_value, $new_value );
	}
}
