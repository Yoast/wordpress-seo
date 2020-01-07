<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastIndexablesExpandObjectTypeColumn
 */
class WpYoastIndexablesExpandObjectTypeColumn extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$this->change_column( $table_name, 'object_type', 'string', [ 'null' => false, 'limit' => 191 ] );
		$this->change_column( $table_name, 'object_sub_type', 'string', [ 'null' => true, 'limit' => 191 ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->change_column( $table_name, 'object_type', 'string', [ 'null' => true, 'limit' => 16 ] );
		$this->change_column( $table_name, 'object_sub_type', 'string', [ 'null' => true, 'limit' => 100 ] );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
