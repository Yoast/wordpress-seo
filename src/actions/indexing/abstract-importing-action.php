<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * Importing action interface.
 */
abstract class Abstract_Importing_Action implements Indexation_Action_Interface, Limited_Indexing_Action_Interface {

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = null;

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = null;

	/**
	 * Gets the cursor id.
	 *
	 * @return string The cursor id.
	 */
	protected function get_cursor_id() {
		$class = get_class( $this );
		return $class::PLUGIN . '_' . $class::TYPE;
	}

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	abstract public function query();
}
