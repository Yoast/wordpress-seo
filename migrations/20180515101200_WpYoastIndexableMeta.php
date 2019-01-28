<?php
/**
 * Class WpYoastIndexableMeta
 *
 * @package WPSEO\Migrations
 */

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\WP\Free\Yoast_Model;

/**
 * Indexable meta migration.
 */
class WpYoastIndexableMeta extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$indexable_meta_table = $this->create_table( $table_name );
		$indexable_meta_table->column( 'indexable_id', 'integer', array( 'unsigned' => true, 'limit' => 11 ) );
		$indexable_meta_table->column( 'meta_key', 'string', array( 'limit' => 191 ) );
		$indexable_meta_table->column( 'meta_value', 'text', array( 'null' => true, 'limit' => 191 ) );

		// Execute the SQL to create the table.
		$indexable_meta_table->finish();

		$this->add_index(
			$table_name,
			array(
				'indexable_id',
				'meta_key',
			),
			array(
				'name'   => 'indexable_meta',
				'unique' => true,
			)
		);

		$this->add_timestamps( $table_name );
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
		return Yoast_Model::get_table_name( 'Indexable_Meta' );
	}
}
