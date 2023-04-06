<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing;

/**
 * The abstract indexing action double.
 */
class Abstract_Indexing_Action_Double extends \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action {

	/**
	 * A needed constant for testing.
	 */
	const UNINDEXED_COUNT_TRANSIENT = 'wpseo_unindexed_double';

	/**
	 * @inheritDoc
	 */
	protected function get_select_query( $limit ) {
		return '';
	}

	/**
	 * @inheritDoc
	 */
	protected function get_count_query() {
		return '';
	}

	/**
	 * @inheritDoc
	 */
	public function index() {
		return '';
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		return 10;
	}

	/**
	 * @return int
	 */
	public function get_total_unindexed() {
		return 15;
	}
}
