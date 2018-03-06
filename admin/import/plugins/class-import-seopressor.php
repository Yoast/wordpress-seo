<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_SEOPressor
 *
 * Class with functionality to import Yoast SEO settings from SEOpressor.
 */
class WPSEO_Import_SEOPressor implements WPSEO_Plugin_Importer {

	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $wpdb;

	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * Returns the plugin name.
	 *
	 * @return string Plugin name.
	 */
	public function plugin_name() {
		return 'SEOpressor';
	}

	/**
	 * WPSEO_Import_SEOPressor constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->wpdb = $wpdb;
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Imports the post meta values to Yoast SEO.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		// Query for all the posts that have an _seop_settings meta set.
		$query_posts = new WP_Query( 'post_type=any&meta_key=_seop_settings&order=ASC&fields=ids&nopaging=true' );
		foreach ( $query_posts->posts as $key => $post_id ) {
			$this->import_post_focus_keywords( $post_id );
			$this->import_seopressor_post_settings( $post_id );
		}
		return $this->status->set_status( true );
	}

	/**
	 * Removes all the post meta fields SEOpressor creates.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		// If we get to replace the data, let's do some proper cleanup.
		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_seop_%'" );
		return $this->status->set_status( true );
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	private function detect_helper() {
		$result = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_seop_settings'" );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}

	/**
	 * Imports the data. SEOpressor stores most of the data in one post array, this loops over it.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	private function import_seopressor_post_settings( $post_id ) {
		$settings = get_post_meta( $post_id, '_seop_settings', true );

		foreach (
			array(
				'fb_description'   => 'opengraph-description',
				'fb_title'         => 'opengraph-title',
				'fb_type'          => 'og_type',
				'fb_img'           => 'opengraph-image',
				'meta_title'       => 'title',
				'meta_description' => 'metadesc',
				'meta_canonical'   => 'canonical',
				'tw_description'   => 'twitter-description',
				'tw_title'         => 'twitter-title',
				'tw_image'         => 'twitter-image',
			) as $seopressor_key => $yoast_key ) {
			$this->import_meta_helper( $seopressor_key, $yoast_key, $settings, $post_id );
		}

		if ( isset( $settings['meta_rules'] ) ) {
			$this->import_post_robots( $settings['meta_rules'], $post_id );
		}
	}

	/**
	 * Represents the Helper function to store the meta value should it be set in SEOPressor's settings.
	 *
	 * @param string $seo_pressor_key     The key in the SEOPressor array.
	 * @param string $yoast_key           The identifier we use in our meta settings.
	 * @param array  $seopressor_settings The array of settings for this post in SEOpressor.
	 * @param int    $post_id             The post ID.
	 *
	 * @return void
	 */
	private function import_meta_helper( $seo_pressor_key, $yoast_key, $seopressor_settings, $post_id ) {
		if ( ! empty( $seopressor_settings[ $seo_pressor_key ] ) ) {
			WPSEO_Meta::set_value( $yoast_key, $seopressor_settings[ $seo_pressor_key ], $post_id );
		}
	}

	/**
	 * Imports the focus keywords, and stores them for later use.
	 *
	 * @param integer $post_id Post ID.
	 *
	 * @return void
	 */
	private function import_post_focus_keywords( $post_id ) {
		// Import the focus keyword.
		$focuskw = trim( get_post_meta( $post_id, '_seop_kw_1', true ) );
		WPSEO_Meta::set_value( 'focuskw', $focuskw, $post_id );

		// Import additional focus keywords for use in premium.
		$focuskw2 = trim( get_post_meta( $post_id, '_seop_kw_2', true ) );
		$focuskw3 = trim( get_post_meta( $post_id, '_seop_kw_3', true ) );

		$focus_keywords = array();
		if ( ! empty( $focuskw2 ) ) {
			$focus_keywords[] = $focuskw2;
		}
		if ( ! empty( $focuskw3 ) ) {
			$focus_keywords[] = $focuskw3;
		}

		if ( $focus_keywords !== array() ) {
			WPSEO_Meta::set_value( 'focuskeywords', wp_json_encode( $focus_keywords ), $post_id );
		}
	}

	/**
	 * Retrieves the SEOpressor robot value and map this to Yoast SEO values.
	 *
	 * @param string  $meta_rules The meta rules taken from the SEOpressor settings array.
	 * @param integer $post_id    The post id of the current post.
	 *
	 * @return void
	 */
	private function import_post_robots( $meta_rules, $post_id ) {
		$seopressor_robots = explode( '#|#|#', $meta_rules );
		$robot_value = $this->get_robot_value( $seopressor_robots );

		// Saving the new meta values for Yoast SEO.
		WPSEO_Meta::set_value( 'meta-robots-noindex', $robot_value['index'], $post_id );
		WPSEO_Meta::set_value( 'meta-robots-nofollow', $robot_value['follow'], $post_id );
		WPSEO_Meta::set_value( 'meta-robots-adv', $robot_value['advanced'], $post_id );
	}

	/**
	 * Gets the robot config by given SEOpressor robots value.
	 *
	 * @param array $seopressor_robots The value in SEOpressor that needs to be converted to the Yoast format.
	 *
	 * @return array The robots values in Yoast format.
	 */
	private function get_robot_value( $seopressor_robots ) {
		$return = array(
			'index'    => 2,
			'follow'   => 0,
			'advanced' => '',
		);

		if ( in_array( 'noindex', $seopressor_robots, true ) ) {
			$return['index'] = 1;
		}
		if ( in_array( 'nofollow', $seopressor_robots, true ) ) {
			$return['follow'] = 1;
		}
		foreach ( array( 'noarchive', 'nosnippet', 'noimageindex' ) as $needle ) {
			if ( in_array( $needle, $seopressor_robots, true ) ) {
				$return['advanced'] .= $needle . ',';
			}
		}
		$return['advanced'] = rtrim( $return['advanced'], ',' );

		return $return;
	}
}
