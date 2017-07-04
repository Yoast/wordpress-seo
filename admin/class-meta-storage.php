<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link count storage.
 */
class WPSEO_Meta_Storage implements WPSEO_Installable {

	const TABLE_NAME = 'yoast_seo_meta';

	/** @var WPSEO_Database_Proxy */
	protected $database_proxy;

	/** @var null|string */
	protected $table_prefix;

	/**
	 * Sets the table prefix.
	 *
	 * @param string $table_prefix Optional. The prefix to use for the table.
	 */
	public function __construct( $table_prefix = null ) {
		if ( null === $table_prefix ) {
			$table_prefix = $GLOBALS['wpdb']->get_blog_prefix();
		}

		$this->table_prefix = $table_prefix;
		$this->database_proxy = new WPSEO_Database_Proxy( $GLOBALS['wpdb'], $this->get_table_name(), true );
	}

	/**
	 * Returns the table name to use.
	 *
	 * @return string The table name.
	 */
	public function get_table_name() {
		return $this->table_prefix . self::TABLE_NAME;
	}

	/**
	 * Creates the database table.
	 *
	 * @return boolean True if the table was created, false if something went wrong.
	 */
	public function install() {
		return $this->database_proxy->create_table(
			array(
				'object_id bigint(20) UNSIGNED NOT NULL',
				'internal_link_count int(10) UNSIGNED NOT NULL DEFAULT "0"',
				'incoming_link_count int(10) UNSIGNED NULL DEFAULT NULL',
			),
			array(
				'UNIQUE KEY object_id (object_id)',
			)
		);
	}

	/**
	 * Removes the record for given post_id.
	 *
	 * @param int $object_id The post_id to remove the record for.
	 *
	 * @return int|false The number of rows updated, or false on error.
	 */
	public function cleanup( $object_id ) {
		$deleted = $this->database_proxy->delete(
			array( 'object_id' => $object_id ),
			array( '%d' )
		);

		if ( $deleted === false ) {
			WPSEO_Meta_Table_Accessible::set_inaccessible();
		}

		return $deleted;
	}

	/**
	 * Saves the link count to the database.
	 *
	 * @param int   $meta_id   The id to save the link count for.
	 * @param array $meta_data The total amount of links.
	 */
	public function save_meta_data( $meta_id, array $meta_data ) {
		$inserted = $this->database_proxy->insert(
			array_merge(
				array( 'object_id' => $meta_id ),
				$meta_data
			),
			array( '%d', '%d' )
		);

		if ( $inserted === false ) {
			WPSEO_Meta_Table_Accessible::set_inaccessible();
		}
	}

	/**
	 * Updates the incoming link counts
	 *
	 * @param WPSEO_Link_Storage $storage The link storage object.
	 */
	public function update_incoming_link_counts( WPSEO_Link_Storage $storage ) {
		global $wpdb;

		$updated = $wpdb->query(
			$wpdb->prepare('
				UPDATE %1$s count_table 
				   SET count_table.incoming_link_count = ( 
				       SELECT COUNT(id) 
				         FROM %2$s links_table 
				        WHERE links_table.target_post_id = count_table.object_id 
				       ) 
				',
				$this->get_table_name(),
				$storage->get_table_name()
			)
		);

		if ( $updated === false ) {
			WPSEO_Meta_Table_Accessible::set_inaccessible();
		}
	}
}
