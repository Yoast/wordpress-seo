<?php
/**
 * File with the class to handle data from WooThemes SEO.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_WooThemes_SEO
 *
 * Class with functionality to import & clean WooThemes SEO post metadata.
 */
class WPSEO_Import_WooThemes_SEO extends WPSEO_Plugin_Importer {
	/**
	 * The plugin name.
	 *
	 * @var string
	 */
	protected $plugin_name = 'WooThemes SEO';

	/**
	 * Meta key, used in SQL LIKE clause for detect query.
	 *
	 * @var string
	 */
	protected $meta_key = 'seo_title';

	/**
	 * The arrays of keys to clone into Yoast SEO.
	 *
	 * @var array
	 */
	protected $clone_keys = array(
		array(
			'old_key' => 'seo_description',
			'new_key' => 'metadesc',
		),
		array(
			'old_key' => 'seo_title',
			'new_key' => 'title',
		),
		array(
			'old_key' => 'seo_noindex',
			'new_key' => 'meta-robots-noindex',
		),
		array(
			'old_key' => 'seo_follow',
			'new_key' => 'meta-robots-nofollow',
		),
	);

	/**
	 * Holds the meta fields we can delete after import.
	 *
	 * @var array
	 */
	protected $cleanup_metas = array(
		'seo_follow',
		'seo_noindex',
		'seo_title',
		'seo_description',
		'seo_keywords',
	);

	/**
	 * Holds the options we can delete after import.
	 *
	 * @var array
	 */
	protected $cleanup_options = array(
		'seo_woo_archive_layout',
		'seo_woo_single_layout',
		'seo_woo_page_layout',
		'seo_woo_wp_title',
		'seo_woo_meta_single_desc',
		'seo_woo_meta_single_key',
		'seo_woo_home_layout',
	);

	/**
	 * Cleans up the WooThemes SEO settings.
	 *
	 * @return bool Cleanup status.
	 */
	protected function cleanup() {
		$result = $this->cleanup_meta();
		if ( $result ) {
			$this->cleanup_options();
		}
		return $result;
	}

	/**
	 * Removes the Woo Options from the database.
	 *
	 * @return void
	 */
	private function cleanup_options() {
		foreach ( $this->cleanup_options as $option ) {
			delete_option( $option );
		}
	}

	/**
	 * Removes the post meta fields from the database.
	 *
	 * @return bool Cleanup status.
	 */
	private function cleanup_meta() {
		foreach ( $this->cleanup_metas as $key ) {
			$result = $this->cleanup_meta_key( $key );
			if ( ! $result ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Removes a single meta field from the postmeta table in the database.
	 *
	 * @param string $key The meta_key to delete.
	 *
	 * @return bool Cleanup status.
	 */
	private function cleanup_meta_key( $key ) {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->postmeta} WHERE meta_key = %s",
				$key
			)
		);
		return $wpdb->__get( 'result' );
	}

}
