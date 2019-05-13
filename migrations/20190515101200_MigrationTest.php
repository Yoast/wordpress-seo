<?php
/**
 * Class WpYoastIndexableMeta
 *
 * @package WPSEO\Migrations
 */

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\WP\Free\Yoast_Model;

/**
 * Migration to test the database migrations.
 */
class MigrationTest extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$table = $this->create_table( $table_name );
		$table->column(
			'test_column',
			'integer',
			array(
				'unsigned' => true,
				'limit'    => 11,
			)
		);
		$table->finish();
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$this->drop_table( $this->get_table_name() );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Migrations_Test' );
	}
}
