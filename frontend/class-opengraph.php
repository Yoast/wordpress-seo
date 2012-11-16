<?php
/**
 * @package Frontend
 *
 * This code handles the OpenGraph output.
 */

/**
 * Adds the OpenGraph output
 */
class WPSEO_OpenGraph extends WPSEO_Frontend {

	/**
	 * @var array $options Options for the OpenGraph Settings
	 */
	var $options = array();

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );

		add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ) );

		global $fb_ver;
		if ( isset( $fb_ver ) ) {
			add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
		} else {
			add_action( 'wpseo_head', array( $this, 'opengraph' ) );
		}
		add_action( 'wpseo_head', array( $this, 'wpseo_opengraph_action' ) );
	}

	/**
	 * Do the opengraph action
	 */
	public function wpseo_opengraph_action() {
		do_action( 'wpseo_opengraph' );
	}

	/**
	 * Main OpenGraph output.
	 */
	public function opengraph() {
		wp_reset_query();

		$this->locale();
		$this->site_owner();
		$this->og_title();
		$this->description();
		$this->url();
		$this->site_name();
		$this->type();
		$this->image();
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
		return $input . ' xmlns:og="http://opengraphprotocol.org/schema/"';
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
		if ( $echo )
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
			'ca'=> 'ca_ES',
			'en'=> 'en_US',
			'el'=> 'el_GR',
			'et'=> 'et_EE',
			'ja'=> 'ja_JP',
			'sq'=> 'sq_AL',
			'uk'=> 'uk_UA',
			'vi'=> 'vi_VN',
			'zh'=> 'zh_CN'
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

		if ( $echo )
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

		if ( $echo )
			echo "<meta property='og:type' content='" . esc_attr( $type ) . "'/>\n";
		else
			return $type;
	}

	/**
	 * Output the OpenGraph image elements for all the images within the current post/page.
	 *
	 * @return bool
	 */
	public function image() {
		if ( is_singular() ) {
			global $post;

			$shown_images = array();

			if ( is_front_page() ) {
				if ( is_front_page() ) {
					$og_image = '';
					if ( isset( $this->options['og_frontpage_image'] ) )
						$og_image = $this->options['og_frontpage_image'];

					$og_image = apply_filters( 'wpseo_opengraph_image', $og_image );

					if ( isset( $og_image ) && $og_image != '' )
						echo "<meta property='og:image' content='" . esc_attr( $og_image ) . "'/>\n";
				}
			}

			if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
				$featured_img = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'medium' ) );

				if ( $featured_img ) {
					$img = apply_filters( 'wpseo_opengraph_image', $featured_img[0] );
					echo "<meta property='og:image' content='" . esc_attr( $img ) . "'/>\n";
					$shown_images[] = $img;
				}
			}

			if ( preg_match_all( '/<img [^>]+>/', $post->post_content, $matches ) ) {
				foreach ( $matches[0] as $img ) {
					if ( preg_match( '/src=("|\')([^"|\']+)("|\')/', $img, $match ) ) {
						$img = $match[2];

						if ( in_array( $img, $shown_images ) )
							continue;

						if ( strpos( $img, 'http' ) !== 0 ) {
							if ( $img[0] != '/' )
								continue;
							$img = get_bloginfo( 'url' ) . $img;
						}

						if ( $img != esc_url( $img ) )
							continue;

						$img = apply_filters( 'wpseo_opengraph_image', $img );

						echo "<meta property='og:image' content='" . esc_attr( $img ) . "'/>\n";

						$shown_images[] = $img;
					}
				}
			}
			if ( count( $shown_images ) > 0 )
				return true;
		}


		$og_image = '';

		if ( is_front_page() ) {
			if ( isset( $this->options['og_frontpage_image'] ) )
				$og_image = $this->options['og_frontpage_image'];
			if ( isset( $this->options['gp_frontpage_image'] ) )
				$gp_image = $this->options['gp_frontpage_image'];
		}

		if ( empty( $og_image ) && isset( $this->options['og_default_image'] ) )
			$og_image = $this->options['og_default_image'];

		$og_image = apply_filters( 'wpseo_opengraph_image', $og_image );

		if ( isset( $og_image ) && $og_image != '' )
			echo "<meta property='og:image' content='" . esc_attr( $og_image ) . "'/>\n";

		// @TODO add G+ image stuff
	}

	/**
	 * Output the OpenGraph description, specific OG description first, if not, grab the meta description.
	 *
	 * @param bool $echo Whether to echo or return the description
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		$ogdesc = wpseo_get_value( 'opengraph-description' );

		if ( !$ogdesc )
			$ogdesc = $this->metadesc( false );

		if ( $ogdesc && $ogdesc != '' ) {
			if ( $echo )
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