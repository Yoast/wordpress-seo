<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class DropIndexableMetaTableIfExists
 */
class WpYoastDropIndexableMetaTableIfExists extends Ruckusing_Migration_Base {

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
		return Model::get_table_name( 'Indexable_Meta' );
	}
}
