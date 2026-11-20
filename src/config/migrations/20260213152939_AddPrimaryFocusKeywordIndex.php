<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddPrimaryFocusKeywordIndex class.
 *
 * Adds a composite index to improve performance of duplicate focus keyword lookups.
 * This index speeds up queries that check for existing usage of focus keywords,
 * reducing query time from ~1.5s to ~0.001s on large sites (800K+ rows).
 *
 * @see https://github.com/Yoast/wordpress-seo/issues/22933
 */
class AddPrimaryFocusKeywordIndex extends Migration {

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
		$this->add_index(
			$this->get_table_name(),
			[ 'primary_focus_keyword', 'object_type', 'post_status', 'object_id' ],
			[ 'name' => 'primary_focus_keyword_and_object_type' ]
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$this->remove_index(
			$this->get_table_name(),
			[ 'primary_focus_keyword', 'object_type', 'post_status', 'object_id' ],
			[ 'name' => 'primary_focus_keyword_and_object_type' ]
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
