<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * AddIndexableObjectIdAndTypeIndex
 */
class AddIndexableObjectIdAndTypeIndex extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$this->add_index(
			$this->get_table_name(),
			[
				'object_id',
				'object_type',
			],
			[
				'name' => 'object_id_and_type',
			]
		);
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$this->remove_index(
			$this->get_table_name(),
			[
				'object_id',
				'object_type',
			],
			[
				'name' => 'object_id_and_type',
			]
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
