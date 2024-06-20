<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

/**
 * Migration action interface.
 */
interface Migration_Interface  {

	public function migrate( ): void;

	public function get_limit( ): int;

	public function get_table(): string;
}
