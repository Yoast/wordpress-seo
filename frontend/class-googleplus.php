<?php
/**
 * @package Frontend
 *
 * This code handles the Google+ specific output that's not covered by OpenGraph.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_GooglePlus' ) ) {
	class WPSEO_GooglePlus extends WPSEO_Frontend {

		/**
		 * @var    object    Instance of this class
		 */
		public static $instance;

		/**
		 * Class constructor.
		 */
		public function __construct() {
			add_action( 'wpseo_googleplus', array( $this, 'google_plus_title' ), 10 );
			add_action( 'wpseo_googleplus', array( $this, 'description' ), 11 );
			add_action( 'wpseo_googleplus', array( $this, 'google_plus_image' ), 12 );

			add_action( 'wpseo_head', array( $this, 'output' ), 40 );
		}

		/**
		 * Get the singleton instance of this class
		 *
		 * @return object
		 */
		public static function get_instance() {
			if ( ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Output the Google+ specific content
		 */
		public function output() {
			/**
			 * Action: 'wpseo_googleplus' - Hook to add all Google+ specific output to.
			 */
			do_action( 'wpseo_googleplus' );
		}

		/**
		 * Output the Google+ specific description
		 */
		public function description() {
			if ( is_singular() ) {
				$desc = WPSEO_Meta::get_value( 'google-plus-description' );

				// Replace WP SEO Variables
				$desc = wpseo_replace_vars( $desc, get_post() );
				
				// Use metadesc if $desc is empty
				if ( $desc === '' ) {
					$desc = $this->metadesc( false );
				}
				
				// google meta description is still blank so grab it from get_the_excerpt()
				if ( ! is_string( $desc ) || ( is_string( $desc ) && $desc === '' ) ) {
					$desc = str_replace( '[&hellip;]', '&hellip;', strip_tags( get_the_excerpt() ) );
				}
				
				// Strip shortcodes if any
				$desc = strip_shortcodes( $desc );
				
				/**
				 * Filter: 'wpseo_googleplus_desc' - Allow developers to change the Google+ specific description output
				 *
				 * @api string $desc The description string
				 */
				$desc = trim( apply_filters( 'wpseo_googleplus_desc', $desc ) );
				
				if ( is_string( $desc ) && '' !== $desc ) {
					echo '<meta itemprop="description" content="' . esc_attr( $desc ) . '">' . "\n";
				}
			}
		}

		/**
		 * Output the Google+ specific title
		 */
		public function google_plus_title() {
			if ( is_singular() ) {
				$title = WPSEO_Meta::get_value( 'google-plus-title' );
                                if ( $title === '' ) {
                                        $title = $this->title( '' );
                                } else {
                                        // Replace WP SEO Variables
                                        $title = wpseo_replace_vars( $title, get_post() );
                                }

				/**
				 * Filter: 'wpseo_googleplus_title' - Allow developers to change the Google+ specific title
				 *
				 * @api string $title The title string
				 */
				$title = trim( apply_filters( 'wpseo_googleplus_title', $title ) );

				if ( is_string( $title ) && $title !== '' ) {
					$title = wpseo_replace_vars( $title, get_post() );

					echo '<meta itemprop="name" content="' . esc_attr( $title ) . '">' . "\n";
				}
			}
		}

		/**
		 * Output the Google+ specific image
		 */
		public function google_plus_image() {

			global $post;
			
			if ( is_singular() ) {
				$image = WPSEO_Meta::get_value( 'google-plus-image' );
		
				if ( (!is_string( $image ) || $image === '' ) && function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
					/**
					 * Filter: 'wpseo_google_plus_image_size' - Allow changing the image size used for Google plus sharing
					 *
					 * @api string $unsigned Size string
					 */
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_google_plus_image_size', 'original' ) );
					$image = $image[0];
				}
		
				if (!is_string( $image ) || $image === '' ) {
					/**
					 * Filter: 'wpseo_pre_analysis_post_content' - Allow filtering the content before analysis
					 *
					 * @api string $post_content The Post content string
					 *
					 * @param object $post The post object.
					 */
					$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );
			
					if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
						foreach ( $matches[0] as $img ) {
							if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) ) {
								$image = $match[2];
							}
						}
					}
				}
				
				/**
				 * Filter: 'wpseo_googleplus_image' - Allow changing the Google+ image
				 *
				 * @api string $img Image URL string
				 */
				$image = trim( apply_filters( 'wpseo_googleplus_image', $image ) );
				
				if ( is_string( $image ) && $image !== '' ) {
					echo '<meta itemprop="image" content="' . esc_url( $image ) . '">' . "\n";
				}
			}
		}
	}
} // end if class exists
