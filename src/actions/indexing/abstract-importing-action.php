<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * Importing action interface.
 */
abstract class Abstract_Importing_Action implements Indexation_Action_Interface, Limited_Indexing_Action_Interface {

	/**
	 * The domain of the class.
	 *
	 * This is a trick to force derived classes to define a transient themselves.
	 *
	 * @var string
	 */
	const DOMAIN = null;

	/**
	 * The name of the class.
	 *
	 * This is a trick to force derived classes to define a transient themselves.
	 *
	 * @var string
	 */
	const NAME = null;

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	abstract public function query();
}
