<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddTypePostIdTargetPostIdIndexableIdTargetIndexableIdToSEOLinks class.
 */
class AddTypePostIdTargetPostIdIndexableIdTargetIndexableIdToSEOLinks extends Migration {

	const INDEX_NAME = 'type_based_index';

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * The column names for the index.
	 *
	 * @var string[] $index_columns The columns to index.
	 */
	protected $index_columns = [
		'type',
		'target_post_id',
		'target_indexable_id',
		'indexable_id',
		'post_id',
	];

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {
		$this->add_index(
			$this->get_table_name(),
			$this->index_columns,
			[
				'name' => self::INDEX_NAME,
			]
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
			$this->index_columns,
			[
				'name' => self::INDEX_NAME,
			]
		);
	}

	/**
	 * Retrieves the table name to use for storing SEO links.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'SEO_Link' );
	}
}
