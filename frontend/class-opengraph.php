<?php
/**
 * @package Frontend
 *
 * This code handles the OpenGraph output.
 */

/**
 * Adds the OpenGraph output
 */
class WPSEO_OpenGraph {

	/**
	 * @var array $options Options for the OpenGraph Settings
	 */
	public $options = array();

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->options = WPSEO_Options::get_all();

		global $fb_ver;
		if ( isset( $fb_ver ) || class_exists( 'Facebook_Loader' ) ) {
			add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
		} else {
			add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ) );

			add_action( 'wpseo_opengraph', array( $this, 'locale' ), 1 );
			add_action( 'wpseo_opengraph', array( $this, 'type' ), 5 );
			add_action( 'wpseo_opengraph', array( $this, 'og_title' ), 10 );
			add_action( 'wpseo_opengraph', array( $this, 'site_owner' ), 20 );
			add_action( 'wpseo_opengraph', array( $this, 'description' ), 11 );
			add_action( 'wpseo_opengraph', array( $this, 'url' ), 12 );
			add_action( 'wpseo_opengraph', array( $this, 'site_name' ), 13 );
			add_action( 'wpseo_opengraph', array( $this, 'website_facebook' ), 14 );
			if ( is_singular() && ! is_front_page() ) {
				add_action( 'wpseo_opengraph', array( $this, 'article_author_facebook' ), 15 );
				add_action( 'wpseo_opengraph', array( $this, 'tags' ), 16 );
				add_action( 'wpseo_opengraph', array( $this, 'category' ), 17 );
				add_action( 'wpseo_opengraph', array( $this, 'publish_date' ), 19 );
			}

			add_action( 'wpseo_opengraph', array( $this, 'image' ), 30 );
		}
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
	 * @param string $property
	 * @param string $content
	 *
	 * @return boolean
	 */
	public function og_tag( $property, $content ) {
		$og_property = str_replace( ':', '_', $property );
		/**
		 * Filter: 'wpseo_og_' . $og_property - Allow developers to change the content of specific OG meta tags.
		 *
		 * @api string $content The content of the property
		 */
		$content = apply_filters( 'wpseo_og_' . $og_property, $content );
		if ( empty( $content ) ) {
			return false;
		}

		echo '<meta property="' . esc_attr( $property ) . '" content="' . esc_attr( $content ) . '" />' . "\n";

		return true;
	}

	/**
	 * Filter the Facebook plugins metadata
	 *
	 * @param array $meta_tags the array to fix.
	 *
	 * @return array $meta_tags
	 */
	public function facebook_filter( $meta_tags ) {
		$meta_tags['http://ogp.me/ns#type']  = $this->type( false );
		$meta_tags['http://ogp.me/ns#title'] = $this->og_title( false );

		// Filter the locale too because the Facebook plugin locale code is not as good as ours.
		$meta_tags['http://ogp.me/ns#locale'] = $this->locale( false );

		$ogdesc = $this->description( false );
		if ( ! empty( $ogdesc ) ) {
			$meta_tags['http://ogp.me/ns#description'] = $ogdesc;
		}

		return $meta_tags;
	}

	/**
	 * Filter for the namespace, adding the OpenGraph namespace.
	 *
	 * @link https://developers.facebook.com/docs/web/tutorials/scrumptious/open-graph-object/
	 *
	 * @param string $input The input namespace string.
	 *
	 * @return string
	 */
	public function add_opengraph_namespace( $input ) {
		return $input . ' prefix="og: http://ogp.me/ns#' . ( ( $this->options['fbadminapp'] != 0 || ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) ) ? ' fb: http://ogp.me/ns/fb#' : '' ) . '"';
	}

	/**
	 * Outputs the authors FB page.
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function article_author_facebook() {
		if ( ! is_singular() ) {
			return false;
		}

		global $post;
		/**
		 * Filter: 'wpseo_opengraph_author_facebook' - Allow developers to filter the WP SEO post authors facebook profile URL
		 *
		 * @api bool|string $unsigned The Facebook author URL, return false to disable
		 */
		$facebook = apply_filters( 'wpseo_opengraph_author_facebook', get_the_author_meta( 'facebook', $post->post_author ) );

		if ( $facebook && ( is_string( $facebook ) && $facebook !== '' ) ) {
			$this->og_tag( 'article:author', $facebook );

			return true;
		}

		return false;
	}

	/**
	 * Outputs the websites FB page.
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean
	 */
	public function website_facebook() {

		if ( $this->options['facebook_site'] !== '' ) {
			$this->og_tag( 'article:publisher', $this->options['facebook_site'] );

			return true;
		}

		return false;
	}

	/**
	 * Outputs the site owner
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean
	 */
	public function site_owner() {
		if ( 0 != $this->options['fbadminapp'] ) {
			$this->og_tag( 'fb:app_id', $this->options['fbadminapp'] );

			return true;
		} elseif ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			$adminstr = implode( ',', array_keys( $this->options['fb_admins'] ) );
			/**
			 * Filter: 'wpseo_opengraph_admin' - Allow developer to filter the fb:admins string put out by WP SEO
			 *
			 * @api string $adminstr The admin string
			 */
			$adminstr = apply_filters( 'wpseo_opengraph_admin', $adminstr );
			if ( is_string( $adminstr ) && $adminstr !== '' ) {
				$this->og_tag( 'fb:admins', $adminstr );

				return true;
			}
		}

		return false;
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @param bool $echo Whether or not to echo the output.
	 *
	 * @return string $title
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean
	 */
	public function og_title( $echo = true ) {
		if ( is_singular() ) {
			$title = WPSEO_Meta::get_value( 'opengraph-title' );
			if ( $title === '' ) {
				$title = WPSEO_Frontend::get_instance()->title( '' );
			} else {
				// Replace WP SEO Variables
				$title = wpseo_replace_vars( $title, get_post() );
			}
		} else if ( is_front_page() ) {
			$title = ( $this->options['og_frontpage_title'] !== '' ) ? $this->options['og_frontpage_title'] : WPSEO_Frontend::get_instance()->title( '' );
		} else {
			$title = WPSEO_Frontend::get_instance()->title( '' );
		}

		/**
		 * Filter: 'wpseo_opengraph_title' - Allow changing the title specifically for OpenGraph
		 *
		 * @api string $unsigned The title string
		 */
		$title = trim( apply_filters( 'wpseo_opengraph_title', $title ) );

		if ( is_string( $title ) && $title !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:title', $title );

				return true;
			}
		}

		if ( $echo === false ) {
			return $title;
		}

		return false;
	}

	/**
	 * Outputs the canonical URL as OpenGraph URL, which consolidates likes and shares.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean
	 */
	public function url() {
		/**
		 * Filter: 'wpseo_opengraph_url' - Allow changing the OpenGraph URL
		 *
		 * @api string $unsigned Canonical URL
		 */
		$url = apply_filters( 'wpseo_opengraph_url', WPSEO_Frontend::get_instance()->canonical( false ) );

		if ( is_string( $url ) && $url !== '' ) {
			$this->og_tag( 'og:url', esc_url( $url ) );

			return true;
		}

		return false;
	}

	/**
	 * Output the locale, doing some conversions to make sure the proper Facebook locale is outputted.
	 *
	 * Last update/compare with FB list done on July 14, 2013 by JRF
	 * Results: 1 new locale added, found 32 in the below list which are not in the FB list (not removed), 76 OK.
	 * @see  http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether to echo or return the locale
	 *
	 * @return string $locale
	 */
	public function locale( $echo = true ) {
		/**
		 * Filter: 'wpseo_locale' - Allow changing the locale output
		 *
		 * @api string $unsigned Locale string
		 */
		$locale = apply_filters( 'wpseo_locale', get_locale() );

		// catch some weird locales served out by WP that are not easily doubled up.
		$fix_locales = array(
			'ca' => 'ca_ES',
			'en' => 'en_US',
			'el' => 'el_GR',
			'et' => 'et_EE',
			'ja' => 'ja_JP',
			'sq' => 'sq_AL',
			'uk' => 'uk_UA',
			'vi' => 'vi_VN',
			'zh' => 'zh_CN',
		);

		if ( isset( $fix_locales[ $locale ] ) ) {
			$locale = $fix_locales[ $locale ];
		}

		// convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does)
		if ( strlen( $locale ) == 2 ) {
			$locale = strtolower( $locale ) . '_' . strtoupper( $locale );
		}

		// These are the locales FB supports
		$fb_valid_fb_locales = array(
			'ca_ES', 'cs_CZ', 'cy_GB', 'da_DK', 'de_DE', 'eu_ES', 'en_PI', 'en_UD', 'ck_US', 'en_US', 'es_LA', 'es_CL', 'es_CO', 'es_ES', 'es_MX',
			'es_VE', 'fb_FI', 'fi_FI', 'fr_FR', 'gl_ES', 'hu_HU', 'it_IT', 'ja_JP', 'ko_KR', 'nb_NO', 'nn_NO', 'nl_NL', 'pl_PL', 'pt_BR', 'pt_PT',
			'ro_RO', 'ru_RU', 'sk_SK', 'sl_SI', 'sv_SE', 'th_TH', 'tr_TR', 'ku_TR', 'zh_CN', 'zh_HK', 'zh_TW', 'fb_LT', 'af_ZA', 'sq_AL', 'hy_AM',
			'az_AZ', 'be_BY', 'bn_IN', 'bs_BA', 'bg_BG', 'hr_HR', 'nl_BE', 'en_GB', 'eo_EO', 'et_EE', 'fo_FO', 'fr_CA', 'ka_GE', 'el_GR', 'gu_IN',
			'hi_IN', 'is_IS', 'id_ID', 'ga_IE', 'jv_ID', 'kn_IN', 'kk_KZ', 'la_VA', 'lv_LV', 'li_NL', 'lt_LT', 'mk_MK', 'mg_MG', 'ms_MY', 'mt_MT',
			'mr_IN', 'mn_MN', 'ne_NP', 'pa_IN', 'rm_CH', 'sa_IN', 'sr_RS', 'so_SO', 'sw_KE', 'tl_PH', 'ta_IN', 'tt_RU', 'te_IN', 'ml_IN', 'uk_UA',
			'uz_UZ', 'vi_VN', 'xh_ZA', 'zu_ZA', 'km_KH', 'tg_TJ', 'ar_AR', 'he_IL', 'ur_PK', 'fa_IR', 'sy_SY', 'yi_DE', 'gn_PY', 'qu_PE', 'ay_BO',
			'se_NO', 'ps_AF', 'tl_ST', 'fy_NL',
		);

		// check to see if the locale is a valid FB one, if not, use en_US as a fallback
		if ( ! in_array( $locale, $fb_valid_fb_locales ) ) {
			$locale = strtolower( substr( $locale, 0, 2 ) ) . '_' . strtoupper( substr( $locale, 0, 2 ) );
			if ( ! in_array( $locale, $fb_valid_fb_locales ) ) {
				$locale = 'en_US';
			}
		}

		if ( $echo !== false ) {
			$this->og_tag( 'og:locale', $locale );
		}

		return $locale;
	}

	/**
	 * Output the OpenGraph type.
	 *
	 * @param boolean $echo Whether to echo or return the type
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/object/
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {

		if ( is_front_page() || is_home() ) {
			$type = 'website';
		} elseif ( is_singular() ) {

			// This'll usually only be changed by plugins right now.
			$type = WPSEO_Meta::get_value( 'og_type' );

			if ( $type === '' ) {
				$type = 'article';
			}
		} else {
			// We use "object" for archives etc. as article doesn't apply there
			$type = 'object';
		}

		/**
		 * Filter: 'wpseo_opengraph_type' - Allow changing the OpenGraph type of the page
		 *
		 * @api string $type The OpenGraph type string.
		 */
		$type = apply_filters( 'wpseo_opengraph_type', $type );

		if ( is_string( $type ) && $type !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:type', $type );
			} else {
				return $type;
			}
		}

		return '';
	}

	/**
	 * Create new WPSEO_OpenGraph_Image class and get the images to set the og:image
	 */
	public function image() {
		$opengraph_images = new WPSEO_OpenGraph_Image( $this->options );

		foreach ( $opengraph_images->get_images() as $img ) {
			$this->og_tag( 'og:image', esc_url( $img ) );
		}
	}



	/**
	 * Output the OpenGraph description, specific OG description first, if not, grab the meta description.
	 *
	 * @param bool $echo Whether to echo or return the description
	 *
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		$ogdesc = '';

		if ( is_front_page() ) {
			$ogdesc = ( $this->options['og_frontpage_desc'] !== '' ) ? $this->options['og_frontpage_desc'] : WPSEO_Frontend::get_instance()->metadesc( false );
		}

		if ( is_singular() ) {
			$ogdesc = WPSEO_Meta::get_value( 'opengraph-description' );

			// Replace WP SEO Variables
			$ogdesc = wpseo_replace_vars( $ogdesc, get_post() );

			// Use metadesc if $ogdesc is empty
			if ( $ogdesc === '' ) {
				$ogdesc = WPSEO_Frontend::get_instance()->metadesc( false );
			}

			// og:description is still blank so grab it from get_the_excerpt()
			if ( ! is_string( $ogdesc ) || ( is_string( $ogdesc ) && $ogdesc === '' ) ) {
				$ogdesc = str_replace( '[&hellip;]', '&hellip;', strip_tags( get_the_excerpt() ) );
			}
		}

		if ( is_category() || is_tag() || is_tax() ) {

			$ogdesc = WPSEO_Frontend::get_instance()->metadesc( false );

			if ( '' == $ogdesc ) {
				$ogdesc = trim( strip_tags( term_description() ) );
			}

			if ( '' == $ogdesc ) {
				global $wp_query;
				$term   = $wp_query->get_queried_object();
				$ogdesc = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'desc' );
			}
		}

		// Strip shortcodes if any
		$ogdesc = strip_shortcodes( $ogdesc );

		/**
		 * Filter: 'wpseo_opengraph_desc' - Allow changing the OpenGraph description
		 *
		 * @api string $ogdesc The description string.
		 */
		$ogdesc = trim( apply_filters( 'wpseo_opengraph_desc', $ogdesc ) );

		if ( is_string( $ogdesc ) && $ogdesc !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:description', $ogdesc );
			}
		}

		return $ogdesc;
	}

	/**
	 * Output the site name straight from the blog info.
	 */
	public function site_name() {
		/**
		 * Filter: 'wpseo_opengraph_site_name' - Allow changing the OpenGraph site name
		 *
		 * @api string $unsigned Blog name string
		 */
		$name = apply_filters( 'wpseo_opengraph_site_name', get_bloginfo( 'name' ) );
		if ( is_string( $name ) && $name !== '' ) {
			$this->og_tag( 'og:site_name', $name );
		}
	}

	/**
	 * Output the article tags as article:tag tags.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean
	 */
	public function tags() {
		if ( ! is_singular() ) {
			return false;
		}

		$tags = get_the_tags();
		if ( ! is_wp_error( $tags ) && ( is_array( $tags ) && $tags !== array() ) ) {

			$tags_out = '';
			foreach ( $tags as $tag ) {
				$tags_out .= $tag->name . ',';
			}
			$tags_out = rtrim( $tags_out, ',' );
			$this->og_tag( 'article:tag', $tags_out );

			return true;
		}

		return false;
	}

	/**
	 * Output the article category as an article:section tag.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean;
	 */
	public function category() {

		if ( ! is_singular() ) {
			return false;
		}

		$terms = get_the_category();

		if ( ! is_wp_error( $terms ) && ( is_array( $terms ) && $terms !== array() ) ) {

			// We can only show one section here, so we take the first one.
			$this->og_tag( 'article:section', $terms[0]->name );

			return true;
		}

		return false;
	}

	/**
	 * Output the article publish and last modification date
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return boolean;
	 */
	public function publish_date() {

		if ( ! is_singular( 'post' ) ) {
			/**
			 * Filter: 'wpseo_opengraph_show_publish_date' - Allow showing publication date for other post types
			 *
			 * @api bool $unsigned Whether or not to show publish date
			 *
			 * @param string $post_type The current URL's post type.
			 */
			if ( false === apply_filters( 'wpseo_opengraph_show_publish_date', false, get_post_type() ) ) {
				return false;
			}
		}

		$pub = get_the_date( 'c' );
		$this->og_tag( 'article:published_time', $pub );

		$mod = get_the_modified_date( 'c' );
		if ( $mod != $pub ) {
			$this->og_tag( 'article:modified_time', $mod );
			$this->og_tag( 'og:updated_time', $mod );
		}

		return true;
	}

} /* End of class */

class WPSEO_OpenGraph_Image {

	private $options;

	/**
	 * @var array $images Holds the images that have been put out as OG image.
	 */
	private $images = array();

	/**
	 * Constructor
	 *
	 * @param array $options
	 */
	public function __construct( $options ) {
		$this->options = $options;
		$this->set_images();
	}

	/**
	 * Return the images array
	 *
	 * @return array
	 */
	public function get_images() {
		return $this->images;
	}

	/**
	 * Check if page is front page or singular and call the corresponding functions. If not, call get_default_image.
	 */
	private function set_images() {
		if ( is_front_page() ) {
			$this->get_front_page_image();
		}

		if ( is_singular() ) {
			$this->get_singular_image();
		}

		$this->get_default_image();
	}

	/**
	 * If the frontpage image exists, call add_image
	 */
	private function get_front_page_image() {
		if ( $this->options['og_frontpage_image'] !== '' ) {
			$this->add_image( $this->options['og_frontpage_image'] );
		}
	}

	/**
	 * Get the images of the singular post.
	 */
	private function get_singular_image() {
		global $post;

		if ( $this->get_opengraph_image() ) {
			return;
		}

		if ( $this->get_featured_image( $post->ID ) ) {
			return;
		}

		$this->get_content_images( $post );

	}

	/**
	 * Get default image and call add_image
	 */
	private function get_default_image() {
		if ( count( $this->images ) == 0 && $this->options['og_default_image'] !== '' ) {
			$this->add_image( $this->options['og_default_image'] );
		}
	}

	/**
	 * If opengraph-image is set, call add_image and return true
	 *
	 * @return bool
	 */
	private function get_opengraph_image() {
		$ogimg = WPSEO_Meta::get_value( 'opengraph-image' );
		if ( $ogimg !== '' ) {
			$this->add_image( $ogimg );

			return true;
		}
	}

	/**
	 * Filter: 'wpseo_pre_analysis_post_content' - Allow filtering the content before analysis
	 *
	 * @api string $post_content The Post content string
	 *
	 * @param object $post The post object.
	 */
	private function get_content_images( $post ) {
		$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );

		if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
			foreach ( $matches[0] as $img ) {
				if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) ) {
					$this->add_image( $match[2] );
				}
			}
		}
	}

	/**
	 * If there is a featured image, check image size. If image size is correct, call add_image and return true
	 *
	 * @param $post_id
	 *
	 * @return bool
	 */
	private function get_featured_image( $post_id ) {
		if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post_id ) ) {
			/**
			 * Filter: 'wpseo_opengraph_image_size' - Allow changing the image size used for OpenGraph sharing
			 *
			 * @api string $unsigned Size string
			 */
			$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), apply_filters( 'wpseo_opengraph_image_size', 'original' ) );

			if ( $this->check_image_size( $thumb ) ) {
				$this->add_image( $thumb[0] );

				return true;
			}
		}
	}

	/**
	 * Check size of image. If image is too small, return false, else return true
	 *
	 * @param array $img
	 *
	 * @return bool
	 */
	private function check_image_size( $img_data ) {
		//Get the width and height of the image.
		if ( $img_data[1] < 200 || $img_data[2] < 200 ) {
			return false;
		}

		return true;
	}

	/**
	 * Display an OpenGraph image tag
	 *
	 * @param string $img Source URL to the image
	 *
	 * @return bool
	 */
	private function add_image( $img ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image
		 *
		 * @api string $img Image URL string
		 */

		$img = trim( apply_filters( 'wpseo_opengraph_image', $img ) );

		if ( empty( $img ) ) {
			return false;
		}

		if ( WPSEO_Utils::is_url_relative( $img ) === true ) {
			$img = $this->get_relative_path( $img );
		}

		if ( in_array( $img, $this->images ) ) {
			return false;
		}
		array_push( $this->images, $img );

		return true;
	}

	/**
	 * Get the relative path of the image
	 * @param $img
	 *
	 * @return bool|string
	 */
	private function get_relative_path( $img ) {
		if ( $img[0] != '/' ) {
			return false;
		}

		// If it's a relative URL, it's relative to the domain, not necessarily to the WordPress install, we
		// want to preserve domain name and URL scheme (http / https) though.
		$parsed_url = parse_url( home_url() );
		$img        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $img;

		return $img;
	}

}
