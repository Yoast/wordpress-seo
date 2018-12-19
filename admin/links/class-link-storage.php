<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the storage of an seo link.
 */
class WPSEO_Link_Storage implements WPSEO_Installable {

	const TABLE_NAME = 'yoast_seo_links';

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
				'id bigint(20) unsigned NOT NULL AUTO_INCREMENT',
				'url varchar(255) NOT NULL',
				'post_id bigint(20) unsigned NOT NULL',
				'target_post_id bigint(20) unsigned NOT NULL',
				'type VARCHAR(8) NOT NULL',
			),
			array(
				'PRIMARY KEY (id)',
				'KEY link_direction (post_id, type)',
			)
		);
	}

	/**
	 * Returns an array of links from the database.
	 *
	 * @param int $post_id The post to get the links for.
	 *
	 * @return WPSEO_Link[] The links connected to the post.
	 */
	public function get_links( $post_id ) {
		global $wpdb;

		$results = $this->database_proxy->get_results(
			$wpdb->prepare(
				'
				SELECT url, post_id, target_post_id, type
				FROM ' . $this->get_table_name() . '
				WHERE post_id = %d',
				$post_id
			)
		);

		if ( $this->database_proxy->has_error() ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}

		$links = array();
		foreach ( $results as $link ) {
			$links[] = WPSEO_Link_Factory::get_link( $link->url, $link->target_post_id, $link->type );
		}

		return $links;
	}

	/**
	 * Walks the given links to save them.
	 *
	 * @param integer      $post_id The post id to save.
	 * @param WPSEO_Link[] $links   The link to save.
	 *
	 * @return void
	 */
	public function save_links( $post_id, array $links ) {
		array_walk( $links, array( $this, 'save_link' ), $post_id );
	}

	/**
	 * Removes all records for given post_id.
	 *
	 * @param int $post_id The post_id to remove the records for.
	 *
	 * @return int|false The number of rows updated, or false on error.
	 */
	public function cleanup( $post_id ) {
		$is_deleted = $this->database_proxy->delete(
			array( 'post_id' => $post_id ),
			array( '%d' )
		);

		if ( $is_deleted === false ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}

		return $is_deleted;
	}

	/**
	 * Inserts the link into the database.
	 *
	 * @param WPSEO_Link $link     The link to save.
	 * @param int        $link_key The link key. Unused.
	 * @param int        $post_id  The post id to save the link for.
	 *
	 * @return void
	 */
	protected function save_link( WPSEO_Link $link, $link_key, $post_id ) {
		$inserted = $this->database_proxy->insert(
			array(
				'url'            => $link->get_url(),
				'post_id'        => $post_id,
				'target_post_id' => $link->get_target_post_id(),
				'type'           => $link->get_type(),
			),
			array( '%s', '%d', '%d', '%s' )
		);

		if ( $inserted === false ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}
	}
}
