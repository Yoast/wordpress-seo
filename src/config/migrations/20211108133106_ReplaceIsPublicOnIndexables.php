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
 * ReplaceIsPublicOnIndexables class.
 */
class ReplaceIsPublicOnIndexables extends Migration {

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

		$this->rename_column(
			$table_name,
			'is_public',
			'is_publicly_viewable'
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

		$this->rename_column(
			$table_name,
			'calculated_no_index',
			'is_public'
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



