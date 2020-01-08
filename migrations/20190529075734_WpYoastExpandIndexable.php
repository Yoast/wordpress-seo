<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastExpandIndexable
 */
class WpYoastExpandIndexable extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$this->add_column( $table_name, 'og_title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_column( $table_name, 'og_image', 'mediumtext', [ 'null' => true ] );
		$this->add_column( $table_name, 'og_description', 'mediumtext', [ 'null' => true ] );
		$this->add_column( $table_name, 'twitter_title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_column( $table_name, 'twitter_image', 'mediumtext', [ 'null' => true ] );
		$this->add_column( $table_name, 'twitter_description', 'mediumtext', [ 'null' => true ] );

		$this->add_column( $table_name, 'permalink_hash', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_index( $table_name, 'permalink_hash' );

		$this->remove_index(
			$table_name,
			[
				'permalink',
			],
			[
				'name'   => 'unique_permalink',
				'unique' => true,
			]
		);

		$this->change_column( $table_name, 'permalink', 'mediumtext', [ 'null' => true ] );
		$this->change_column( $table_name, 'canonical', 'mediumtext', [ 'null' => true ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column( $table_name, 'og_title' );
		$this->remove_column( $table_name, 'og_image' );
		$this->remove_column( $table_name, 'og_description' );
		$this->remove_column( $table_name, 'twitter_title' );
		$this->remove_column( $table_name, 'twitter_image' );
		$this->remove_column( $table_name, 'twitter_description' );

		$this->remove_index( $table_name, 'permalink_hash' );
		$this->remove_column( $table_name, 'permalink_hash' );

		$this->change_column( $table_name, 'permalink', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->change_column( $table_name, 'canonical', 'string', [ 'null' => true, 'limit' => 191 ] );

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
