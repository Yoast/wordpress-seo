<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class AddCollationToTables
 */
class AddCollationToTables extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 */
	public function up() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		if ( empty( $charset_collate ) ) {
			return;
		}

		$tables = [
			Yoast_Model::get_table_name( 'migrations' ),
			Yoast_Model::get_table_name( 'Indexable' ),
			Yoast_Model::get_table_name( 'Indexable_Hierarchy' ),
			Yoast_Model::get_table_name( 'Primary_Term' ),
		];

		foreach ( $tables as $table ) {
			$this->query( 'ALTER TABLE ' . $table . ' CONVERT TO ' . str_replace( 'DEFAULT ', '', $charset_collate ) );
		}
	}

	/**
	 * Migration down.
	 */
	public function down() {
		// No down required.
	}
}
