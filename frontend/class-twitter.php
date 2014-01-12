<?php
/**
 * @package Frontend
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


if ( ! class_exists( 'WPSEO_Twitter' ) ) {
	/**
	 * This class handles the Twitter card functionality.
	 *
	 * @link https://dev.twitter.com/docs/cards
	 */
	class WPSEO_Twitter extends WPSEO_Frontend {
	
		/**
		 * @var array $options Holds the options for the Twitter Card functionality
		 */
		var $options;
	
		/**
		 * Class constructor
		 */
		public function __construct() {
			$this->options = get_option( 'wpseo_social' );
	
			add_action( 'wpseo_head', array( $this, 'twitter' ), 40 );
		}
	
		/**
		 * Outputs the Twitter Card code on singular pages.
		 *
		 * @return mixed|false Only shows on singular pages, false on non-singular pages.
		 */
		public function twitter() {
			if ( ! is_singular() )
				return false;
	
			wp_reset_query();
	
			$this->type();
			$this->site_twitter();
			$this->site_domain();
			$this->author_twitter();
	
			// No need to show these when OpenGraph is also showing, as it'd be the same contents and Twitter
			// would fallback to OpenGraph anyway.	
			$options = WPSEO_Options::get_all();
			if ( $options['opengraph'] === false ) {
				$this->image();
				$this->twitter_description();
				$this->twitter_title();
				$this->twitter_url();
			}
	
			do_action( 'wpseo_twitter' );
		}
	
		/**
		 * Display the Twitter card type.
		 *
		 * This defaults to summary but can be filtered using the <code>wpseo_twitter_card_type</code> filter.
		 */
		public function type() {
			$type = apply_filters( 'wpseo_twitter_card_type', 'summary' );
			if ( ! in_array( $type, array( 'summary', 'summary_large_image', 'photo', 'gallery', 'app', 'player', 'product' ) ) )
				$type = 'summary';
	
			echo '<meta name="twitter:card" content="' . esc_attr( $type ) . '"/>' . "\n";
		}
	
		/**
		 * Displays the Twitter account for the site.
		 */
		public function site_twitter() {
			$site = apply_filters( 'wpseo_twitter_site', $this->options['twitter_site'] );
			if ( is_string( $site ) && $site !== '' )
				echo '<meta name="twitter:site" content="@' . esc_attr( $site ) . '"/>' . "\n";
		}
		
		/**
		 * Displays the domain tag for the site.
		 */
		public function site_domain() {
			$domain = apply_filters( 'wpseo_twitter_domain', get_bloginfo( 'name' ) );
			if ( is_string( $domain ) && $domain !== '' )
				echo '<meta name="twitter:domain" content="' . esc_attr( $domain ) . '"/>' . "\n";
		}
	
		/**
		 * Displays the authors Twitter account.
		 */
		public function author_twitter() {
			$twitter = ltrim( trim( get_the_author_meta( 'twitter' ) ), '@' );
			$twitter = apply_filters( 'wpseo_twitter_creator_account', $twitter );
	
			if ( $twitter && ( is_string( $twitter ) && $twitter !== '' ) )
				echo '<meta name="twitter:creator" content="@' . esc_attr( $twitter ) . '"/>' . "\n";
				
			else if ( $this->options['twitter_site'] !== '' ) {
				$twitter = apply_filters( 'wpseo_twitter_creator_account', $this->options['twitter_site'] );
				if ( is_string( $twitter ) && $twitter !== '' )
					echo '<meta name="twitter:creator" content="@' . esc_attr( $twitter ) . '"/>' . "\n";
			}
		}
	
		/**
		 * Displays the title for Twitter.
		 *
		 * Only used when OpenGraph is inactive.
		 */
		public function twitter_title() {
			$title = apply_filters( 'wpseo_twitter_title', $this->title( '' ) );
			if ( is_string( $title ) && $title !== '' ) {
				echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '"/>' . "\n";
			}
		}
	
		/**
		 * Displays the description for Twitter.
		 *
		 * Only used when OpenGraph is inactive.
		 */
		public function twitter_description() {
			$metadesc = trim( $this->metadesc( false ) );
			if ( empty( $metadesc ) ) {
				$metadesc = false;
			}
			if ( $metadesc && $this->options['opengraph'] === true ) {
				// Already output the same description in opengraph, no need to repeat.
				return;
			}
			else if ( ! $metadesc ) {
				$metadesc = strip_tags( get_the_excerpt() );
			}
	
			$metadesc = apply_filters( 'wpseo_twitter_description', $metadesc );
			if ( is_string( $metadesc ) && $metadesc !== '' ) {
				echo '<meta name="twitter:description" content="' . esc_attr( $metadesc ) . '"/>' . "\n";
			}
		}
	
		/**
		 * Displays the URL for Twitter.
		 *
		 * Only used when OpenGraph is inactive.
		 */
		public function twitter_url() {
			$url = $this->canonical( false );
			if ( is_string( $url ) && $url !== '' ) {
				echo '<meta name="twitter:url" content="' . esc_url( $url ) . '"/>' . "\n";
			}
		}
	
		/**
		 * Displays the image for Twitter
		 *
		 * Only used when OpenGraph is inactive.
		 */
		public function image() {
			global $post;
			
			$shown_images = array();
			
			if ( is_singular() ) {
				if ( is_front_page() ) {
					if ( $this->options['og_frontpage_image'] !== '' ) {
						$escaped_img = esc_url( $this->options['og_frontpage_image'] );
	
						if ( is_string( $escaped_img ) && $escaped_img !== ''  ) {
							echo '<meta name="twitter:image:src" content="' . $escaped_img . '"/>' . "\n";
	
							// No images yet, don't test
							array_push( $shown_images, $escaped_img );
						}
					}
				}
	
				if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
					$featured_img = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'medium' ) );
	
					if ( $featured_img ) {
						$escaped_img = esc_url( apply_filters( 'wpseo_opengraph_image', $featured_img[0] ) );
	
						if ( ( is_string( $escaped_img ) && $escaped_img !== ''  ) && ! in_array( $escaped_img, $shown_images ) ) {
							echo '<meta name="twitter:image:src" content="' . $escaped_img . '"/>' . "\n";
	
							array_push( $shown_images, $escaped_img );
						}
					}
				}
	
				if ( preg_match_all( '`<img [^>]+>`', $post->post_content, $matches ) ) {
					foreach ( $matches[0] as $img ) {
						if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) ) {
							$escaped_match = esc_url( $match[2] );
	
							if ( ( is_string( $escaped_match ) && $escaped_match !== ''  ) && ! in_array( $escaped_match, $shown_images ) ) {
								echo '<meta name="twitter:image:src" content="' . $escaped_match . '"/>' . "\n";
	
								array_push( $shown_images, $escaped_match );
							}
						}
					}
				}
			}
			
			if ( count( $shown_images ) == 0 && $this->options['og_default_image'] !== '' ) {
				echo '<meta name="twitter:image:src" content="' . esc_url( $this->options['og_default_image'] ) . '"/>' . "\n";
			}
		}
	} /* End of class */
	
	global $wpseo_twitter;
	$wpseo_twitter = new WPSEO_Twitter();

} /* End of class-exists wrapper */