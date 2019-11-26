<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This class handles the Twitter card functionality.
 *
 * @link https://dev.twitter.com/docs/cards
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
	private $images = [];

	/**
	 * Images.
	 *
	 * @var array
	 */
	public $shown_images = [];

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
	private $valid_types = [
		'summary',
		'summary_large_image',
		'app',
		'player',
	];

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

		/**
		 * Filter: 'wpseo_output_twitter_card' - Allow disabling of the Twitter card.
		 *
		 * @api bool $enabled Enabled/disabled flag
		 */
		if ( false === apply_filters( 'wpseo_output_twitter_card', true ) ) {
			return;
		}

		wp_reset_query();

		$this->type();
		$this->description();
		$this->title();
		$this->site_twitter();

		if ( ! post_password_required() ) {
			$this->image();
		}

		if ( is_singular() ) {
			$this->author();
		}

		/**
		 * Action: 'wpseo_twitter' - Hook to add all Yoast SEO Twitter output to so they're close together.
		 */
		do_action( 'wpseo_twitter' );
	}

	/**
	 * Display the Twitter card type.
	 *
	 * This defaults to summary but can be filtered using the <code>wpseo_twitter_card_type</code> filter.
	 *
	 * @link https://dev.twitter.com/docs/cards
	 */
	protected function type() {
		$this->determine_card_type();
		$this->sanitize_card_type();

		$this->output_metatag( 'card', $this->type );
	}

	/**
	 * Determines the twitter card type for the current page.
	 */
	private function determine_card_type() {
		$this->type = WPSEO_Options::get( 'twitter_card_type' );

		// @todo This should be reworked to use summary_large_image for any fitting image R.
		if ( is_singular() && has_shortcode( $GLOBALS['post']->post_content, 'gallery' ) ) {

			$this->images = get_post_gallery_images();

			if ( count( $this->images ) > 0 ) {
				$this->type = 'summary_large_image';
			}
		}

		/**
		 * Filter: 'wpseo_twitter_card_type' - Allow changing the Twitter Card type as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $unsigned The type string.
		 */
		$this->type = apply_filters( 'wpseo_twitter_card_type', $this->type );
	}

	/**
	 * Determines whether the card type is of a type currently allowed by Twitter.
	 *
	 * @link https://dev.twitter.com/cards/types
	 */
	private function sanitize_card_type() {
		if ( ! in_array( $this->type, $this->valid_types, true ) ) {
			$this->type = 'summary';
		}
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
	 * Displays the description for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	protected function description() {
		if ( WPSEO_Frontend_Page_Type::is_simple_page() ) {
			$meta_desc = $this->single_description( WPSEO_Frontend_Page_Type::get_simple_page_id() );
		}
		elseif ( is_category() || is_tax() || is_tag() ) {
			$meta_desc = $this->taxonomy_description();
		}
		else {
			$meta_desc = $this->fallback_description();
		}

		$meta_desc = wpseo_replace_vars( $meta_desc, get_queried_object() );

		/**
		 * Filter: 'wpseo_twitter_description' - Allow changing the Twitter description as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter The description string.
		 */
		$meta_desc = apply_filters( 'wpseo_twitter_description', $meta_desc );
		if ( is_string( $meta_desc ) && $meta_desc !== '' ) {
			$this->output_metatag( 'description', $meta_desc );
		}
	}

	/**
	 * Returns the description for a singular page.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string
	 */
	private function single_description( $post_id = 0 ) {
		$meta_desc = trim( WPSEO_Meta::get_value( 'twitter-description', $post_id ) );

		if ( is_string( $meta_desc ) && '' !== $meta_desc ) {
			return $meta_desc;
		}

		$meta_desc = $this->fallback_description();
		if ( is_string( $meta_desc ) && '' !== $meta_desc ) {
			return $meta_desc;
		}

		return wp_strip_all_tags( get_the_excerpt() );
	}

	/**
	 * Getting the description for the taxonomy.
	 *
	 * @return bool|mixed|string
	 */
	private function taxonomy_description() {
		$meta_desc = WPSEO_Taxonomy_Meta::get_meta_without_term( 'twitter-description' );

		if ( ! is_string( $meta_desc ) || $meta_desc === '' ) {
			$meta_desc = $this->fallback_description();
		}

		if ( is_string( $meta_desc ) && $meta_desc !== '' ) {
			return $meta_desc;
		}

		return wp_strip_all_tags( term_description() );
	}

	/**
	 * Returns a fallback description.
	 *
	 * @return string
	 */
	private function fallback_description() {
		return trim( WPSEO_Frontend::get_instance()->metadesc( false ) );
	}

	/**
	 * Displays the title for Twitter.
	 *
	 * Only used when OpenGraph is inactive.
	 */
	protected function title() {
		if ( WPSEO_Frontend_Page_Type::is_simple_page() ) {
			$title = $this->single_title( WPSEO_Frontend_Page_Type::get_simple_page_id() );
		}
		elseif ( is_category() || is_tax() || is_tag() ) {
			$title = $this->taxonomy_title();
		}
		else {
			$title = $this->fallback_title();
		}

		$title = wpseo_replace_vars( $title, get_queried_object() );

		/**
		 * Filter: 'wpseo_twitter_title' - Allow changing the Twitter title as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter The title string.
		 */
		$title = apply_filters( 'wpseo_twitter_title', $title );
		if ( is_string( $title ) && $title !== '' ) {
			$this->output_metatag( 'title', $title );
		}
	}

	/**
	 * Returns the Twitter title for a single post.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string
	 */
	private function single_title( $post_id = 0 ) {
		$title = WPSEO_Meta::get_value( 'twitter-title', $post_id );
		if ( ! is_string( $title ) || $title === '' ) {
			return $this->fallback_title();
		}

		return $title;
	}

	/**
	 * Getting the title for the taxonomy.
	 *
	 * @return bool|mixed|string
	 */
	private function taxonomy_title() {
		$title = WPSEO_Taxonomy_Meta::get_meta_without_term( 'twitter-title' );

		if ( ! is_string( $title ) || $title === '' ) {
			return $this->fallback_title();
		}

		return $title;
	}

	/**
	 * Returns the Twitter title for any page.
	 *
	 * @return string
	 */
	private function fallback_title() {
		return WPSEO_Frontend::get_instance()->title( '' );
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
	 * Displays the image for Twitter.
	 *
	 * Only used when OpenGraph is inactive or Summary Large Image card is chosen.
	 */
	protected function image() {
		if ( is_category() || is_tax() || is_tag() ) {
			$this->taxonomy_image_output();
		}
		else {
			$this->single_image_output();
		}

		if ( count( $this->shown_images ) === 0 && WPSEO_Options::get( 'og_default_image', '' ) !== '' ) {
			$this->image_output( WPSEO_Options::get( 'og_default_image' ) );
		}
	}

	/**
	 * Outputs the first image of a gallery.
	 */
	private function gallery_images_output() {

		$this->image_output( reset( $this->images ) );
	}

	/**
	 * Outputs the Twitter image. Using the Facebook image as fallback.
	 *
	 * @return bool
	 */
	private function taxonomy_image_output() {
		foreach ( [ 'twitter-image', 'opengraph-image' ] as $tag ) {
			$img = WPSEO_Taxonomy_Meta::get_meta_without_term( $tag );
			if ( is_string( $img ) && $img !== '' ) {
				$this->image_output( $img );

				return true;
			}
		}

		/**
		 * Filter: wpseo_twitter_taxonomy_image - Allow developers to set a custom Twitter image for taxonomies.
		 *
		 * @api bool|string $unsigned Return string to supply image to use, false to use no image.
		 */
		$img = apply_filters( 'wpseo_twitter_taxonomy_image', false );
		if ( is_string( $img ) && $img !== '' ) {
			$this->image_output( $img );

			return true;
		}

		return false;
	}

	/**
	 * Takes care of image output when we only need to display a single image.
	 *
	 * @return void
	 */
	private function single_image_output() {
		if ( $this->homepage_image_output() ) {
			return;
		}

		// Posts page, which won't be caught by is_singular() below.
		if ( $this->posts_page_image_output() ) {
			return;
		}

		if ( WPSEO_Frontend_Page_Type::is_simple_page() ) {
			$post_id = WPSEO_Frontend_Page_Type::get_simple_page_id();

			if ( $this->image_from_meta_values_output( $post_id ) ) {
				return;
			}

			if ( $this->image_of_attachment_page_output( $post_id ) ) {
				return;
			}

			if ( $this->image_thumbnail_output( $post_id ) ) {
				return;
			}

			if ( count( $this->images ) > 0 ) {
				$this->gallery_images_output();
				return;
			}

			if ( $this->image_from_content_output( $post_id ) ) {
				return;
			}
		}
	}

	/**
	 * Show the front page image.
	 *
	 * @return bool
	 */
	private function homepage_image_output() {
		if ( is_front_page() ) {
			if ( WPSEO_Options::get( 'og_frontpage_image', '' ) !== '' ) {
				$this->image_output( WPSEO_Options::get( 'og_frontpage_image' ) );

				return true;
			}
		}

		return false;
	}

	/**
	 * Show the posts page image.
	 *
	 * @return bool
	 */
	private function posts_page_image_output() {

		if ( is_front_page() || ! is_home() ) {
			return false;
		}

		$post_id = get_option( 'page_for_posts' );

		if ( $this->image_from_meta_values_output( $post_id ) ) {
			return true;
		}

		if ( $this->image_thumbnail_output( $post_id ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Outputs a Twitter image tag for a given image.
	 *
	 * @param string $img The source URL to the image.
	 *
	 * @return bool
	 */
	protected function image_output( $img ) {

		/**
		 * Filter: 'wpseo_twitter_image' - Allow changing the Twitter Card image.
		 *
		 * @api string $img Image URL string.
		 */
		$img = apply_filters( 'wpseo_twitter_image', $img );

		if ( WPSEO_Utils::is_url_relative( $img ) === true && $img[0] === '/' ) {
			$parsed_url = wp_parse_url( home_url() );
			$img        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $img;
		}

		$escaped_img = esc_url( $img );

		if ( in_array( $escaped_img, $this->shown_images, true ) ) {
			return false;
		}

		if ( is_string( $escaped_img ) && $escaped_img !== '' ) {
			$this->output_metatag( 'image', $escaped_img, true );
			array_push( $this->shown_images, $escaped_img );

			return true;
		}

		return false;
	}

	/**
	 * Retrieve images from the post meta values.
	 *
	 * @param int $post_id Optional post ID to use.
	 *
	 * @return bool
	 */
	private function image_from_meta_values_output( $post_id = 0 ) {
		foreach ( [ 'twitter-image', 'opengraph-image' ] as $tag ) {
			$img = WPSEO_Meta::get_value( $tag, $post_id );
			if ( $img !== '' ) {
				$this->image_output( $img );

				return true;
			}
		}

		return false;
	}

	/**
	 * Retrieve an attachment page's attachment.
	 *
	 * @param string $attachment_id The ID of the attachment for which to retrieve the image.
	 *
	 * @return bool
	 */
	private function image_of_attachment_page_output( $attachment_id ) {
		if ( get_post_type( $attachment_id ) === 'attachment' ) {
			$mime_type = get_post_mime_type( $attachment_id );
			switch ( $mime_type ) {
				case 'image/jpeg':
				case 'image/png':
				case 'image/gif':
					$this->image_output( wp_get_attachment_url( $attachment_id ) );
					return true;
			}
		}

		return false;
	}

	/**
	 * Retrieve the featured image.
	 *
	 * @param int $post_id Optional post ID to use.
	 *
	 * @return bool
	 */
	private function image_thumbnail_output( $post_id = 0 ) {

		if ( empty( $post_id ) ) {
			$post_id = get_the_ID();
		}

		if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post_id ) ) {
			/**
			 * Filter: 'wpseo_twitter_image_size' - Allow changing the Twitter Card image size.
			 *
			 * @api string $featured_img Image size string.
			 */
			$featured_img = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), apply_filters( 'wpseo_twitter_image_size', 'full' ) );

			if ( $featured_img ) {
				$this->image_output( $featured_img[0] );

				return true;
			}
		}

		return false;
	}

	/**
	 * Retrieve the image from the content.
	 *
	 * @param int $post_id The post id to extract the images from.
	 *
	 * @return bool True when images output succeeded.
	 */
	private function image_from_content_output( $post_id ) {
		$image_url = WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null || empty( $image_url ) ) {
			return false;
		}

		$this->image_output( $image_url );

		return true;
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
