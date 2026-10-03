<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Indexing;

use Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action;

/**
 * The abstract indexing action double.
 */
final class Abstract_Indexing_Action_Double extends Abstract_Indexing_Action {

	/**
	 * A needed constant for testing.
	 */
	public const UNINDEXED_COUNT_TRANSIENT = 'wpseo_unindexed_double';

	/**
	 * Empty function for testing.
	 *
	 * @param int $limit The limit for the query.
	 *
	 * @return string
	 */
	protected function get_select_query( $limit ) {
		return '';
	}

	/**
	 * Empty function for testing.
	 *
	 * @return string
	 */
	protected function get_count_query() {
		return '';
	}

	/**
	 * Empty function for testing.
	 *
	 * @return string
	 */
	public function index() {
		return '';
	}

	/**
	 * Empty function for testing.
	 *
	 * @return int
	 */
	public function get_limit() {
		return 10;
	}

	/**
	 * Empty function for testing.
	 *
	 * @return int
	 */
	public function get_total_unindexed() {
		return 15;
	}
}
