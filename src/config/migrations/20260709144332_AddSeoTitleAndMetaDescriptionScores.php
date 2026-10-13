<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * AddSeoTitleAndMetaDescriptionScores class.
 */
class AddSeoTitleAndMetaDescriptionScores extends Migration {

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

		$this->add_column(
			$table_name,
			'seo_title_score',
			'integer',
			[
				'null'  => true,
				'limit' => 3,
			],
		);

		$this->add_column(
			$table_name,
			'meta_description_score',
			'integer',
			[
				'null'  => true,
				'limit' => 3,
			],
		);
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column( $table_name, 'seo_title_score' );
		$this->remove_column( $table_name, 'meta_description_score' );
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
