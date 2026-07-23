<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Bulk_Editor;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

/**
 * Test double that exposes the collector's protected "needs improvement" WHERE builder.
 */
class Post_Meta_Posts_Collector_Double extends Post_Meta_Posts_Collector {

	/**
	 * Exposes build_needs_improvement_where for testing.
	 *
	 * @param array<string> $fields         The fields that need improvement.
	 * @param bool          $scores_enabled Whether the per-field scores may back the filter.
	 *
	 * @return string The prepared WHERE clause.
	 */
	public function expose_build_needs_improvement_where( array $fields, bool $scores_enabled ): string {
		return $this->build_needs_improvement_where( $fields, $scores_enabled );
	}
}
