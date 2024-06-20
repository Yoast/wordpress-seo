<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

/**
 * Migration action interface.
 */
interface Migration_Interface  {

	public function migrate( $old_url, $new_url ): int;

	public function get_limit( ): int;

	public function get_table(): string;

	public function get_name(): string;
}
