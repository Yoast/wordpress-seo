<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_WPSEO
 *
 * Class with functionality to import Yoast SEO settings from wpSEO
 */
class WPSEO_Import_WPSEO extends WPSEO_Import_External {

	/**
	 * @var array
	 */
	private $robot_values = array(
		1 => array( 'index' => 2, 'follow' => 0 ),
		2 => array( 'index' => 2, 'follow' => 1 ),
		3 => array( 'index' => 1, 'follow' => 0 ),
		4 => array( 'index' => 1, 'follow' => 0 ),
		5 => array( 'index' => 1, 'follow' => 1 ),
		6 => array( 'index' => 2, 'follow' => 0 ),
	);


	/**
	 * Import All In One SEO settings
	 */
	public function __construct() {
		parent::__construct();

		$this->import_post_metas();
		$this->import_taxonomy_metas();

		$this->set_msg( __( 'wpSEO data successfully imported. ', 'wordpress-seo' ) );
	}

	/**
	 * Import the post meta values
	 */
	private function import_post_metas() {
		WPSEO_Meta::replace_meta( '_wpseo_edit_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );
		WPSEO_Meta::replace_meta( '_wpseo_edit_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		WPSEO_Meta::replace_meta( '_wpseo_edit_description', WPSEO_Meta::$meta_prefix . 'keywords', $this->replace );
		WPSEO_Meta::replace_meta( '_wpseo_edit_canonical', WPSEO_Meta::$meta_prefix . 'canonical', $this->replace );

		$this->import_post_robots();

	}

	/**
	 * Importing the robot values from WPSEO plugin. These have to be converted
	 */
	private function import_post_robots() {
		$query_posts  = new WP_Query( 'post_type=any&meta_key=_wpseo_edit_robots&order=ASC' );

		if ( ! empty( $query_posts->posts ) ) {
			foreach ( $query_posts->posts as $post ) {
				$wpseo_robots = get_post_meta( $post->ID, '_wpseo_edit_robots', true );

				if ( $robot_value = $this->robot_values[ $wpseo_robots ] ) {
					// Saving the new meta values for Yoast SEO.
					WPSEO_Meta::set_value( $robot_value['index'], 'meta-robots-noindex', $post->ID );
					WPSEO_Meta::set_value( $robot_value['follow'], 'meta-robots-nofollow', $post->ID );
				}

				if ( $this->replace ) {
					// Remove post meta value.
					delete_post_meta( $post->ID, '_wpseo_edit_robots' );
				}
			}
		}
	}

	/**
	 * Import the taxonomy metas
	 */
	private function import_taxonomy_metas() {
		$terms    = get_terms( get_taxonomies(), array( 'hide_empty' => false ) );
		$tax_meta = get_option( 'wpseo_taxonomy_meta' );

		foreach ( $terms as $term ) {
			$description = get_option( 'wpseo_' . $term->taxonomy . '_' . $term->term_id, false );
			if ( $description !== false ) {
				// Import description.
				$tax_meta[ $term->taxonomy ][ $term->term_id ]['wpseo_desc'] = $description;

				if ( $this->replace ) {
					delete_option( 'wpseo_' . $term->taxonomy . '_' . $term->term_id );
				}
			}

			$wpseo_robots = get_option( 'wpseo_' . $term->taxonomy . '_' . $term->term_id . '_robots', false );
			if ( $wpseo_robots !== false ) {
				$new_robot_value = ( in_array( $wpseo_robots, array( 1, 2, 6 ) ) ) ? 'index' : 'noindex';

				$tax_meta[ $term->taxonomy ][ $term->term_id ]['wpseo_noindex'] = $new_robot_value;

				if ( $this->replace ) {
					delete_option( 'wpseo_' . $term->taxonomy . '_' . $term->term_id . '_robots' );
				}
			}
		}

		update_option( 'wpseo_taxonomy_meta', $tax_meta );
	}

}
