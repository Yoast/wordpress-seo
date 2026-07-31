<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;

/**
 * CreateExpiringStoreTable class.
 *
 * Creates a network-wide table for reliable temporary storage with expiration.
 */
class CreateExpiringStoreTable extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {
		$table_name = $this->get_table_name();
		$adapter    = $this->get_adapter();

		if ( ! $adapter->table_exists( $table_name ) ) {
			$table = $this->create_table( $table_name, [ 'id' => false ] );

			$table->column(
				'key_name',
				'string',
				[
					'limit'       => 255,
					'null'        => false,
					'primary_key' => true,
				],
			);

			$table->column( 'value', 'text', [ 'null' => false ] );

			$table->column( 'exp', 'datetime', [ 'null' => false ] );

			$table->finish();

			$this->add_index( $table_name, 'exp', [ 'name' => 'exp_index' ] );
		}
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$this->drop_table( $this->get_table_name() );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * Uses base_prefix so the table is shared across the entire multisite network.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		global $wpdb;

		return $wpdb->base_prefix . 'yoast_expiring_store';
	}
}
