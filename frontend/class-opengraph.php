<?php
/**
 * @package Frontend
 *
 * This code handles the OpenGraph output.
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Adds the OpenGraph output
 */
class WPSEO_OpenGraph extends WPSEO_Frontend {

	/**
	 * @var array $options Options for the OpenGraph Settings
	 */
	var $options = array();

	/**
	 * @var array $shown_images Holds the images that have been put out as OG image.
	 */
	var $shown_images = array();

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->options = get_wpseo_options();

		global $fb_ver;
		if ( isset( $fb_ver ) || class_exists( 'Facebook_Loader' ) ) {
			add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
		} else {
			add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ) );

			add_action( 'wpseo_opengraph', array( $this, 'locale'), 1 );
			add_action( 'wpseo_opengraph', array( $this, 'site_owner'), 20 );
			add_action( 'wpseo_opengraph', array( $this, 'og_title'), 10 );
			add_action( 'wpseo_opengraph', array( $this, 'description'), 11 );
			add_action( 'wpseo_opengraph', array( $this, 'url'), 12 );
			add_action( 'wpseo_opengraph', array( $this, 'site_name'), 13 );
			add_action( 'wpseo_opengraph', array( $this, 'article_author_facebook'), 14 );
			add_action( 'wpseo_opengraph', array( $this, 'website_facebook'), 15 );

			add_action( 'wpseo_opengraph', array( $this, 'type'), 5 );
			add_action( 'wpseo_opengraph', array( $this, 'image'), 30 );
		}
		remove_action( 'wp_head', 'jetpack_og_tags' );
		add_action( 'wpseo_head', array( $this, 'opengraph' ), 30 );
	}

	/**
	 * Main OpenGraph output.
	 */
	public function opengraph() {
		wp_reset_query();
		do_action( 'wpseo_opengraph' );
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
		if ( !empty( $ogdesc ) )
			$meta_tags['http://ogp.me/ns#description'] = $ogdesc;

		return $meta_tags;
	}

	/**
	 * Filter for the namespace, adding the OpenGraph namespace.
	 *
	 * @param string $input The input namespace string.
	 * @return string
	 */
	public function add_opengraph_namespace( $input ) {
		return $input . ' prefix="og: http://ogp.me/ns#' . ( ( isset( $this->options['fbadminapp'] ) || isset( $this->options['fb_admins'] ) ) ? ' fb: http://ogp.me/ns/fb#' : '' ) . '"';
	}

	/**
	 * Outputs the authors FB page.
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 */
	public function article_author_facebook() {
		if ( !is_singular() )
			return;

		global $post;
		$facebook = get_the_author_meta( 'facebook', $post->post_author );

		if ( $facebook && !empty( $facebook ) )
			echo "<meta property='article:author' content='" . esc_attr( $facebook ) . "'/>\n";
	}

	/**
	 * Outputs the websites FB page.
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 */
	public function website_facebook() {
		if ( isset( $this->options['facebook_site'] ) && $this->options['facebook_site'] )
			echo "<meta property='article:publisher' content='" . esc_attr( $this->options['facebook_site'] ) . "'/>\n";
	}

	/**
	 * Outputs the site owner
	 */
	public function site_owner() {
		if ( isset( $this->options['fbadminapp'] ) && 0 != $this->options['fbadminapp'] ) {
			echo "<meta property='fb:app_id' content='" . esc_attr( $this->options['fbadminapp'] ) . "'/>\n";
		} else if ( isset( $this->options['fb_admins'] ) && is_array( $this->options['fb_admins'] ) && ( count( $this->options['fb_admins'] ) > 0 ) ) {
			$adminstr = '';
			foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
				if ( !empty( $adminstr ) )
					$adminstr .= ',' . $admin_id;
				else
					$adminstr = $admin_id;
			}
			echo "<meta property='fb:admins' content='" . esc_attr( $adminstr ) . "'/>\n";
		}
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @param bool $echo Whether or not to echo the output.
	 * @return string $title
	 */
	public function og_title( $echo = true ) {
		$title = $this->title( '' );
		if ( $echo !== false )
			echo "<meta property='og:title' content='" . esc_attr( $title ) . "'/>\n";
		else
			return $title;
	}

	/**
	 * Outputs the canonical URL as OpenGraph URL, which consolidates likes and shares.
	 */
	public function url() {
		echo "<meta property='og:url' content='" . esc_attr( $this->canonical( false ) ) . "'/>\n";
	}

	/**
	 * Output the locale, doing some conversions to make sure the proper Facebook locale is outputted.
	 *
	 * @param bool $echo Whether to echo or return the locale
	 *
	 * @return string $locale
	 */
	public function locale( $echo = true ) {
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
			'zh' => 'zh_CN'
		);

		if ( isset( $fix_locales[$locale] ) )
			$locale = $fix_locales[$locale];

		// convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does)
		if ( strlen( $locale ) == 2 )
			$locale = strtolower( $locale ) . '_' . strtoupper( $locale );

		// These are the locales FB supports
		$fb_valid_fb_locales = array(
			'ca_ES', 'cs_CZ', 'cy_GB', 'da_DK', 'de_DE', 'eu_ES', 'en_PI', 'en_UD', 'ck_US', 'en_US', 'es_LA', 'es_CL', 'es_CO', 'es_ES', 'es_MX',
			'es_VE', 'fb_FI', 'fi_FI', 'fr_FR', 'gl_ES', 'hu_HU', 'it_IT', 'ja_JP', 'ko_KR', 'nb_NO', 'nn_NO', 'nl_NL', 'pl_PL', 'pt_BR', 'pt_PT',
			'ro_RO', 'ru_RU', 'sk_SK', 'sl_SI', 'sv_SE', 'th_TH', 'tr_TR', 'ku_TR', 'zh_CN', 'zh_HK', 'zh_TW', 'fb_LT', 'af_ZA', 'sq_AL', 'hy_AM',
			'az_AZ', 'be_BY', 'bn_IN', 'bs_BA', 'bg_BG', 'hr_HR', 'nl_BE', 'en_GB', 'eo_EO', 'et_EE', 'fo_FO', 'fr_CA', 'ka_GE', 'el_GR', 'gu_IN',
			'hi_IN', 'is_IS', 'id_ID', 'ga_IE', 'jv_ID', 'kn_IN', 'kk_KZ', 'la_VA', 'lv_LV', 'li_NL', 'lt_LT', 'mk_MK', 'mg_MG', 'ms_MY', 'mt_MT',
			'mr_IN', 'mn_MN', 'ne_NP', 'pa_IN', 'rm_CH', 'sa_IN', 'sr_RS', 'so_SO', 'sw_KE', 'tl_PH', 'ta_IN', 'tt_RU', 'te_IN', 'ml_IN', 'uk_UA',
			'uz_UZ', 'vi_VN', 'xh_ZA', 'zu_ZA', 'km_KH', 'tg_TJ', 'ar_AR', 'he_IL', 'ur_PK', 'fa_IR', 'sy_SY', 'yi_DE', 'gn_PY', 'qu_PE', 'ay_BO',
			'se_NO', 'ps_AF', 'tl_ST'
		);

		// check to see if the locale is a valid FB one, if not, use en_US as a fallback
		if ( !in_array( $locale, $fb_valid_fb_locales ) )
			$locale = 'en_US';

		if ( $echo !== false )
			echo "<meta property='og:locale' content='" . esc_attr( $locale ) . "'/>\n";
		else
			return $locale;
	}

	/**
	 * Output the OpenGraph type.
	 *
	 * @param boolean $echo Whether to echo or return the type
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {
		if ( is_singular() ) {
			$type = wpseo_get_value( 'og_type' );
			if ( !$type || $type == '' )
				$type = 'article';
		} else {
			$type = 'website';
		}
		$type = apply_filters( 'wpseo_opengraph_type', $type );

		if ( $echo !== false )
			echo "<meta property='og:type' content='" . esc_attr( $type ) . "'/>\n";
		else
			return $type;
	}

	/**
	 * Display an OpenGraph image tag
	 *
	 * @param string $img Source URL to the image
	 *
	 * @return bool
	 */
	function image_output( $img ) {
		if ( empty( $img ) )
			return false;

		$img = trim( apply_filters( 'wpseo_opengraph_image', $img ) );
		if ( !empty( $img ) ) {
			if ( strpos( $img, 'http' ) !== 0 ) {
				if ( $img[0] != '/' )
					return false;

				// If it's a relative URL, it's relative to the domain, not necessarily to the WordPress install, we
				// want to preserve domain name and URL scheme (http / https) though.
				$parsed_url = parse_url( home_url() );
				$img        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $img;
			}

			if ( in_array( $img, $this->shown_images ) )
				return false;

			array_push( $this->shown_images, $img );

			echo "<meta property='og:image' content='" . esc_url( $img ) . "'/>\n";
			return true;
		}

	}

	/**
	 * Output the OpenGraph image elements for all the images within the current post/page.
	 *
	 * @return bool
	 */
	public function image() {
		
		global $post;

		if ( is_front_page() ) {
			if ( isset( $this->options['og_frontpage_image'] ) )
				$this->image_output( $this->options['og_frontpage_image'] );
		}

		if ( is_singular() ) {
			if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
				$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'large' ) );
				$this->image_output( $thumb[0] );
			}

			if ( preg_match_all( '/<img [^>]+>/', $post->post_content, $matches ) ) {
				foreach ( $matches[0] as $img ) {
					if ( preg_match( '/src=("|\')(.*?)\1/', $img, $match ) )
						$this->image_output( $match[2] );
				}
			}
		}

		if ( count( $this->shown_images ) == 0 && isset( $this->options['og_default_image'] ) )
			$this->image_output( $this->options['og_default_image'] );

		// @TODO add G+ image stuff
	}

	/**
	 * Output the OpenGraph description, specific OG description first, if not, grab the meta description.
	 *
	 * @param bool $echo Whether to echo or return the description
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		$ogdesc = '';
		
		if ( is_front_page() ) {
			if ( isset( $this->options['og_frontpage_desc'] ) )
				$ogdesc = $this->options['og_frontpage_desc'];
		}

		if ( is_singular() ) {
			$ogdesc = wpseo_get_value( 'opengraph-description' );
			if ( !$ogdesc )
				$ogdesc = $this->metadesc( false );

			// og:description is still blank so grab it from get_the_excerpt()
			if ( !$ogdesc )
				$ogdesc = strip_tags( get_the_excerpt() );
		}

		$ogdesc = apply_filters( 'wpseo_opengraph_desc', $ogdesc );

		if ( $ogdesc && $ogdesc != '' ) {
			if ( $echo !== false )
				echo "<meta property='og:description' content='" . esc_attr( $ogdesc ) . "'/>\n";
			else
				return $ogdesc;
		}

	}

	/**
	 * Output the site name straight from the blog info.
	 */
	public function site_name() {
		echo "<meta property='og:site_name' content='" . esc_attr( get_bloginfo( 'name' ) ) . "'/>\n";
	}
}

global $wpseo_og;
$wpseo_og = new WPSEO_OpenGraph;