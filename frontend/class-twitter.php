<?php
/**
 * @package Frontend
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

/**
 * This class handles the Twitter card functionality.
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
	 * @return false Only shows on singular pages, false on non-singular pages.
	 */
	public function twitter() {
		if ( !is_singular() )
			return false;

		wp_reset_query();

		$this->type();
		$this->site_twitter();
		$this->site_domain();
		$this->author_twitter();
		// No need to show these when OpenGraph is also showing, as it'd be the same contents and Twitter
		// would fallback to OpenGraph anyway.
		$this->image();
		$options = get_wpseo_options();

		$this->twitter_description();

		if ( !isset( $options['opengraph'] ) || !$options['opengraph'] ) {
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
		echo '<meta name="twitter:card" content="' . apply_filters( 'wpseo_twitter_card_type', 'summary' ) . '"/>' . "\n";
	}

	/**
	 * Displays the Twitter account for the site.
	 */
	public function site_twitter() {
		if ( isset( $this->options['twitter_site'] ) )
			echo '<meta name="twitter:site" content="@' . trim( $this->options['twitter_site'] ) . '"/>' . "\n";
	}
	
	/**
	 * Displays the domain tag for the site.
	 */
	public function site_domain() {
		echo '<meta name="twitter:domain" content="' . site_url() . '"/>' . "\n";
	}

	/**
	 * Displays the authors Twitter account.
	 */
	public function author_twitter() {
		$twitter = trim( get_the_author_meta( 'twitter' ) );

		if ( $twitter && !empty( $twitter ) )
			echo '<meta name="twitter:creator" content="@' . $twitter . '"/>' . "\n";
			
		else if ( isset( $this->options['twitter_site'] ) )
			echo '<meta name="twitter:creator" content="@' . trim( $this->options['twitter_site'] ) . '"/>' . "\n";
	}

	/**
	 * Displays the title for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_title() {
		echo '<meta name="twitter:title" content="' . $this->title( '' ) . '"/>' . "\n";
	}

	/**
	 * Displays the description for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_description() {
		$metadesc = trim( $this->metadesc( false ) );
		if ( empty( $metadesc ) )
			$metadesc = false;
		if ( $metadesc && isset( $options['opengraph'] ) && $options['opengraph'] ) {
			// Already output the same description in opengraph, no need to repeat.
			return;
		} else if ( !$metadesc ) {
			$metadesc = strip_tags( get_the_excerpt() );
		}

		echo '<meta name="twitter:description" content="' . esc_attr( $metadesc ) . '"/>' . "\n";
	}

	/**
	 * Displays the URL for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_url() {
		echo '<meta name="twitter:url" content="' . $this->canonical( false ) . '"/>' . "\n";
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
				
				if ( isset( $this->options['og_frontpage_image'] ) ) {
					
					$img = $this->options['og_frontpage_image'];
					
					echo '<meta name="twitter:image:src" content="' . esc_attr( $img ) . '"/>' . "\n";
					
					// No images yet, don't test
					array_push( $shown_images, $img );
					
				}
				
			}
			
			if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
				
				$featured_img = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'medium' ) );
	
				if ( $featured_img ) {
					
					$img = apply_filters( 'wpseo_opengraph_image', $featured_img[0] );
					
					if ( ! in_array( $img, $shown_images ) ) {
						
						echo '<meta name="twitter:image:src" content="' . esc_attr( $img ) . '"/>' . "\n";
						
						array_push( $shown_images, $img );
						
					}
					
				}
				
			}
			
			if ( preg_match_all( '/<img [^>]+>/', $post->post_content, $matches ) ) {
				
				foreach ( $matches[0] as $img ) {
					
					if ( preg_match( '/src=("|\')(.*?)\1/', $img, $match ) ) {
					
						if ( ! in_array( $match[2], $shown_images ) ) {
							
							echo '<meta name="twitter:image:src" content="' . esc_attr( $match[2] ) . '"/>' . "\n";
							
							array_push( $shown_images, $match[2] );
							
						}
					
					}
					
				}
				
			}
			
		}
		
		if ( count( $shown_images ) == 0 && isset( $this->options['og_default_image'] ) )
			echo '<meta name="twitter:image:src" content="' . esc_attr( $this->options['og_default_image'] ) . '"/>' . "\n";

	}
	
}

global $wpseo_twitter;
$wpseo_twitter = new WPSEO_Twitter();