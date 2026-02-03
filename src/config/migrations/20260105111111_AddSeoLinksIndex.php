<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddSeoLinksIndex class.
 */
class AddSeoLinksIndex extends Migration {

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

		$this->add_index(
			$table_name,
			'url',
			[
				'name' => 'url_index',
			]
		);

		$this->add_index(
			$table_name,
			'target_indexable_id',
			[
				'name' => 'target_indexable_id_index',
			]
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_index(
			$table_name,
			'url',
			[
				'name' => 'url_index',
			]
		);
		$this->remove_index(
			$table_name,
			'target_indexable_id',
			[
				'name' => 'target_indexable_id_index',
			]
		);
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'SEO_Links' );
	}
}
