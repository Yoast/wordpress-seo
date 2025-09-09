<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddNumberOfPostsInTerms class.
 */
class AddNumberOfPostsInTerms extends Migration {

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
		$this->add_column(
			$this->get_table_name(),
			'post_count',
			'integer',
			[
				'null'     => true,
				'default'  => null,
			]
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$this->remove_column(
			$this->get_table_name(),
			'post_count'
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
