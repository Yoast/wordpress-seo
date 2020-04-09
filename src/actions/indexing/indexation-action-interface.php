<?php
/**
 * Reindexation action for indexables
 *
 * @package Yoast\WP\SEO\Actions\Indexing
 */

namespace Yoast\WP\SEO\Actions\Indexing;

interface Indexation_Action_Interface {

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The number of unindexed objects.
	 */
	public function get_total_unindexed();

	/**
	 * Index a number of objects.
	 *
	 * NOTE: ALWAYS use limits, this method is intended to be called multiple times over several requests.
	 *
	 * For indexation that requires JavaScript simply return the objects that should be indexed.
	 *
	 * @return array The reindexed objects.
	 */
	public function index();
}
