<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * This class adds the Social tab to the WP SEO metabox and makes sure the settings are saved.
 */
class WPSEO_Social_Admin extends WPSEO_Metabox {

	/**
	 * Class constructor
	 */
	public function __construct() {
		add_action( 'wpseo_tab_header', array( $this, 'tab_header' ), 60 );
		add_action( 'wpseo_tab_content', array( $this, 'tab_content' ) );
		add_filter( 'wpseo_save_metaboxes', array( $this, 'save_meta_boxes' ), 10, 1 );
	}

	/**
	 * Output the tab header for the Social tab
	 */
	public function tab_header() {
		echo '<li class="social"><a class="wpseo_tablink" href="#wpseo_social">' . __( 'Social', 'wordpress-seo' ) . '</a></li>';
	}

	/**
	 * Output the tab content
	 */
	public function tab_content() {
		$content = '';
		foreach ( $this->get_meta_field_defs( 'social' ) as $meta_box ) {
			$content .= $this->do_meta_box( $meta_box );
		}
		$this->do_tab( 'social', __( 'Social', 'wordpress-seo' ), $content );
	}


	/**
	 * Define the meta boxes for the Social tab
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Meta::get_meta_field_defs()
	 * @see WPSEO_Meta::get_meta_field_defs()
	 *
	 * @param	string	$post_type
	 * @return	array	Array containing the meta boxes
	 */
	public function get_meta_boxes( $post_type = 'post' ) {
		_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_meta_field_defs()' );
		return $this->get_meta_field_defs( 'social' );
	}

	/**
	 * Filter over the meta boxes to save, this function adds the Social meta boxes.
	 *
	 * @param array $mbs Array of metaboxes to save.
	 * @return array
	 */
	public function save_meta_boxes( $field_defs ) {
		return array_merge( $field_defs, $this->get_meta_field_defs( 'social' ) );
	}

}

$wpseo_social = new WPSEO_Social_Admin();