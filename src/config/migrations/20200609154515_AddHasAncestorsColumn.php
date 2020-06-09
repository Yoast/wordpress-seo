<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * Class AddHasAncestorsColumn.
 */
class AddHasAncestorsColumn extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * Migration up.
	 */
	public function up() {
		$this->add_column(
			Model::get_table_name( 'Indexable' ),
			'has_ancestors',
			'boolean',
			[
				'default' => false,
			]
		);
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$this->remove_column( Model::get_table_name( 'Indexable' ), 'has_ancestors' );
	}
}
