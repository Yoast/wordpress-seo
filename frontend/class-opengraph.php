<?php
/**
 * @package Frontend
 *
 * This code handles the OpenGraph output.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


if ( ! class_exists( 'WPSEO_OpenGraph' ) ) {
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
			$this->options = WPSEO_Options::get_all();
	
			global $fb_ver;
			if ( isset( $fb_ver ) || class_exists( 'Facebook_Loader' ) ) {
				add_filter( 'fb_meta_tags', array( $this, 'facebook_filter' ), 10, 1 );
			}
			else {
				add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ) );
	
				add_action( 'wpseo_opengraph', array( $this, 'locale' ), 1 );
				add_action( 'wpseo_opengraph', array( $this, 'type' ), 5 );
				add_action( 'wpseo_opengraph', array( $this, 'og_title' ), 10 );
				add_action( 'wpseo_opengraph', array( $this, 'site_owner' ), 20 );
				add_action( 'wpseo_opengraph', array( $this, 'description' ), 11 );
				add_action( 'wpseo_opengraph', array( $this, 'url' ), 12 );
				add_action( 'wpseo_opengraph', array( $this, 'site_name' ), 13 );
				add_action( 'wpseo_opengraph', array( $this, 'website_facebook' ), 14 );
				add_action( 'wpseo_opengraph', array( $this, 'article_author_facebook' ), 15 );
				add_action( 'wpseo_opengraph', array( $this, 'tags' ), 16 );
				add_action( 'wpseo_opengraph', array( $this, 'category' ), 17 );
				add_action( 'wpseo_opengraph', array( $this, 'publish_date' ), 19 );
	
				add_action( 'wpseo_opengraph', array( $this, 'image' ), 30 );
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
		 * Internal function to output FB tags. This also adds an output filter to each bit of output based on the property.
		 *
		 * @param string $property
		 * @param string $content
		 */
		private function og_tag( $property, $content ) {
			$content = apply_filters( 'wpseo_og_' . str_replace( ':', '_', $property ), $content );
			if ( ! empty( $content ) )
				echo '<meta property="' . $property . '" content="' . esc_attr( $content ) . '" />' . "\n";
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
			if ( ! empty( $ogdesc ) )
				$meta_tags['http://ogp.me/ns#description'] = $ogdesc;
	
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
		 */
		public function article_author_facebook() {
			if ( ! is_singular() )
				return;
	
			global $post;
			$facebook = apply_filters( 'wpseo_opengraph_author_facebook', get_the_author_meta( 'facebook', $post->post_author ) );
	
			if ( $facebook && ( is_string( $facebook ) && $facebook !== '' ) )
				$this->og_tag( 'article:author', $facebook );
		}
	
		/**
		 * Outputs the websites FB page.
		 *
		 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
		 */
		public function website_facebook() {
			if ( $this->options['facebook_site'] !== '' )
				$this->og_tag( 'article:publisher', $this->options['facebook_site'] );
		}
	
		/**
		 * Outputs the site owner
		 */
		public function site_owner() {
			if ( 0 != $this->options['fbadminapp'] ) {
				$this->og_tag( 'fb:app_id', $this->options['fbadminapp'] );
			}
			else if ( is_array( $this->options['fb_admins'] ) && count( $this->options['fb_admins'] ) > 0 ) {
				$adminstr = '';
				foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
					if ( ! empty( $adminstr ) )
						$adminstr .= ',' . $admin_id;
					else
						$adminstr = $admin_id;
				}
				$adminstr = apply_filters( 'wpseo_opengraph_admin', $adminstr );
				if ( is_string( $adminstr ) && $adminstr !== '' )
					$this->og_tag( 'fb:admins', $adminstr );
			}
		}
	
		/**
		 * Outputs the SEO title as OpenGraph title.
		 *
		 * @param bool $echo Whether or not to echo the output.
		 *
		 * @return string $title
		 */
		public function og_title( $echo = true ) {
			$title = apply_filters( 'wpseo_opengraph_title', $this->title( '' ) );
	
			if ( is_string( $title ) && $title !== '' ) {
				if ( $echo !== false )
					$this->og_tag( 'og:title', $title );
			}
	
			return $title;
		}
	
		/**
		 * Outputs the canonical URL as OpenGraph URL, which consolidates likes and shares.
		 */
		public function url() {
			$url = apply_filters( 'wpseo_opengraph_url', $this->canonical( false ) );
			if ( is_string( $url ) && $url !== '' )
				$this->og_tag( 'og:url', esc_url( $url ) );
		}
	
		/**
		 * Output the locale, doing some conversions to make sure the proper Facebook locale is outputted.
		 *
		 * Last update/compare with FB list done on July 14, 2013 by JRF
		 * Results: 1 new locale added, found 32 in the below list which are not in the FB list (not removed), 76 OK.
		 * @see http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales
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
				'zh' => 'zh_CN',
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
				'se_NO', 'ps_AF', 'tl_ST', 'fy_NL',
			);
	
			// check to see if the locale is a valid FB one, if not, use en_US as a fallback
			if ( ! in_array( $locale, $fb_valid_fb_locales ) )
				$locale = 'en_US';
	
			if ( $echo !== false )
				$this->og_tag( 'og:locale', $locale );
	
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
				if ( ! $type || $type == '' )
					$type = 'article';
			}
			else {
				$type = 'website';
			}
			$type = apply_filters( 'wpseo_opengraph_type', $type );
	
			if ( is_string( $type ) && $type !== '' ) {
				if ( $echo !== false )
					$this->og_tag( 'og:type', $type );
				else
					return $type;
			}
	
			return '';
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
			if ( ! empty( $img ) ) {
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
	
				$this->og_tag( 'og:image', esc_url( $img ) );
			}
	
			return true;
		}
	
		/**
		 * Output the OpenGraph image elements for all the images within the current post/page.
		 *
		 * @return bool
		 */
		public function image() {
	
			global $post;
	
			if ( is_front_page() ) {
				if ( $this->options['og_frontpage_image'] !== '' )
					$this->image_output( $this->options['og_frontpage_image'] );
			}
	
			if ( is_singular() ) {
				$ogimg = wpseo_get_value( 'opengraph-image' );
				if ( $ogimg ) {
					$this->image_output( $ogimg );
					return;
				}
	
				if ( function_exists( 'has_post_thumbnail' ) && has_post_thumbnail( $post->ID ) ) {
					$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), apply_filters( 'wpseo_opengraph_image_size', 'original' ) );
					$this->image_output( $thumb[0] );
				}
	
				$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );
	
				if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
					foreach ( $matches[0] as $img ) {
						if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) )
							$this->image_output( $match[2] );
					}
				}
			}
	
			if ( count( $this->shown_images ) == 0 && $this->options['og_default_image'] !== '' )
				$this->image_output( $this->options['og_default_image'] );
	
			// @TODO add G+ image stuff
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
				$ogdesc = ( $this->options['og_frontpage_desc'] !== '' ) ? $this->options['og_frontpage_desc'] : $this->metadesc( false );
			}
	
			if ( is_singular() ) {
				$ogdesc = wpseo_get_value( 'opengraph-description' );
				if ( ! $ogdesc ) {
					$ogdesc = $this->metadesc( false );
				}
	
				// og:description is still blank so grab it from get_the_excerpt()
				if ( ! $ogdesc ) {
					$ogdesc = str_replace( '[&hellip;]', '&hellip;', strip_tags( get_the_excerpt() ) );
				}
			}
	
			if ( is_tax() ) {
				$ogdesc = trim( strip_tags( term_description() ) );
			}
	
			$ogdesc = apply_filters( 'wpseo_opengraph_desc', $ogdesc );
	
			if ( $ogdesc && ( is_string( $ogdesc ) && $ogdesc != '' ) ) {
				if ( $echo !== false )
					$this->og_tag( 'og:description', $ogdesc );
			}
			return $ogdesc;
		}
	
		/**
		 * Output the site name straight from the blog info.
		 */
		public function site_name() {
			$name = apply_filters( 'wpseo_opengraph_site_name', get_bloginfo( 'name' ) );
			if ( is_string( $name ) && $name !== '' )
				$this->og_tag( 'og:site_name', $name );
		}
	
		/**
		 * Output the article tags as article:tag tags.
		 */
		public function tags() {
			if ( ! is_singular() )
				return;
	
			$tags = get_the_tags();
			if ( ! is_wp_error( $tags ) && is_array( $tags ) ) {
				foreach ( $tags as $tag ) {
					$this->og_tag( 'article:tag', $tag->name );
				}
			}
		}
	
		/**
		 * Output the article category as an article:section tag.
		 */
		public function category() {
			if ( ! is_singular() )
				return;
	
			$terms = get_the_category();
			if ( ! is_wp_error( $terms ) && is_array( $terms ) ) {
				foreach ( $terms as $term ) {
					$this->og_tag( 'article:section', $term->name );
				}
			}
		}
	
		/**
		 * Output the article publish and last modification date
		 */
		public function publish_date() {
			if ( ! is_singular() )
				return;
	
			$pub = get_the_date( 'c' );
			$this->og_tag( 'article:published_time', $pub );
	
			$mod = get_the_modified_date( 'c' );
			if ( $mod != $pub ) {
				$this->og_tag( 'article:modified_time', $mod );
			}
		}
	
	} /* End of class */
	
	global $wpseo_og;
	$wpseo_og = new WPSEO_OpenGraph;
	
} /* End of class-exists wrapper */