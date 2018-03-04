<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_WPSEO
 *
 * Class with functionality to import Yoast SEO settings from wpSEO
 */
class WPSEO_Import_WPSEO implements WPSEO_Plugin_Importer {
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $wpdb;

	/**
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * The values 1 - 6 are the configured values from wpSEO. This array will map the values of wpSEO to our values.
	 *
	 * There are some double array like 1-6 and 3-4. The reason is they only set the index value. The follow value is
	 * the default we use in the cases there isn't a follow value present.
	 *
	 * @var array
	 */
	private $robot_values = array(
		// In wpSEO: index, follow.
		1 => array(
			'index'  => 2,
			'follow' => 0,
		),
		// In wpSEO: index, nofollow.
		2 => array(
			'index'  => 2,
			'follow' => 1,
		),
		// In wpSEO: noindex.
		3 => array(
			'index'  => 1,
			'follow' => 0,
		),
		// In wpSEO: noindex, follow.
		4 => array(
			'index'  => 1,
			'follow' => 0,
		),
		// In wpSEO: noindex, nofollow.
		5 => array(
			'index'  => 1,
			'follow' => 1,
		),
		// In wpSEO: index.
		6 => array(
			'index'  => 2,
			'follow' => 0,
		),
	);

	/**
	 * WPSEO_Import_WPSEO constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}
		return $this->status->set_status( true );
	}

	/**
	 * Import wpSEO settings
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->import_post_metas();
		$this->import_taxonomy_metas();

		return $this->status->set_status( true );
	}

	/**
	 * Removes wpseo.de post meta's.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->cleanup_term_meta();
		$this->cleanup_post_meta();

		return $this->status->set_status( true );
	}

	/**
	 * Returns the plugin name.
	 *
	 * @return string
	 */
	public function plugin_name() {
		return 'wpSEO.de';
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return bool
	 */
	private function detect_helper() {
		$count = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_wpseo_edit_%'" );
		if ( $count === '0' ) {
			return false;
		}

		return true;
	}

	/**
	 * Import the post meta values to Yoast SEO by replacing the wpSEO fields by Yoast SEO fields
	 */
	private function import_post_metas() {
		if ( $this->detect_helper() ) {
			WPSEO_Meta::replace_meta( '_wpseo_edit_title', WPSEO_Meta::$meta_prefix . 'title', false );
			WPSEO_Meta::replace_meta( '_wpseo_edit_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
			WPSEO_Meta::replace_meta( '_wpseo_edit_keywords', WPSEO_Meta::$meta_prefix . 'keywords', false );
			WPSEO_Meta::replace_meta( '_wpseo_edit_canonical', WPSEO_Meta::$meta_prefix . 'canonical', false );

			$this->import_post_robots();
		}
	}

	/**
	 * Importing the robot values from WPSEO plugin. These have to be converted to the Yoast format.
	 */
	private function import_post_robots() {
		$query_posts = new WP_Query( 'post_type=any&meta_key=_wpseo_edit_robots&order=ASC&fields=ids&nopaging=true' );

		if ( ! empty( $query_posts->posts ) ) {
			foreach ( array_values( $query_posts->posts ) as $post_id ) {
				$this->import_post_robot( $post_id );
			}
		}
	}

	/**
	 * Getting the wpSEO robot value and map this to Yoast SEO values.
	 *
	 * @param integer $post_id The post id of the current post.
	 */
	private function import_post_robot( $post_id ) {
		$wpseo_robots = get_post_meta( $post_id, '_wpseo_edit_robots', true );
		$robot_value  = $this->get_robot_value( $wpseo_robots );

		// Saving the new meta values for Yoast SEO.
		WPSEO_Meta::set_value( 'meta-robots-noindex', $robot_value['index'], $post_id );
		WPSEO_Meta::set_value( 'meta-robots-nofollow', $robot_value['follow'], $post_id );
	}

	/**
	 * Import the taxonomy metas from wpSEO
	 */
	private function import_taxonomy_metas() {
		$terms    = get_terms( get_taxonomies(), array( 'hide_empty' => false ) );
		$tax_meta = get_option( 'wpseo_taxonomy_meta' );

		foreach ( $terms as $term ) {
			$this->import_taxonomy_description( $tax_meta, $term->taxonomy, $term->term_id );
			$this->import_taxonomy_robots( $tax_meta, $term->taxonomy, $term->term_id );
		}

		update_option( 'wpseo_taxonomy_meta', $tax_meta );
	}

	/**
	 * Import the meta description to Yoast SEO
	 *
	 * @param array  $tax_meta The array with the current metadata.
	 * @param string $taxonomy String with the name of the taxonomy.
	 * @param string $term_id  The ID of the current term.
	 */
	private function import_taxonomy_description( & $tax_meta, $taxonomy, $term_id ) {
		$description = get_option( 'wpseo_' . $taxonomy . '_' . $term_id, false );
		if ( $description !== false ) {
			// Import description.
			$tax_meta[ $taxonomy ][ $term_id ]['wpseo_desc'] = $description;
		}
	}

	/**
	 * Import the robot value to Yoast SEO
	 *
	 * @param array  $tax_meta The array with the current metadata.
	 * @param string $taxonomy String with the name of the taxonomy.
	 * @param string $term_id  The ID of the current term.
	 */
	private function import_taxonomy_robots( & $tax_meta, $taxonomy, $term_id ) {
		$wpseo_robots = get_option( 'wpseo_' . $taxonomy . '_' . $term_id . '_robots', false );
		if ( $wpseo_robots !== false ) {
			// The value 1, 2 and 6 are the index values in wpSEO.
			$new_robot_value = ( in_array( (int) $wpseo_robots, array( 1, 2, 6 ), true ) ) ? 'index' : 'noindex';

			$tax_meta[ $taxonomy ][ $term_id ]['wpseo_noindex'] = $new_robot_value;
		}
	}

	/**
	 * Delete the wpSEO taxonomy meta data.
	 *
	 * @param string $taxonomy String with the name of the taxonomy.
	 * @param string $term_id  The ID of the current term.
	 */
	private function delete_taxonomy_metas( $taxonomy, $term_id ) {
		delete_option( 'wpseo_' . $taxonomy . '_' . $term_id );
		delete_option( 'wpseo_' . $taxonomy . '_' . $term_id . '_robots' );
	}

	/**
	 * Getting the robot config by given wpSEO robots value.
	 *
	 * @param string $wpseo_robots The value in wpSEO that needs to be converted to the Yoast format.
	 *
	 * @return array
	 */
	private function get_robot_value( $wpseo_robots ) {
		if ( array_key_exists( $wpseo_robots, $this->robot_values ) ) {
			return $this->robot_values[ $wpseo_robots ];
		}

		return $this->robot_values[1];
	}

	/**
	 * Deletes wpSEO postmeta from the database.
	 */
	private function cleanup_post_meta() {
		// If we get to replace the data, let's do some proper cleanup.
		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_wpseo_edit_%'" );
	}

	/**
	 * Cleans up the wpSEO term meta.
	 */
	private function cleanup_term_meta() {
		$terms = get_terms( get_taxonomies(), array( 'hide_empty' => false ) );
		foreach ( $terms as $term ) {
			$this->delete_taxonomy_metas( $term->taxonomy, $term->term_id );
		}
	}
}
