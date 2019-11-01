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
		if ( isset( $GLOBALS['fb_ver'] ) || class_exists( 'Facebook_Loader', false ) ) {
			add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
		}
		else {
			add_action( 'wpseo_opengraph', array( $this, 'locale' ), 1 );
			add_action( 'wpseo_opengraph', array( $this, 'type' ), 5 );
			add_action( 'wpseo_opengraph', array( $this, 'app_id' ), 20 );
			add_action( 'wpseo_opengraph', array( $this, 'site_name' ), 13 );
			if ( is_singular() && ! is_front_page() ) {
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

		// Filter the locale too because the Facebook plugin locale code is not as good as ours.
		$meta_tags['http://ogp.me/ns#locale'] = $this->locale( false );

		return $meta_tags;
	}

	/**
	 * Output the locale, doing some conversions to make sure the proper Facebook locale is outputted.
	 *
	 * Last update/compare with FB list done on 2015-03-16 by Rarst.
	 *
	 * @link http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales.
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
			'bp_IN', // Bhojpuri.
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
			'en_PI', // English (Pirate).
			'en_UD', // English (Upside Down).
			'en_US', // English (US).
			'em_ZM',
			'eo_EO', // Esperanto.
			'es_ES', // Spanish (Spain).
			'es_LA', // Spanish.
			'es_MX', // Spanish (Mexico).
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
			'ht_HT', // Haitian Creole.
			'hy_AM', // Armenian.
			'id_ID', // Indonesian.
			'ig_NG', // Igbo.
			'is_IS', // Icelandic.
			'it_IT', // Italian.
			'ik_US',
			'iu_CA',
			'ja_JP', // Japanese.
			'ja_KS', // Japanese (Kansai).
			'jv_ID', // Javanese.
			'ka_GE', // Georgian.
			'kk_KZ', // Kazakh.
			'km_KH', // Khmer.
			'kn_IN', // Kannada.
			'ko_KR', // Korean.
			'ks_IN', // Kashmiri.
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
			'nr_ZA', // Southern Ndebele.
			'ns_ZA', // Northern Sotho.
			'ny_MW', // Chewa.
			'om_ET', // Oromo.
			'or_IN', // Oriya.
			'pa_IN', // Punjabi.
			'pl_PL', // Polish.
			'ps_AF', // Pashto.
			'pt_BR', // Portuguese (Brazil).
			'pt_PT', // Portuguese (Portugal).
			'qc_GT', // Quiché.
			'qu_PE', // Quechua.
			'qr_GR',
			'qz_MM', // Burmese (Zawgyi).
			'rm_CH', // Romansh.
			'ro_RO', // Romanian.
			'ru_RU', // Russian.
			'rw_RW', // Kinyarwanda.
			'sa_IN', // Sanskrit.
			'sc_IT', // Sardinian.
			'se_NO', // Northern Sami.
			'si_LK', // Sinhala.
			'su_ID', // Sundanese.
			'sk_SK', // Slovak.
			'sl_SI', // Slovenian.
			'sn_ZW', // Shona.
			'so_SO', // Somali.
			'sq_AL', // Albanian.
			'sr_RS', // Serbian.
			'ss_SZ', // Swazi.
			'st_ZA', // Southern Sotho.
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
			'tn_BW', // Tswana.
			'tr_TR', // Turkish.
			'ts_ZA', // Tsonga.
			'tt_RU', // Tatar.
			'tz_MA', // Tamazight.
			'uk_UA', // Ukrainian.
			'ur_PK', // Urdu.
			'uz_UZ', // Uzbek.
			've_ZA', // Venda.
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

	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function website_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}
} /* End of class */
