<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * ReplaceHasPublicPostsOnIndexables class.
 */
class ReplaceHasPublicPostsOnIndexables extends Migration {

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
		$this->rename_column(
			$table_name,
			'has_public_posts',
			'number_of_publicly_viewable_posts'
		);

		$this->change_column(
			$table_name,
			'number_of_publicly_viewable_posts',
			'integer'
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$table_name = $this->get_table_name();
		$this->change_column(
			$table_name,
			'number_of_publicly_viewable_posts',
			'boolean',
			[
				'null'    => true,
				'default' => null,
			]
		);

		$this->rename_column(
			$table_name,
			'number_of_publicly_viewable_posts',
			'has_public_posts'
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
