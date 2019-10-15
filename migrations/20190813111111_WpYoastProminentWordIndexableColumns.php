<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastProminentWordIndexableColumns
 */
class WpYoastProminentWordIndexableColumns extends Ruckusing_Migration_Base {

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

		$this->add_column( $table_name, 'prominent_words_vector_length', 'float' );
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
		$this->remove_column( $table_name, 'prominent_words_vector_length' );
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
