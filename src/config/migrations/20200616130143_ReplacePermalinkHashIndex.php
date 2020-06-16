<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\WP\SEO\Config\Migrations
 */

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * ReplacePermalinkHashIndex class.
 */
class ReplacePermalinkHashIndex extends Migration {

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

		$this->change_column(
			$table_name,
			'permalink_hash',
			'string',
			[
				'null'  => true,
				'limit' => 40,
			]
		);

		$this->remove_index(
			$table_name,
			[
				'permalink_hash',
			],
			[
				'name' => 'permalink_hash',
			]
		);

		$this->add_index(
			$table_name,
			[
				'permalink_hash',
				'object_type',
			],
			[
				'name' => 'permalink_hash_and_object_type',
			]
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		// Nothing to do.
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
