<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * ExpandIndexableColumnLengths
 */
class ExpandIndexableColumnLengths extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$this->change_column( $this->get_table_name(), 'title', 'text', [ 'null' => true ] );
		$this->change_column( $this->get_table_name(), 'open_graph_title', 'text', [ 'null' => true ] );
		$this->change_column( $this->get_table_name(), 'twitter_title', 'text', [ 'null' => true ] );
		$this->change_column( $this->get_table_name(), 'open_graph_image_source', 'text', [ 'null' => true ] );
		$this->change_column( $this->get_table_name(), 'twitter_image_source', 'text', [ 'null' => true ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$this->change_column(
			$this->get_table_name(),
			'title',
			'string',
			[ 'null' => true, 'limit' => 191 ]
		);
		$this->change_column(
			$this->get_table_name(),
			'opengraph_title',
			'string',
			[ 'null' => true, 'limit' => 191 ]
		);
		$this->change_column(
			$this->get_table_name(),
			'twitter_title',
			'string',
			[ 'null' => true, 'limit' => 191 ]
		);
		$this->change_column(
			$this->get_table_name(),
			'open_graph_image_source',
			'string',
			[ 'null' => true, 'limit' => 191 ]
		);
		$this->change_column(
			$this->get_table_name(),
			'twitter_image_source',
			'string',
			[ 'null' => true, 'limit' => 191 ]
		);
	}

	/**
	 * Retrieves the table name to use for storing indexables.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'Indexable' );
	}
}
