<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastIndexablesAddFields
 */
class WpYoastIndexablesAddFields extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$this->add_column( $table_name, 'post_status', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_column( $table_name, 'is_protected', 'boolean', [ 'default' => false ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column( $table_name, 'post_status' );
		$this->remove_column( $table_name, 'is_protected' );
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
