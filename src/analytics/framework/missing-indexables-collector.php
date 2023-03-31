<?php

namespace Yoast\WP\SEO\Analytics\Framework;

use Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action;
use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket;
use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Count;

/**
 * Manages the collection of the missing indexable data.
 */
class Missing_Indexables_Collector implements \WPSEO_Collection {

	/**
	 * All the indexation actions.
	 *
	 * @var array<Abstract_Indexing_Action> $indexation_actions
	 */
	private $indexation_actions;

	/**
	 * The collector constructor.
	 *
	 * @param \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action ...$indexation_actions All the Indexation actions.
	 */
	public function __construct( Abstract_Indexing_Action ...$indexation_actions ) {
		$this->indexation_actions = $indexation_actions;
	}

	/**
	 * Gets the data for the tracking collector.
	 *
	 * @return array The list of missing indexables.
	 */
	public function get() {
		$missing_indexable_bucket = new Missing_Indexable_Bucket();
		foreach ( $this->indexation_actions as $indexation_action ) {
			$missing_indexable_count = new Missing_Indexable_Count( $indexation_action::UNINDEXED_COUNT_TRANSIENT, $indexation_action->get_total_unindexed() );
			$missing_indexable_bucket->add_missing_indexable_count( $missing_indexable_count );
		}

		return $missing_indexable_bucket->to_array();
	}
}
