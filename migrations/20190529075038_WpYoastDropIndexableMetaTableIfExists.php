<?php
/**
 * Class DropIndexableMetaTableIfExists
 *
 * @package WPSEO\Migrations
 */

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\WP\Free\Yoast_Model;

/**
 * Indexable meta removal migration.
 */
class DropIndexableMetaTableIfExists extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		// This can be done safely as it executes a DROP IF EXISTS.
		$this->drop_table( $table_name );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		// No down required. This specific table should never exist.
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable_Meta' );
	}
}
