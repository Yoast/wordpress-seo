<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * Importing action interface.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Importing_Action_Interface extends Indexation_Action_Interface, Limited_Indexing_Action_Interface {

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	public function query();
}
