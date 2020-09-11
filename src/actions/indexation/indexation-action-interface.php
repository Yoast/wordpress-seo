<?php

namespace Yoast\WP\SEO\Actions\Indexation;

/**
 * Interface definition of reindexation action for indexables.
 */
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

	/**
	 * Returns the number of objects that will be indexed in a single indexation pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit();
}
