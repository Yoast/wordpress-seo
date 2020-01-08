<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastProminentWordIndexableColumn
 */
class WpYoastProminentWordIndexableColumn extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();

		$this->add_column( $table_name, 'prominent_words_version', 'integer', [
			'null'     => true,
			'limit'    => 11,
			'unsigned' => true,
			'default'  => null,
		] );

		$this->add_index(
			$table_name,
			'prominent_words_version',
			[
				'name' => 'prominent_words_version',
			]
		);
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column( $table_name, 'prominent_words_version' );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
