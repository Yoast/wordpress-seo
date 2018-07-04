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

	/** @var WPSEO_Frontend_Page_Type */
	protected $frontend_page_type;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		if ( isset( $GLOBALS['fb_ver'] ) || class_exists( 'Facebook_Loader', false ) ) {
			add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
		}
		else {
			add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ), 15 );

			add_action( 'wpseo_opengraph', array( $this, 'locale' ), 1 );
			add_action( 'wpseo_opengraph', array( $this, 'type' ), 5 );
			add_action( 'wpseo_opengraph', array( $this, 'og_title' ), 10 );
			add_action( 'wpseo_opengraph', array( $this, 'app_id' ), 20 );
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

		// Class for determine the current page type.
		$this->frontend_page_type = new WPSEO_Frontend_Page_Type();
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
	 * Filter the Facebook plugins metadata.
	 *
	 * @param array $meta_tags The array to fix.
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
		$namespaces = array(
			'og: http://ogp.me/ns#',
		);

		/**
		 * Allow for adding additional namespaces to the <html> prefix attributes.
		 *
		 * @since 3.9.0
		 *
		 * @param array $namespaces Currently registered namespaces which are to be
		 *                          added to the prefix attribute.
		 *                          Namespaces are strings and have the following syntax:
		 *                          ns: http://url.to.namespace/definition
		 */
		$namespaces       = apply_filters( 'wpseo_html_namespaces', $namespaces );
		$namespace_string = implode( ' ', array_unique( $namespaces ) );

		if ( strpos( $input, ' prefix=' ) !== false ) {
			$regex   = '`prefix=([\'"])(.+?)\1`';
			$replace = 'prefix="$2 ' . $namespace_string . '"';
			$input   = preg_replace( $regex, $replace, $input );
		}
		else {
			$input .= ' prefix="' . $namespace_string . '"';
		}

		return $input;
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

		/**
		 * Filter: 'wpseo_opengraph_author_facebook' - Allow developers to filter the Yoast SEO post authors facebook profile URL.
		 *
		 * @api bool|string $unsigned The Facebook author URL, return false to disable.
		 */
		$facebook = apply_filters( 'wpseo_opengraph_author_facebook', get_the_author_meta( 'facebook', $GLOBALS['post']->post_author ) );

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

		if ( 'article' === $this->type( false ) && WPSEO_Options::get( 'facebook_site', '' ) !== '' ) {
			$this->og_tag( 'article:publisher', WPSEO_Options::get( 'facebook_site' ) );

			return true;
		}

		return false;
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether or not to echo the output.
	 *
	 * @return string|boolean
	 */
	public function og_title( $echo = true ) {

		$frontend = WPSEO_Frontend::get_instance();

		if ( $this->frontend_page_type->is_simple_page() ) {
			$post_id = $this->frontend_page_type->get_simple_page_id();
			$post    = get_post( $post_id );
			$title   = WPSEO_Meta::get_value( 'opengraph-title', $post_id );

			if ( $title === '' ) {
				$title = $frontend->title( '' );
			}
			else {
				// Replace Yoast SEO Variables.
				$title = wpseo_replace_vars( $title, $post );
			}
		}
		elseif ( is_front_page() ) {
			$title = ( WPSEO_Options::get( 'og_frontpage_title', '' ) !== '' ) ? WPSEO_Options::get( 'og_frontpage_title' ) : $frontend->title( '' );
		}
		elseif ( is_category() || is_tax() || is_tag() ) {
			$title = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-title' );
			if ( $title === '' ) {
				$title = $frontend->title( '' );
			}
			else {
				// Replace Yoast SEO Variables.
				$title = wpseo_replace_vars( $title, $GLOBALS['wp_query']->get_queried_object() );
			}
		}
		else {
			$title = $frontend->title( '' );
		}

		/**
		 * Filter: 'wpseo_opengraph_title' - Allow changing the title specifically for OpenGraph.
		 *
		 * @api string $unsigned The title string.
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
		 * Filter: 'wpseo_opengraph_url' - Allow changing the OpenGraph URL.
		 *
		 * @api string $unsigned Canonical URL.
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
	 * Last update/compare with FB list done on 2015-03-16 by Rarst
	 *
	 * @see  http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether to echo or return the locale.
	 *
	 * @return string $locale
	 */
	public function locale( $echo = true ) {
		/**
		 * Filter: 'wpseo_locale' - Allow changing the locale output.
		 *
		 * @api string $unsigned Locale string.
		 */
		$locale = apply_filters( 'wpseo_locale', get_locale() );

		// Catch some weird locales served out by WP that are not easily doubled up.
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

		// Convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does).
		if ( strlen( $locale ) === 2 ) {
			$locale = strtolower( $locale ) . '_' . strtoupper( $locale );
		}

		// These are the locales FB supports.
		$fb_valid_fb_locales = array(
			'af_ZA', // Afrikaans.
			'ak_GH', // Akan.
			'am_ET', // Amharic.
			'ar_AR', // Arabic.
			'as_IN', // Assamese.
			'ay_BO', // Aymara.
			'az_AZ', // Azerbaijani.
			'be_BY', // Belarusian.
			'bg_BG', // Bulgarian.
			'bn_IN', // Bengali.
			'br_FR', // Breton.
			'bs_BA', // Bosnian.
			'ca_ES', // Catalan.
			'cb_IQ', // Sorani Kurdish.
			'ck_US', // Cherokee.
			'co_FR', // Corsican.
			'cs_CZ', // Czech.
			'cx_PH', // Cebuano.
			'cy_GB', // Welsh.
			'da_DK', // Danish.
			'de_DE', // German.
			'el_GR', // Greek.
			'en_GB', // English (UK).
			'en_IN', // English (India).
			'en_PI', // English (Pirate).
			'en_UD', // English (Upside Down).
			'en_US', // English (US).
			'eo_EO', // Esperanto.
			'es_CL', // Spanish (Chile).
			'es_CO', // Spanish (Colombia).
			'es_ES', // Spanish (Spain).
			'es_LA', // Spanish.
			'es_MX', // Spanish (Mexico).
			'es_VE', // Spanish (Venezuela).
			'et_EE', // Estonian.
			'eu_ES', // Basque.
			'fa_IR', // Persian.
			'fb_LT', // Leet Speak.
			'ff_NG', // Fulah.
			'fi_FI', // Finnish.
			'fo_FO', // Faroese.
			'fr_CA', // French (Canada).
			'fr_FR', // French (France).
			'fy_NL', // Frisian.
			'ga_IE', // Irish.
			'gl_ES', // Galician.
			'gn_PY', // Guarani.
			'gu_IN', // Gujarati.
			'gx_GR', // Classical Greek.
			'ha_NG', // Hausa.
			'he_IL', // Hebrew.
			'hi_IN', // Hindi.
			'hr_HR', // Croatian.
			'hu_HU', // Hungarian.
			'hy_AM', // Armenian.
			'id_ID', // Indonesian.
			'ig_NG', // Igbo.
			'is_IS', // Icelandic.
			'it_IT', // Italian.
			'ja_JP', // Japanese.
			'ja_KS', // Japanese (Kansai).
			'jv_ID', // Javanese.
			'ka_GE', // Georgian.
			'kk_KZ', // Kazakh.
			'km_KH', // Khmer.
			'kn_IN', // Kannada.
			'ko_KR', // Korean.
			'ku_TR', // Kurdish (Kurmanji).
			'ky_KG', // Kyrgyz.
			'la_VA', // Latin.
			'lg_UG', // Ganda.
			'li_NL', // Limburgish.
			'ln_CD', // Lingala.
			'lo_LA', // Lao.
			'lt_LT', // Lithuanian.
			'lv_LV', // Latvian.
			'mg_MG', // Malagasy.
			'mi_NZ', // Maori.
			'mk_MK', // Macedonian.
			'ml_IN', // Malayalam.
			'mn_MN', // Mongolian.
			'mr_IN', // Marathi.
			'ms_MY', // Malay.
			'mt_MT', // Maltese.
			'my_MM', // Burmese.
			'nb_NO', // Norwegian (bokmal).
			'nd_ZW', // Ndebele.
			'ne_NP', // Nepali.
			'nl_BE', // Dutch (Belgie).
			'nl_NL', // Dutch.
			'nn_NO', // Norwegian (nynorsk).
			'ny_MW', // Chewa.
			'or_IN', // Oriya.
			'pa_IN', // Punjabi.
			'pl_PL', // Polish.
			'ps_AF', // Pashto.
			'pt_BR', // Portuguese (Brazil).
			'pt_PT', // Portuguese (Portugal).
			'qu_PE', // Quechua.
			'rm_CH', // Romansh.
			'ro_RO', // Romanian.
			'ru_RU', // Russian.
			'rw_RW', // Kinyarwanda.
			'sa_IN', // Sanskrit.
			'sc_IT', // Sardinian.
			'se_NO', // Northern Sami.
			'si_LK', // Sinhala.
			'sk_SK', // Slovak.
			'sl_SI', // Slovenian.
			'sn_ZW', // Shona.
			'so_SO', // Somali.
			'sq_AL', // Albanian.
			'sr_RS', // Serbian.
			'sv_SE', // Swedish.
			'sw_KE', // Swahili.
			'sy_SY', // Syriac.
			'sz_PL', // Silesian.
			'ta_IN', // Tamil.
			'te_IN', // Telugu.
			'tg_TJ', // Tajik.
			'th_TH', // Thai.
			'tk_TM', // Turkmen.
			'tl_PH', // Filipino.
			'tl_ST', // Klingon.
			'tr_TR', // Turkish.
			'tt_RU', // Tatar.
			'tz_MA', // Tamazight.
			'uk_UA', // Ukrainian.
			'ur_PK', // Urdu.
			'uz_UZ', // Uzbek.
			'vi_VN', // Vietnamese.
			'wo_SN', // Wolof.
			'xh_ZA', // Xhosa.
			'yi_DE', // Yiddish.
			'yo_NG', // Yoruba.
			'zh_CN', // Simplified Chinese (China).
			'zh_HK', // Traditional Chinese (Hong Kong).
			'zh_TW', // Traditional Chinese (Taiwan).
			'zu_ZA', // Zulu.
			'zz_TR', // Zazaki.
		);

		// Check to see if the locale is a valid FB one, if not, use en_US as a fallback.
		if ( ! in_array( $locale, $fb_valid_fb_locales, true ) ) {
			$locale = strtolower( substr( $locale, 0, 2 ) ) . '_' . strtoupper( substr( $locale, 0, 2 ) );
			if ( ! in_array( $locale, $fb_valid_fb_locales, true ) ) {
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
	 * @param boolean $echo Whether to echo or return the type.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/object/
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {

		if ( is_front_page() || is_home() ) {
			$type = 'website';
		}
		elseif ( is_singular() ) {

			// This'll usually only be changed by plugins right now.
			$type = WPSEO_Meta::get_value( 'og_type' );

			if ( $type === '' ) {
				$type = 'article';
			}
		}
		else {
			// We use "object" for archives etc. as article doesn't apply there.
			$type = 'object';
		}

		/**
		 * Filter: 'wpseo_opengraph_type' - Allow changing the OpenGraph type of the page.
		 *
		 * @api string $type The OpenGraph type string.
		 */
		$type = apply_filters( 'wpseo_opengraph_type', $type );

		if ( is_string( $type ) && $type !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:type', $type );
			}
			else {
				return $type;
			}
		}

		return '';
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
	 * Output the OpenGraph description, specific OG description first, if not, grab the meta description.
	 *
	 * @param bool $echo Whether to echo or return the description.
	 *
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		$ogdesc   = '';
		$frontend = WPSEO_Frontend::get_instance();

		if ( is_front_page() ) {
			if ( WPSEO_Options::get( 'og_frontpage_desc', '' ) !== '' ) {
				$ogdesc = wpseo_replace_vars( WPSEO_Options::get( 'og_frontpage_desc' ), null );
			}
			else {
				$ogdesc = $frontend->metadesc( false );
			}
		}

		if ( $this->frontend_page_type->is_simple_page() ) {
			$post_id = $this->frontend_page_type->get_simple_page_id();
			$post    = get_post( $post_id );
			$ogdesc  = WPSEO_Meta::get_value( 'opengraph-description', $post_id );

			// Replace Yoast SEO Variables.
			$ogdesc = wpseo_replace_vars( $ogdesc, $post );

			// Use metadesc if $ogdesc is empty.
			if ( $ogdesc === '' ) {
				$ogdesc = $frontend->metadesc( false );
			}

			// Tag og:description is still blank so grab it from get_the_excerpt().
			if ( ! is_string( $ogdesc ) || ( is_string( $ogdesc ) && $ogdesc === '' ) ) {
				$ogdesc = str_replace( '[&hellip;]', '&hellip;', wp_strip_all_tags( get_the_excerpt() ) );
			}
		}

		if ( is_category() || is_tag() || is_tax() ) {
			$ogdesc = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-description' );
			if ( $ogdesc === '' ) {
				$ogdesc = $frontend->metadesc( false );
			}

			if ( $ogdesc === '' ) {
				$ogdesc = wp_strip_all_tags( term_description() );
			}

			if ( $ogdesc === '' ) {
				$ogdesc = WPSEO_Taxonomy_Meta::get_meta_without_term( 'desc' );
			}
		}

		// Strip shortcodes if any.
		$ogdesc = strip_shortcodes( $ogdesc );

		/**
		 * Filter: 'wpseo_opengraph_desc' - Allow changing the OpenGraph description.
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
		 * Filter: 'wpseo_opengraph_site_name' - Allow changing the OpenGraph site name.
		 *
		 * @api string $unsigned Blog name string.
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

		$pub = get_the_date( DATE_W3C );
		$this->og_tag( 'article:published_time', $pub );

		$mod = get_the_modified_date( DATE_W3C );
		if ( $mod !== $pub ) {
			$this->og_tag( 'article:modified_time', $mod );
			$this->og_tag( 'og:updated_time', $mod );
		}

		return true;
	}

	/**
	 * Outputs the Facebook app_id.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return void
	 */
	public function app_id() {
		$app_id = WPSEO_Options::get( 'fbadminapp', '' );
		if ( $app_id !== '' ) {
			$this->og_tag( 'fb:app_id', $app_id );
		}
	}


	/**
	 * Outputs the site owner.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 * @return void
	 *
	 * @deprecated 7.1
	 * @codeCoverageIgnore
	 */
	public function site_owner() {
		// As this is a frontend method, we want to make sure it is not displayed for non-logged in users.
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( 'WPSEO_OpenGraph::site_owner', '7.1', null );
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
		_deprecated_function( 'WPSEO_OpenGraph::image_output', '7.4', 'WPSEO_OpenGraph::image' );

		$this->image( $image );
	}

} /* End of class */
