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
		$twitter_site = apply_filters( 'wpseo_twitter_site', $this->options['twitter_site'] );
		if ( isset( $twitter_site ) )
			echo '<meta name="twitter:site" content="@' . ltrim( trim( $twitter_site ), '@' ) . '"/>' . "\n";
	}

	/**
	 * Displays the domain tag for the site.
	 */
	public function site_domain() {
		$twitter_domain = apply_filters( 'wpseo_twitter_domain', site_url() );
		echo '<meta name="twitter:domain" content="' . preg_replace( '|^https?://|', '', $twitter_domain ) . '"/>' . "\n";
	}

	/**
	 * Displays the authors Twitter account.
	 */
	public function author_twitter() {
		$twitter_creator = apply_filters( 'wpseo_twitter_creator', get_the_author_meta( 'twitter' ) );
		$twitter_site = apply_filters( 'wpseo_twitter_site', $this->options['twitter_site'] );

		if ( $twitter_creator && !empty( $twitter_creator ) )
			echo '<meta name="twitter:creator" content="@' . ltrim( trim( $twitter_creator ), '@' ) . '"/>' . "\n";

		else if ( isset( $twitter_site ) )
			echo '<meta name="twitter:creator" content="@' . ltrim( trim( $twitter_site ), '@' ) . '"/>' . "\n";
	}

	/**
	 * Displays the title for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_title() {
		$twitter_title = apply_filters( 'wpseo_twitter_title', $this->title( '' ) );
		echo '<meta name="twitter:title" content="' . $twitter_title . '"/>' . "\n";
	}

	/**
	 * Displays the description for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_description() {
		$twitter_description = apply_filters( 'wpseo_twitter_description', $this->metadesc( false ) );
		if ( empty( $twitter_description ) )
			$twitter_description = false;
		if ( $twitter_description && isset( $options['opengraph'] ) && $options['opengraph'] ) {
			// Already output the same description in opengraph, no need to repeat.
			return;
		} else if ( !$twitter_description ) {
			$twitter_description = strip_tags( get_the_excerpt() );
		}

		echo '<meta name="twitter:description" content="' . trim( esc_attr( $twitter_description ) ) . '"/>' . "\n";
	}

	/**
	 * Displays the URL for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	public function twitter_url() {
		$twitter_url = apply_filters( 'wpseo_twitter_url', $this->canonical( false ) );
		echo '<meta name="twitter:url" content="' . $twitter_url . '"/>' . "\n";
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

					$escaped_img = esc_attr( $this->options['og_frontpage_image'] );

					if ( ! empty( $escaped_img ) ) {
						echo '<meta name="twitter:image:src" content="' . $escaped_img . '"/>' . "\n";

						// No images yet, don't test
						array_push( $shown_images, $escaped_img );

					}

				}

			}

			if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {

				$featured_img = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'medium' ) );

				if ( $featured_img ) {

					$escaped_img = esc_attr( apply_filters( 'wpseo_opengraph_image', $featured_img[0] ) );

					if ( ! empty( $escaped_img ) && ! in_array( $escaped_img, $shown_images ) ) {

						echo '<meta name="twitter:image:src" content="' . $escaped_img . '"/>' . "\n";

						array_push( $shown_images, $escaped_img );

					}

				}

			}

			if ( preg_match_all( '/<img [^>]+>/', $post->post_content, $matches ) ) {

				foreach ( $matches[0] as $img ) {

					if ( preg_match( '/src=("|\')(.*?)\1/', $img, $match ) ) {

						$escaped_match = esc_attr( $match[2] );

						if ( ! empty( $escaped_match ) && ! in_array( $escaped_match, $shown_images ) ) {

							echo '<meta name="twitter:image:src" content="' . $escaped_match . '"/>' . "\n";

							array_push( $shown_images, $escaped_match );

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