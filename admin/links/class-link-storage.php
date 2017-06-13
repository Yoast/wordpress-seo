<?php

class WPSEO_Link_Storage {

	const TABLE_NAME = 'yoast_seo_links';

	/**
	 * Sets the table prefix.
	 *
	 * @param string $table_prefix A possible prefix to use for the table.
	 */
	public function __construct( $table_prefix = '' ) {
		$this->table_prefix = $table_prefix;
	}

	/**
	 * Returns the table name with a possible prefix.
	 *
	 * @return string The prefixed table name.
	 */
	public function get_prefixed_table_name() {
		return $this->table_prefix . self::TABLE_NAME;
	}

	/**
	 * Creates the links table if it doesn't exist.
	 *
	 * @return int|false Number of rows affected/selected or false on error
	 */
	public function create_table() {
		global $wpdb;

		return $wpdb->query('
			CREATE TABLE IF NOT EXISTS `' . $this->get_prefixed_table_name() . '` (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `url` varchar(255) NOT NULL,
                `post_id` bigint(20) unsigned NOT NULL,
                `target_post_id` bigint(20) unsigned NOT NULL,
                `type` enum("internal","outbound") NOT NULL,
                PRIMARY KEY (`id`),
                KEY `link` (`post_id`,`target_post_id`)
			) ENGINE=MyISAM;
			'
		);
	}

	/**
	 * Returns an array of links from the database.
	 *
	 * @param int $post_id The id to get the links for.
	 *
	 * @return array|null|object The resultset
	 */
	public function get_links( $post_id ) {
		global $wpdb;

		return $wpdb->get_results(
			$wpdb->prepare( '
				SELECT url, post_id, target_post_id, type
				FROM ' . $this->get_prefixed_table_name() . '
				WHERE post_id = %s',
				$post_id
			)
		);
	}

	/**
	 * Walks the given links to save them.
	 *
	 * @param integer      $post_id
	 * @param WPSEO_Link[] $links
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

		return $wpdb->delete(
			$this->get_prefixed_table_name(),
			array(
				'post_id' => $post_id
			),
			array( '%d' )
		);
	}

	/**
	 * Inserts the link into the database.
	 *
	 * @param WPSEO_Link $link     The link to save.
	 * @param int        $link_key The link key. Unused.
	 * @param int        $post_id  The post id to save the link for.
	 */
	protected function save_link( WPSEO_Link $link, $link_key, $post_id ) {
		global $wpdb;

		$wpdb->insert(
			$this->get_prefixed_table_name(),
			array(
				'url' => $link->get_url(),
				'post_id' => $post_id,
				'target_post_id' => $link->get_target_post_id(),
				'type' => $link->get_type(),
			),
			array( '%s', '%d', '%d', '%s' )
		);
	}
}
