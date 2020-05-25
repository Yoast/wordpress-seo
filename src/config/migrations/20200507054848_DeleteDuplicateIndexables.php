<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * DeleteDuplicateIndexables.
 */
class DeleteDuplicateIndexables extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		/*
		 * Deletes duplicate indexables that have the same object_id and object_type.
		 * The rows with a higher ID are deleted as those should be unused and could be outdated.
		 */
		$this->query( 'DELETE wyi FROM ' . $table_name . ' wyi INNER JOIN ' . $table_name . ' wyi2 WHERE wyi2.object_id = wyi.object_id AND wyi2.object_type = wyi.object_type AND wyi2.id < wyi.id;' );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		// Nothing to do.
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'Indexable' );
	}
}
