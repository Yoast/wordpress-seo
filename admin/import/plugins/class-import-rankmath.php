<?php
/**
 * File with the class to handle data from RankMath.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import RankMath post metadata.
 */
class WPSEO_Import_RankMath extends WPSEO_Plugin_Importer {

	/**
	 * The plugin name.
	 *
	 * @var string
	 */
	protected $plugin_name = 'RankMath';

	/**
	 * Meta key, used in SQL LIKE clause for delete query.
	 *
	 * @var string
	 */
	protected $meta_key = 'rank_math_%';

	/**
	 * Array of meta keys to detect and import.
	 *
	 * @var array
	 */
	protected $clone_keys = array(
		array(
			'old_key' => 'rank_math_description',
			'new_key' => 'metadesc',
		),
		array(
			'old_key' => 'rank_math_title',
			'new_key' => 'title',
		),
		array(
			'old_key' => 'rank_math_canonical_url',
			'new_key' => 'canonical',
		),
		array(
			'old_key' => 'rank_math_primary_category',
			'new_key' => 'primary_category',
		),
		array(
			'old_key' => 'rank_math_facebook_title',
			'new_key' => 'opengraph-title',
		),
		array(
			'old_key' => 'rank_math_facebook_description',
			'new_key' => 'opengraph-description',
		),
		array(
			'old_key' => 'rank_math_facebook_image',
			'new_key' => 'opengraph-image',
		),
		array(
			'old_key' => 'rank_math_facebook_image_id',
			'new_key' => 'opengraph-image-id',
		),
		array(
			'old_key' => 'rank_math_twitter_title',
			'new_key' => 'twitter-title',
		),
		array(
			'old_key' => 'rank_math_twitter_description',
			'new_key' => 'twitter-description',
		),
		array(
			'old_key' => 'rank_math_twitter_image',
			'new_key' => 'twitter-image',
		),
		array(
			'old_key' => 'rank_math_twitter_image_id',
			'new_key' => 'twitter-image-id',
		),
		array(
			'old_key' => 'rank_math_focus_keyword',
			'new_key' => 'focuskw'
		)
	);

	/**
	 * Handles post meta data to import.
	 *
	 * @return bool Import success status.
	 */
	protected function import() {
		global $wpdb;
		// Replace % with %% as their variables are the same except for that.
		$wpdb->query( "UPDATE $wpdb->postmeta SET meta_value = REPLACE( meta_value, '%', '%%' ) WHERE meta_key IN ( 'rank_math_description', 'rank_math_title' )" );

		$this->import_meta_robots();
		$return = $this->meta_keys_clone( $this->clone_keys );

		// Return %% to % so our import is non-destructive.
		$wpdb->query( "UPDATE $wpdb->postmeta SET meta_value = REPLACE( meta_value, '%%', '%' ) WHERE meta_key IN ( 'rank_math_description', 'rank_math_title' )" );

		if ( $return ) {
			$this->import_settings();
		}

		return $return;
	}

	/**
	 * RankMath stores robots meta quite differently, so we have to parse it out.
	 */
	private function import_meta_robots() {
		global $wpdb;
		$post_metas = $wpdb->get_results( "SELECT post_id, meta_value FROM $wpdb->postmeta WHERE meta_key = 'rank_math_robots'" );
		foreach ( $post_metas as $post_meta ) {
			$post_meta->meta_value = unserialize( $post_meta->meta_value );
			foreach ( array( 'noindex', 'nofollow' ) as $directive ) {
				$directive_key = array_search( $directive, $post_meta->meta_value );
				if ( $directive_key !== false ) {
					update_post_meta( $post_meta->post_id, '_yoast_wpseo_meta-robots-' . $directive, 1 );
					unset( $post_meta->meta_value[ $directive_key ] );
				}
			}
			if ( count( $post_meta->meta_value ) > 0 ) {
				$value = implode( ',', $post_meta->meta_value );
				update_post_meta( $post_meta->post_id, '_yoast_wpseo_meta-robots-adv', $value );
			}
		}
	}

	/**
	 * Imports some of the RankMath settings.
	 */
	private function import_settings() {
		$settings = array(
			'title_separator'      => 'separator',
			'homepage_title'       => 'title-home-wpseo',
			'homepage_description' => 'metadesc-home-wpseo',
			'author_archive_title' => 'title-author-wpseo',
			'date_archive_title'   => 'title-archive-wpseo',
			'search_title'         => 'title-search-wpseo',
			'404_title'            => 'title-404-wpseo'
		);
		$options  = get_option( 'rank-math-options-titles' );

		foreach ( $settings as $import_setting_key => $setting_key ) {
			$value = $options[ $import_setting_key ];
			// Make sure replace vars work
			$value = str_replace( '%', '%%', $value );
			WPSEO_Options::set( $setting_key, $value );
		}
	}
}
