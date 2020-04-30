<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Migration for the Primary Term.
 */
class WpYoastPrimaryTerm extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$indexable_table = $this->create_table( $table_name );

		$indexable_table->column(
			'post_id',
			'integer',
			[
				'unsigned' => true,
				'null'     => false,
				'limit'    => 11,
			]
		);
		$indexable_table->column(
			'term_id',
			'integer',
			[
				'unsigned' => true,
				'null'     => false,
				'limit'    => 11,
			]
		);
		$indexable_table->column(
			'taxonomy',
			'string',
			[
				'null'  => false,
				'limit' => 32,
			]
		);

		// Executes the SQL to create the table.
		$indexable_table->finish();

		$this->add_index(
			$table_name,
			[
				'post_id',
				'taxonomy',
			],
			[
				'name' => 'post_taxonomy',
			]
		);

		$this->add_index(
			$table_name,
			[
				'post_id',
				'term_id',
			],
			[
				'name' => 'post_term',
			]
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
	 * @return string Table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'Primary_Term' );
	}
}
