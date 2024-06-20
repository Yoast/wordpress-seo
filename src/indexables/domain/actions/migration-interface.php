<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

/**
 * Migration action interface.
 */
interface Migration_Interface  {

	public function migrate( $old_url, $new_url ): void;

	public function get_limit( ): int;

	public function get_table(): string;
}
