<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Statistics;

/**
 * Test Helper Class.
 */
final class Statistics_Mock extends WPSEO_Statistics {

	private $rank_counts;

	public function __construct( array $rank_counts ) {
		$this->rank_counts = $rank_counts;
	}

	public function get_post_count( $rank ) {
		if ( \array_key_exists( $rank->get_rank(), $this->rank_counts ) ) {
			return $this->rank_counts[ $rank->get_rank() ];
		}

		return 0;
	}
}
