<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Models\Indexable;

/**
 * Class Indexable_Presentation
 *
 * @property string title
 * @property string meta_description
 * @property array  robots
 * @property string canonical
 * @property string og_type
 * @property string og_title
 * @property string og_description
 * @property array  og_images
 * @property string og_url
 * @property string og_article_publisher
 * @property string og_article_author
 * @property string og_article_publish_time
 * @property string og_article_modified_time
 * @property string og_locale
 * @property string twitter_card
 * @property string twitter_title
 * @property string twitter_description
 * @property string twitter_image
 * @property array  replace_vars_object
 */
class Indexable_Presentation extends Abstract_Presentation {

	/**
	 * @var Indexable
	 */
	protected $model;

	/**
	 * @var Robots_Helper
	 */
	protected $robots_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * @required
	 *
	 * Used by dependency injection container to inject the Robots_Helper.
	 *
	 * @param Robots_Helper       $robots_helper       The robots helper.
	 * @param Image_Helper        $image_helper        The image helper.
	 * @param Options_Helper      $options_helper      The options helper.
	 */
	public function set_helpers(
		Robots_Helper $robots_helper,
		Image_Helper $image_helper,
		Options_Helper $options_helper
	) {
		$this->robots_helper  = $robots_helper;
		$this->image_helper   = $image_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * Generates the title.
	 *
	 * @return string The title.
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}
		return '';
	}

	/**
	 * Generates the meta description.
	 *
	 * @return string The meta description.
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}
		return '';
	}

	/**
	 * Generates the robots value.
	 *
	 * @return array The robots value.
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * Generates the canonical.
	 *
	 * @return string The canonical.
	 */
	public function generate_canonical() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}
		return '';
	}

	/**
	 * Generates the og type.
	 *
	 * @return string The og type.
	 */
	public function generate_og_type() {
		return 'website';
	}

	/**
	 * Generates the open graph title.
	 *
	 * @return string The open graph title.
	 */
	public function generate_og_title() {
		if ( $this->model->og_title ) {
			return $this->model->og_title;
		}

		return $this->title;
	}

	/**
	 * Generates the open graph description.
	 *
	 * @return string The open graph description.
	 */
	public function generate_og_description() {
		if ( $this->model->og_description ) {
			return $this->model->og_description;
		}

		return $this->meta_description;
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( $this->model->og_image_id === null && $this->model->og_image ) {
			return [ $this->model->og_image ];
		}

		if ( $this->model->og_image_id ) {
			$attachment = $this->get_attachment_url_by_id( $this->model->og_image_id );
			if ( $attachment ) {
				return [ $attachment ];
			}
		}

		return [];
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_og_url() {
		return $this->canonical;
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_og_article_publisher() {
		return '';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_og_article_author() {
		return '';
	}

	/**
	 * Generates the open graph article publish time.
	 *
	 * @return string The open graph article publish time.
	 */
	public function generate_og_article_publish_time() {
		return '';
	}

	/**
	 * Generates the open graph article modified time.
	 *
	 * @return string The open graph article modified time.
	 */
	public function generate_og_article_modified_time() {
		return '';
	}

	/**
	 * Generates the open graph locale.
	 *
	 * @return string The open graph locale.
	 */
	public function generate_og_locale() {
		/**
		 * Filter: 'wpseo_locale' - Allow changing the locale output.
		 *
		 * Note that this filter is different from `wpseo_og_locale`, which is run _after_ the OG specific filtering.
		 *
		 * @api string Locale string.
		 */
		$locale = \apply_filters( 'wpseo_locale', \get_locale() );

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

		return $locale;
	}

	/**
	 * Generates the twitter card type.
	 *
	 * @return string The twitter card type.
	 */
	public function generate_twitter_card() {
		return '';
	}

	/**
	 * Generates the twitter title.
	 *
	 * @return string The twitter title.
	 */
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		return '';
	}

	/**
	 * Generates the twitter description.
	 *
	 * @return string The twitter description.
	 */
	public function generate_twitter_description() {
		if ( $this->model->twitter_description ) {
			return $this->model->twitter_description;
		}

		if ( $this->meta_description ) {
			return $this->meta_description;
		}

		return '';
	}

	/**
	 * Generates the twitter image.
	 *
	 * @return string The twitter image.
	 */
	public function generate_twitter_image() {
		if ( $this->model->twitter_image ) {
			return $this->model->twitter_image;
		}

		return '';
	}

	/**
	 * Generates the replace vars object.
	 *
	 * @return array The replace vars object.
	 */
	public function generate_replace_vars_object() {
		return [];
	}

	/**
	 * Retrieves the attachment by a given image id.
	 *
	 * @param int $attachment_id The attachment id.
	 *
	 * @return string|false The url when found, false when not.
	 */
	protected function get_attachment_url_by_id( $attachment_id ) {
		/**
		 * Filter: 'wpseo_opengraph_image_size' - Allow overriding the image size used
		 * for OpenGraph sharing. If this filter is used, the defined size will always be
		 * used for the og:image. The image will still be rejected if it is too small.
		 *
		 * Only use this filter if you manually want to determine the best image size
		 * for the `og:image` tag.
		 *
		 * Use the `wpseo_image_sizes` filter if you want to use our logic. That filter
		 * can be used to add an image size that needs to be taken into consideration
		 * within our own logic.
		 *
		 * @api string|false $size Size string.
		 */
		$override_image_size = apply_filters( 'wpseo_opengraph_image_size', null );

		if ( $override_image_size ) {
			return $this->image_helper->get_image( $attachment_id, $override_image_size );
		}

		return $this->image_helper->get_attachment_variations(
			$attachment_id,
			[
				'min_width'  => 200,
				'max_width'  => 2000,
				'min_height' => 200,
				'max_height' => 2000,
			]
		);
	}

	/**
	 * Retrieves the default OpenGraph image.
	 *
	 * @return string|false The retrieved image.
	 */
	protected function get_default_og_image() {
		if ( $this->options_helper->get( 'opengraph' ) !== true ) {
			return '';
		}

		$default_image_id  = $this->options_helper->get( 'og_default_image_id', '' );

		if ( $default_image_id ) {
			$attachment_url = $this->get_attachment_url_by_id( $this->model->og_image_id );
			if ( $attachment_url ) {
				return $attachment_url;
			}
		}

		$default_image_url = $this->options_helper->get( 'og_default_image', '' );
		if ( $default_image_url ) {
			return $default_image_url;
		}

		return '';
	}
}
