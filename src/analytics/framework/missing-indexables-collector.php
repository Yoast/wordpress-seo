<?php

namespace Yoast\WP\SEO\Analytics\Framework;

use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket;
use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Count;
use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;

/**
 * Manages the collection of the missing indexable data.
 */
class Missing_Indexables_Collector implements \WPSEO_Collection {

	/**
	 * All the indexation actions.
	 *
	 * @var array<Indexation_Action_Interface> $indexation_actions
	 */
	private $indexation_actions;

	/**
	 * The collector constructor.
	 *
	 * @param \Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface ...$indexation_actions All the Indexation
	 *                                                                                          actions.
	 */
	public function __construct( Indexation_Action_Interface ...$indexation_actions ) {
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

		$this->get_additional_missing_indexables( $missing_indexable_bucket );
		return $missing_indexable_bucket->to_array();
	}

	/**
	 * Gets additional tasks from the 'wpseo_missing_indexed_indexables' filter.
	 */
	private function get_additional_missing_indexables( Missing_Indexable_Bucket $missing_indexable_bucket ): void {

		/**
		 * Filter: Adds the possibility to add additional missing indexable objects.
		 *
		 * @api Missing_Indexable_Bucket An indexable cleanup bucket. New values are instances of Missing_Indexable_Count.
		 */
		\apply_filters( 'wpseo_missing_indexed_indexables', $missing_indexable_bucket );
	}
}
