<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the storage of an seo link.
 */
class WPSEO_Link_Storage {

	const TABLE_NAME = 'yoast_seo_links';

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
	 * Creates the links table if it doesn't exist.
	 *
	 * @return boolean True if the table was created, false if something went wrong.
	 */
	public function create_table() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$create_table = sprintf( '
			CREATE TABLE IF NOT EXISTS %1$s (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                url varchar(255) NOT NULL,
                post_id bigint(20) unsigned NOT NULL,
                target_post_id bigint(20) unsigned NOT NULL,
                type VARCHAR(8) NOT NULL,
                PRIMARY KEY (id),
                KEY link_direction (post_id, type)
			) %2$s',
			$this->get_table_name(),
			$charset_collate
		);

		$suppressed = $wpdb->suppress_errors();
		$is_created = (bool) $wpdb->query( $create_table );
		$wpdb->suppress_errors( $suppressed );

		if ( $is_created === false ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}

		return $is_created;
	}

	/**
	 * Returns an array of links from the database.
	 *
	 * @param int $post_id The id to get the links for.
	 *
	 * @return array|null|object The resultset.
	 */
	public function get_links( $post_id ) {
		global $wpdb;

		$suppressed = $wpdb->suppress_errors();
		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT url, post_id, target_post_id, type
				FROM ' . $this->get_table_name() . '
				WHERE post_id = %d',
				$post_id
			)
		);
		$wpdb->suppress_errors( $suppressed );

		if ( $wpdb->last_error !== '' ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}

		return $results;
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
	 * Removes all record for given post_id.
	 *
	 * @param int $post_id The post_id to remove the records for.
	 *
	 * @return int|false The number of rows updated, or false on error.
	 */
	public function cleanup( $post_id ) {
		global $wpdb;

		$suppressed = $wpdb->suppress_errors();

		$is_deleted = $wpdb->delete(
			$this->get_table_name(),
			array( 'post_id' => $post_id ),
			array( '%d' )
		);

		$wpdb->suppress_errors( $suppressed );

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
		global $wpdb;

		$suppressed = $wpdb->suppress_errors();

		$inserted = $wpdb->insert(
			$this->get_table_name(),
			array(
				'url' => $link->get_url(),
				'post_id' => $post_id,
				'target_post_id' => $link->get_target_post_id(),
				'type' => $link->get_type(),
			),
			array( '%s', '%d', '%d', '%s' )
		);

		$wpdb->suppress_errors( $suppressed );

		if ( $inserted === false ) {
			WPSEO_Link_Table_Accessible::set_inaccessible();
		}
	}
}
