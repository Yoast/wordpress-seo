<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
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
		foreach ( $this->get_meta_boxes() as $meta_box ) {
			$content .= $this->do_meta_box( $meta_box );
		}
		$this->do_tab( 'social', __( 'Social', 'wordpress-seo' ), $content );
	}

	/**
	 * Define the meta boxes for the Social tab
	 *
	 * @return array Array containing the meta boxes
	 */
	public function get_meta_boxes() {
		$mbs                              = array();
		$mbs[ 'opengraph-description' ]   = array(
			"name"        => "opengraph-description",
			"type"        => "textarea",
			"std"         => "",
			"richedit"    => false,
			"title"       => __( "Facebook Description", 'wordpress-seo' ),
			"description" => __( 'If you don\'t want to use the meta description for sharing the post on Facebook but want another description there, write it here.', 'wordpress-seo' )
		);
		$mbs[ 'google-plus-description' ] = array(
			"name"        => "google-plus-description",
			"type"        => "textarea",
			"std"         => "",
			"richedit"    => false,
			"title"       => __( "Google+ Description", 'wordpress-seo' ),
			"description" => __( 'If you don\'t want to use the meta description for sharing the post on Google+ but want another description there, write it here.', 'wordpress-seo' )
		);
		return $mbs;
	}

	/**
	 * Filter over the meta boxes to save, this function adds the Social meta boxes.
	 *
	 * @param array $mbs Array of metaboxes to save.
	 * @return array
	 */
	public function save_meta_boxes( $mbs ) {
		return array_merge( $mbs, $this->get_meta_boxes() );
	}

}

$wpseo_social = new WPSEO_Social_Admin();