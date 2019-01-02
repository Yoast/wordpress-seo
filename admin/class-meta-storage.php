<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link count storage.
 */
class WPSEO_Meta_Storage implements WPSEO_Installable {

	const TABLE_NAME = 'yoast_seo_meta';

	/**
	 * @var WPSEO_Database_Proxy
	 */
	protected $database_proxy;

	/**
	 * @deprecated
	 *
	 * @var null|string
	 */
	protected $table_prefix;

	/**
	 * Initializes the database table.
	 *
	 * @param string $table_prefix Optional. Deprecated argument.
	 */
	public function __construct( $table_prefix = null ) {
		if ( $table_prefix !== null ) {
			_deprecated_argument( __METHOD__, 'WPSEO 7.4' );
		}

		$this->database_proxy = new WPSEO_Database_Proxy( $GLOBALS['wpdb'], self::TABLE_NAME, true );
	}

	/**
	 * Returns the table name to use.
	 *
	 * @return string The table name.
	 */
	public function get_table_name() {
		return $this->database_proxy->get_table_name();
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
				'internal_link_count int(10) UNSIGNED NULL DEFAULT NULL',
				'incoming_link_count int(10) UNSIGNED NULL DEFAULT NULL',
			),
			array(
				'UNIQUE KEY object_id (object_id)',
			)
		);
	}

	/**
	 * Saves the link count to the database.
	 *
	 * @param int   $meta_id   The id to save the link count for.
	 * @param array $meta_data The total amount of links.
	 */
	public function save_meta_data( $meta_id, array $meta_data ) {
		$where = array( 'object_id' => $meta_id );

		$saved = $this->database_proxy->upsert(
			array_merge( $where, $meta_data ),
			$where
		);

		if ( $saved === false ) {
			WPSEO_Meta_Table_Accessible::set_inaccessible();
		}
	}

	/**
	 * Updates the incoming link count
	 *
	 * @param array              $post_ids The posts to update the incoming link count for.
	 * @param WPSEO_Link_Storage $storage  The link storage object.
	 */
	public function update_incoming_link_count( array $post_ids, WPSEO_Link_Storage $storage ) {
		global $wpdb;

		$query = $wpdb->prepare(
			'
			SELECT COUNT( id ) AS incoming, target_post_id AS post_id
			FROM ' . $storage->get_table_name() . '
			WHERE target_post_id IN(' . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ')
			GROUP BY target_post_id',
			$post_ids
		);

		$results = $wpdb->get_results( $query );

		$post_ids_non_zero = array();
		foreach ( $results as $result ) {
			$this->save_meta_data( $result->post_id, array( 'incoming_link_count' => $result->incoming ) );
			$post_ids_non_zero[] = $result->post_id;
		}

		$post_ids_zero = array_diff( $post_ids, $post_ids_non_zero );
		foreach ( $post_ids_zero as $post_id ) {
			$this->save_meta_data( $post_id, array( 'incoming_link_count' => 0 ) );
		}
	}
}
