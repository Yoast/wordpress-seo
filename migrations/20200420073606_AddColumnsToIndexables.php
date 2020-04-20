<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class AddColumnsToIndexables.
 */
class AddColumnsToIndexables extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$tables = $this->get_tables();

		$blog_id = \get_current_blog_id();
		foreach ( $tables as $table ) {
			$this->add_column( $table, 'blog_id', 'biginteger', [
				'null'  => false,
				'limit' => 20,
			] );

			$this->query( 'UPDATE ' . $table . ' SET blog_id = ' . $blog_id );
		}

		$this->add_column( $tables[0], 'language', 'string', [ 'null' => true, 'limit' => 32 ] );
		$this->add_column( $tables[0], 'region', 'string', [ 'null' => true, 'limit' => 32 ] );
		$this->add_column( $tables[0], 'schema_page_type', 'string', [ 'null' => true, 'limit' => 64 ] );
		$this->add_column( $tables[0], 'schema_article_type', 'string', [ 'null' => true, 'limit' => 64 ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$tables = $this->get_tables();

		foreach ( $tables as $table ) {
			$this->remove_column( $table, 'blog_id' );
		}

		$this->remove_column( $tables[0], 'language' );
		$this->remove_column( $tables[0], 'region' );
		$this->remove_column( $tables[0], 'schema_page_type' );
		$this->remove_column( $tables[0], 'schema_article_type' );
	}

	/**
	 * Retrieves the tables to use.
	 *
	 * @return string[] The tables to use.
	 */
	protected function get_tables() {
		return [
			Yoast_Model::get_table_name( 'Indexable' ),
			Yoast_Model::get_table_name( 'Indexable_Hierarchy' ),
			Yoast_Model::get_table_name( 'Primary_Term' ),
		];
	}
}
