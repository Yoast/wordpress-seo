<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This class handles the Twitter card functionality.
 *
 * @link https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards
 */
class WPSEO_Twitter {

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	public static $instance;

	/**
	 * Images.
	 *
	 * @var array
	 */
	private $images = array();

	/**
	 * Images.
	 *
	 * @var array
	 */
	public $shown_images = array();

	/**
	 * Will hold the Twitter card type being created.
	 *
	 * @var string
	 */
	private $type;

	/**
	 * Card types currently allowed by Twitter.
	 *
	 * @link https://dev.twitter.com/cards/types
	 *
	 * @var array
	 */
	private $valid_types = array(
		'summary',
		'summary_large_image',
		'app',
		'player',
	);

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->twitter();
	}

	/**
	 * Outputs the Twitter Card code on singular pages.
	 */
	public function twitter() {
		wp_reset_query();

		$this->site_twitter();

		if ( is_singular() ) {
			$this->author();
		}

		/**
		 * Action: 'wpseo_twitter' - Hook to add all Yoast SEO Twitter output to so they're close together.
		 */
		do_action( 'wpseo_twitter' );
	}

	/**
	 * Output the metatag.
	 *
	 * @param string $name    Tag name string.
	 * @param string $value   Tag value string.
	 * @param bool   $escaped Force escape flag.
	 */
	private function output_metatag( $name, $value, $escaped = false ) {

		// Escape the value if not escaped.
		if ( false === $escaped ) {
			$value = esc_attr( $value );
		}

		/**
		 * Filter: 'wpseo_twitter_metatag_key' - Make the Twitter metatag key filterable.
		 *
		 * @api string $key The Twitter metatag key.
		 */
		$metatag_key = apply_filters( 'wpseo_twitter_metatag_key', 'name' );

		// Output meta.
		echo '<meta ', esc_attr( $metatag_key ), '="twitter:', esc_attr( $name ), '" content="', $value, '" />', "\n";
	}

	/**
	 * Displays the Twitter account for the site.
	 */
	protected function site_twitter() {
		switch ( WPSEO_Options::get( 'company_or_person', '' ) ) {
			case 'person':
				$user_id = (int) WPSEO_Options::get( 'company_or_person_user_id', false );
				$twitter = get_the_author_meta( 'twitter', $user_id );
				// For backwards compat reasons, if there is no twitter ID for person, we fall back to site.
				if ( empty( $twitter ) ) {
					$twitter = WPSEO_Options::get( 'twitter_site' );
				}
				break;
			case 'company':
			default:
				$twitter = WPSEO_Options::get( 'twitter_site' );
				break;
		}

		/**
		 * Filter: 'wpseo_twitter_site' - Allow changing the Twitter site account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $unsigned Twitter site account string.
		 */
		$site = apply_filters( 'wpseo_twitter_site', $twitter );
		$site = $this->get_twitter_id( $site );

		if ( is_string( $site ) && $site !== '' ) {
			$this->output_metatag( 'site', '@' . $site );
		}
	}

	/**
	 * Checks if the given id is actually an id or a url and if url, distills the id from it.
	 *
	 * Solves issues with filters returning urls and theme's/other plugins also adding a user meta
	 * twitter field which expects url rather than an id (which is what we expect).
	 *
	 * @param string $id Twitter ID or url.
	 *
	 * @return string|bool Twitter ID or false if it failed to get a valid Twitter ID.
	 */
	private function get_twitter_id( $id ) {
		if ( preg_match( '`([A-Za-z0-9_]{1,25})$`', $id, $match ) ) {
			return $match[1];
		}

		return false;
	}

	/**
	 * Displays the authors Twitter account.
	 */
	protected function author() {
		$post = get_post();

		$twitter = null;
		if ( is_object( $post ) ) {
			$twitter = ltrim( trim( get_the_author_meta( 'twitter', $post->post_author ) ), '@' );
		}
		/**
		 * Filter: 'wpseo_twitter_creator_account' - Allow changing the Twitter account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter The twitter account name string.
		 */
		$twitter = apply_filters( 'wpseo_twitter_creator_account', $twitter );
		$twitter = $this->get_twitter_id( $twitter );

		if ( is_string( $twitter ) && $twitter !== '' ) {
			$this->output_metatag( 'creator', '@' . $twitter );
		}
		elseif ( WPSEO_Options::get( 'twitter_site', '' ) !== '' && is_string( WPSEO_Options::get( 'twitter_site' ) ) ) {
			$this->output_metatag( 'creator', '@' . WPSEO_Options::get( 'twitter_site' ) );
		}
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
} /* End of class */
