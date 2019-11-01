<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This code adds the OpenGraph output.
 */
class WPSEO_OpenGraph {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'wpseo_opengraph', array( $this, 'app_id' ), 20 );

		if ( is_singular() && ! is_front_page() ) {
			add_action( 'wpseo_opengraph', array( $this, 'tags' ), 16 );
			add_action( 'wpseo_opengraph', array( $this, 'category' ), 17 );
			add_action( 'wpseo_opengraph', array( $this, 'publish_date' ), 19 );
		}

		add_action( 'wpseo_opengraph', array( $this, 'image' ), 30 );
		add_filter( 'jetpack_enable_open_graph', '__return_false' );
		add_action( 'wpseo_head', array( $this, 'opengraph' ), 30 );
	}

	/**
	 * Main OpenGraph output.
	 */
	public function opengraph() {
		wp_reset_query();
		/**
		 * Action: 'wpseo_opengraph' - Hook to add all Facebook OpenGraph output to so they're close together.
		 */
		do_action( 'wpseo_opengraph' );
	}

	/**
	 * Internal function to output FB tags. This also adds an output filter to each bit of output based on the property.
	 *
	 * @param string $property Property attribute value.
	 * @param string $content  Content attribute value.
	 *
	 * @return boolean
	 */
	public function og_tag( $property, $content ) {
		$og_property = str_replace( ':', '_', $property );
		/**
		 * Filter: 'wpseo_og_' . $og_property - Allow developers to change the content of specific OG meta tags.
		 *
		 * @api string $content The content of the property.
		 */
		$content = apply_filters( 'wpseo_og_' . $og_property, $content );
		if ( empty( $content ) ) {
			return false;
		}

		echo '<meta property="', esc_attr( $property ), '" content="', esc_attr( $content ), '" />', "\n";

		return true;
	}

	/**
	 * Create new WPSEO_OpenGraph_Image class and get the images to set the og:image.
	 *
	 * @param string|bool $image Optional. Image URL.
	 *
	 * @return void
	 */
	public function image( $image = false ) {
		$opengraph_image = new WPSEO_OpenGraph_Image( $image, $this );
		$opengraph_image->show();
	}

	/**
	 * Output the article tags as article:tag tags.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function tags() {
		if ( ! is_singular() ) {
			return false;
		}

		$tags = get_the_tags();
		if ( ! is_wp_error( $tags ) && ( is_array( $tags ) && $tags !== array() ) ) {

			foreach ( $tags as $tag ) {
				$this->og_tag( 'article:tag', $tag->name );
			}

			return true;
		}

		return false;
	}

	/**
	 * Output the article category as an article:section tag.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function category() {

		if ( ! is_singular() ) {
			return false;
		}

		$post = get_post();
		if ( ! $post ) {
			return false;
		}

		$primary_term     = new WPSEO_Primary_Term( 'category', $post->ID );
		$primary_category = $primary_term->get_primary_term();

		if ( $primary_category ) {
			// We can only show one section here, so we take the first one.
			$this->og_tag( 'article:section', get_cat_name( $primary_category ) );

			return true;
		}

		$terms = get_the_category();

		if ( ! is_wp_error( $terms ) && is_array( $terms ) && ! empty( $terms ) ) {
			// We can only show one section here, so we take the first one.
			$term = reset( $terms );
			$this->og_tag( 'article:section', $term->name );
			return true;
		}

		return false;
	}

	/**
	 * Output the article publish and last modification date.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function publish_date() {

		if ( ! is_singular( 'post' ) ) {
			/**
			 * Filter: 'wpseo_opengraph_show_publish_date' - Allow showing publication date for other post types.
			 *
			 * @api bool $unsigned Whether or not to show publish date.
			 *
			 * @param string $post_type The current URL's post type.
			 */
			if ( false === apply_filters( 'wpseo_opengraph_show_publish_date', false, get_post_type() ) ) {
				return false;
			}
		}

		$post = get_post();

		$pub = mysql2date( DATE_W3C, $post->post_date_gmt, false );
		$this->og_tag( 'article:published_time', $pub );

		$mod = mysql2date( DATE_W3C, $post->post_modified_gmt, false );
		if ( $mod !== $pub ) {
			$this->og_tag( 'article:modified_time', $mod );
			$this->og_tag( 'og:updated_time', $mod );
		}

		return true;
	}

	/**
	 * Outputs the Facebook app_id.
	 *
	 * @return void
	 */
	public function app_id() {
		$app_id = WPSEO_Options::get( 'fbadminapp', '' );
		if ( $app_id !== '' ) {
			$this->og_tag( 'fb:app_id', $app_id );
		}
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Outputs the site owner.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return void
	 *
	 * @deprecated 7.1
	 * @codeCoverageIgnore
	 */
	public function site_owner() {
		// As this is a frontend method, we want to make sure it is not displayed for non-logged in users.
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( __METHOD__, '7.1', null );
		}
	}

	/**
	 * Fallback method for plugins using image_output.
	 *
	 * @param string|bool $image Image URL.
	 *
	 * @deprecated 7.4
	 * @codeCoverageIgnore
	 */
	public function image_output( $image = false ) {
		_deprecated_function( __METHOD__, '7.4', 'WPSEO_OpenGraph::image' );
	}

	/**
	 * Outputs the canonical URL as OpenGraph URL, which consolidates likes and shares.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function url() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether or not to echo the output.
	 *
	 * @return string|boolean
	 */
	public function og_title( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the OpenGraph description, specific OG description first, if not, grabs the meta description.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param bool $echo Whether to echo or return the description.
	 *
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the author's FB page.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function article_author_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}


	/**
	 * Outputs the website's FB page.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function website_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}


	/**
	 * Outputs the OpenGraph type.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param boolean $echo Whether to echo or return the type.
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the locale, doing some conversions to make sure the proper Facebook locale is output.
	 *
	 * Last update/compare with FB list done on 2015-03-16 by Rarst.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales.
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether to echo or return the locale.
	 *
	 * @return string $locale
	 */
	public function locale( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Filters the Facebook plugins metadata.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param array $meta_tags The array to fix.
	 *
	 * @return array $meta_tags
	 */
	public function facebook_filter( $meta_tags ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return [];
	}

	/**
	 * Outputs the site name straight from the blog info.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function site_name() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
} /* End of class */
