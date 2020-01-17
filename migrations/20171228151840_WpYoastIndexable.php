<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Indexable migration.
 */
class WpYoastIndexable extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$indexable_table = $this->create_table( $table_name );

		$indexable_table->column( 'permalink', 'string', [ 'null' => true, 'limit' => 191 ] );

		$indexable_table->column( 'object_id', 'integer', [ 'unsigned' => true, 'null' => true, 'limit' => 11 ] );
		$indexable_table->column( 'object_type', 'string', [ 'limit' => 16 ] );
		$indexable_table->column( 'object_sub_type', 'string', [ 'null' => true, 'limit' => 100 ] );

		$indexable_table->column(
			'number_of_pages',
			'integer',
			[
				'unsigned' => true,
				'null'     => true,
				'default'  => null,
				'limit'    => 11,
			]
		);

		$indexable_table->column( 'canonical', 'string', [ 'null' => true, 'limit' => 191 ] );

		$indexable_table->column( 'title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'description', 'text', [ 'null' => true ] );
		$indexable_table->column( 'breadcrumb_title', 'string', [ 'null' => true, 'limit' => 191 ] );

		$indexable_table->column( 'is_robots_noindex', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_nofollow', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_noarchive', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_noimageindex', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_nosnippet', 'boolean', [ 'null' => true, 'default' => false ] );

		$indexable_table->column( 'primary_focus_keyword', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'primary_focus_keyword_score', 'integer', [ 'null' => true, 'limit' => 3 ] );

		$indexable_table->column( 'readability_score', 'integer', [ 'null' => true, 'limit' => 3 ] );

		$indexable_table->column( 'is_cornerstone', 'boolean', [ 'default' => false ] );

		$indexable_table->column( 'link_count', 'integer', [ 'null' => true, 'limit' => 11 ] );
		$indexable_table->column( 'incoming_link_count', 'integer', [ 'null' => true, 'limit' => 11 ] );

		// Exexcute the SQL to create the table.
		$indexable_table->finish();

		$this->add_index(
			$table_name,
			[
				'permalink',
			],
			[
				'name'   => 'unique_permalink',
				'unique' => true,
			]
		);

		$this->add_index(
			$table_name,
			[
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'indexable',
			]
		);

		$this->add_index(
			$table_name,
			[
				'primary_focus_keyword_score',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'primary_focus_keyword_score',
			]
		);

		$this->add_index(
			$table_name,
			[
				'is_cornerstone',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'cornerstones',
			]
		);

		$this->add_index(
			$table_name,
			[
				'incoming_link_count',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'orphaned_content',
			]
		);

		$this->add_index(
			$table_name,
			[
				'is_robots_noindex',
				'object_id',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'robots_noindex',
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
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
