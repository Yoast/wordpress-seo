<?php
/**
 * File with the class to handle data from Squirrly.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_Squirrly
 *
 * Class with functionality to import & clean Squirrly post metadata.
 */
class WPSEO_Import_Squirrly extends WPSEO_Plugin_Importer {
	/**
	 * The plugin name.
	 *
	 * @var string
	 */
	protected $plugin_name = 'Squirrly SEO';

	/**
	 * Holds the name of the table Squirrly uses to store data.
	 *
	 * @var string
	 */
	protected $table_name;

	public function __construct() {
		parent::__construct();

		global $wpdb;
		$this->table_name = $wpdb->prefix . 'qss';
	}

	/**
	 * Imports the post meta values to Yoast SEO.
	 *
	 * @return bool Import success status.
	 */
	protected function import() {
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT post_id FROM {$this->table_name} WHERE blog_id = %d",
				get_current_blog_id()
			)
		);
		foreach( $results as $post ) {
			$return = $this->import_squirrly_post_values( $post->post_id );
			if ( ! $return ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Removes all the post meta fields SEOpressor creates.
	 *
	 * @return bool Cleanup status.
	 */
	protected function cleanup() {
		global $wpdb;

		// If we can clean, let's clean.
		$wpdb->query( "DROP TABLE " . $this->table_name );

		// If we can still see the table, something went wrong.
		if ( $this->detect() ) {
			$this->cleanup_error_msg();
			return false;
		}

		return true;
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	protected function detect() {
		global $wpdb;

		$result = $wpdb->get_var( "SHOW TABLES LIKE '{$this->table_name}'" );
		if ( is_wp_error( $result ) || is_null( $result ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Imports the data of a post out of Squirrly's DB table.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return bool Import status.
	 */
	private function import_squirrly_post_values( $post_id ) {
		$data = $this->retrieve_post_data( $post_id );
		if ( ! $data ) {
			return false;
		}

		$data['focuskw'] = $this->maybe_add_focus_kw( $post_id );

		foreach (
			array(
				'noindex'        => 'meta-robots-noindex',
				'nofollow'       => 'meta-robots-nofollow',
				'title'          => 'title',
				'description'    => 'metadesc',
				'canonical'      => 'canonical',
				'cornerstone'    => '_yst_is_cornerstone',
				'tw_media'       => 'twitter-image',
				'tw_title'       => 'twitter-title',
				'tw_description' => 'twitter-description',
				'og_title'       => 'opengraph-title',
				'og_description' => 'opengraph-description',
				'og_media'       => 'opengraph-image',
				'focuskw'        => 'focuskw',
			) as $squirrly_key => $yoast_key
		) {
			$this->import_meta_helper( $squirrly_key, $yoast_key, $data, $post_id );
		}
		return true;
	}

	/**
	 * Retrieves the Squirrly SEO data for a post from the DB.
	 *
	 * @param int $post_id Post ID
	 *
	 * @return array|bool
	 */
	private function retrieve_post_data( $post_id ) {
		global $wpdb;
		$data = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT seo FROM {$this->table_name} WHERE blog_id = %d AND post_id = %d",
				get_current_blog_id(),
				(int) $post_id
			)
		);
		if ( ! $data || is_wp_error( $data ) ) {
			return false;
		}
		$data = maybe_unserialize( $data );
		return $data;
	}

	/**
	 * Squirrly stores the focus keyword in post meta.
	 *
	 * @param int $post_id Post ID
	 *
	 * @return string
	 */
	private function maybe_add_focus_kw( $post_id ) {
		$focuskw = get_post_meta( $post_id, '_sq_post_keyword', true );
		if ( $focuskw ) {
			$focuskw = json_decode( $focuskw );
			return $focuskw->keyword;
		}
		return '';
	}
}
