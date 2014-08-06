<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Social_Admin' ) ) {
	/**
	 * This class adds the Social tab to the WP SEO metabox and makes sure the settings are saved.
	 */
	class WPSEO_Social_Admin extends WPSEO_Metabox {

		/**
		 * Class constructor
		 */
		public function __construct() {
			add_action( 'wpseo_tab_translate', array( $this, 'translate_meta_boxes' ) );
			add_action( 'wpseo_tab_header', array( $this, 'tab_header' ), 60 );
			add_action( 'wpseo_tab_content', array( $this, 'tab_content' ) );
			add_filter( 'wpseo_save_metaboxes', array( $this, 'save_meta_boxes' ), 10, 1 );
		}

		/**
		 * Translate text strings for use in the meta box
		 *
		 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
		 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
		 */
		public static function translate_meta_boxes() {
			self::$meta_fields['social']['opengraph-title']['title']       = __( 'Facebook Title', 'wordpress-seo' );
			self::$meta_fields['social']['opengraph-title']['description'] = __( 'If you don\'t want to use the post title for sharing the post on Facebook but instead want another title there, write it here.', 'wordpress-seo' );

			self::$meta_fields['social']['opengraph-description']['title']       = __( 'Facebook Description', 'wordpress-seo' );
			self::$meta_fields['social']['opengraph-description']['description'] = __( 'If you don\'t want to use the meta description for sharing the post on Facebook but want another description there, write it here.', 'wordpress-seo' );

			self::$meta_fields['social']['opengraph-image']['title'] 	   = __( 'Facebook Image', 'wordpress-seo' );
			self::$meta_fields['social']['opengraph-image']['description'] = __( 'If you want to override the Facebook image for this post, upload / choose an image or add the URL here.', 'wordpress-seo' );

			self::$meta_fields['social']['google-plus-title']['title'] 	   = __( 'Google+ Title', 'wordpress-seo' );
			self::$meta_fields['social']['google-plus-title']['description'] = __( 'If you don\'t want to use the post title for sharing the post on Google+ but instead want another title there, write it here.', 'wordpress-seo' );

			self::$meta_fields['social']['google-plus-description']['title'] 	   = __( 'Google+ Description', 'wordpress-seo' );
			self::$meta_fields['social']['google-plus-description']['description'] = __( 'If you don\'t want to use the meta description for sharing the post on Google+ but want another description there, write it here.', 'wordpress-seo' );

			self::$meta_fields['social']['google-plus-image']['title'] 	   = __( 'Google+ Image', 'wordpress-seo' );
			self::$meta_fields['social']['google-plus-image']['description'] = __( 'If you want to override the image for this post that Google+ will use, upload / choose an image or add the URL here. Note that it will otherwise default to the Facebook one above.', 'wordpress-seo' );
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
			foreach ( $this->get_meta_field_defs( 'social' ) as $meta_key => $meta_field ) {
				$content .= $this->do_meta_box( $meta_field, $meta_key );
			}
			$this->do_tab( 'social', __( 'Social', 'wordpress-seo' ), $content );
		}


		/**
		 * Filter over the meta boxes to save, this function adds the Social meta boxes.
		 *
		 * @param   array $field_defs Array of metaboxes to save.
		 * @return  array
		 */
		public function save_meta_boxes( $field_defs ) {
			return array_merge( $field_defs, $this->get_meta_field_defs( 'social' ) );
		}


		/********************** DEPRECATED METHODS **********************/

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
			_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_meta_field_defs()' );
			return $this->get_meta_field_defs( 'social' );
		}

	} /* End of class */

} /* End of class-exists wrapper */