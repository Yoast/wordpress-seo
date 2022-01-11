<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddIsPubliclyViewableToIndexables class.
 */
class AddIsPubliclyViewableToIndexables extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * Migration up.
	 * Requires a reindex of indexables.
	 *
	 * @return void
	 */
	public function up() {
		$table_name = $this->get_table_name();
		$this->add_column(
			$table_name,
			'is_publicly_viewable',
			'boolean',
			[
				'null'    => true,
				'default' => null,
			]
		);
	}

	/**
	 * Migration down.
	 * Requires a reindex of indexables.
	 *
	 * @return void
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column(
			$table_name,
			'is_publicly_viewable'
		);
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'Indexable' );
	}
}



