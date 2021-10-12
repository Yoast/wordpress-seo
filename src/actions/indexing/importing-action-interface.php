<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * Importing action interface.
 */
interface Importing_Action_Interface extends Indexation_Action_Interface, Limited_Indexing_Action_Interface {

	/**
	 * Retrieves the constant domain of the class.
	 *
	 * @return string The constant domain of the class.
	 */
	public function get_domain();

	/**
	 * Retrieves the constant name of the class.
	 *
	 * @return string The constant name of the class.
	 */
	public function get_name();

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	public function query();
}
