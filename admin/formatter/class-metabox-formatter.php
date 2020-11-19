<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Empty_Token_Exception;

/**
 * This class forces needed methods for the metabox localization.
 */
class WPSEO_Metabox_Formatter {

	/**
	 * Object that provides formatted values.
	 *
	 * @var WPSEO_Metabox_Formatter_Interface
	 */
	private $formatter;

	/**
	 * Setting the formatter property.
	 *
	 * @param WPSEO_Metabox_Formatter_Interface $formatter Object that provides the formatted values.
	 */
	public function __construct( WPSEO_Metabox_Formatter_Interface $formatter ) {
		$this->formatter = $formatter;
	}

	/**
	 * Returns the values.
	 *
	 * @return array
	 */
	public function get_values() {
		$defaults = $this->get_defaults();
		$values   = $this->formatter->get_values();

		return ( $values + $defaults );
	}

	/**
	 * Returns array with all the values always needed by a scraper object.
	 *
	 * @return array Default settings for the metabox.
	 */
	private function get_defaults() {
		$analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$analysis_readability = new WPSEO_Metabox_Analysis_Readability();
		$schema_types         = new Schema_Types();

		return [
			'author_name'                 => get_the_author_meta( 'display_name' ),
			'site_name'                   => get_bloginfo( 'name' ),
			'sitewide_social_image'       => WPSEO_Options::get( 'og_default_image' ),
			'search_url'                  => '',
			'post_edit_url'               => '',
			'base_url'                    => '',
			'contentTab'                  => __( 'Readability', 'wordpress-seo' ),
			'keywordTab'                  => __( 'Keyphrase:', 'wordpress-seo' ),
			'removeKeyword'               => __( 'Remove keyphrase', 'wordpress-seo' ),
			'contentLocale'               => get_locale(),
			'userLocale'                  => \get_user_locale(),
			'translations'                => $this->get_translations(),
			'keyword_usage'               => [],
			'title_template'              => '',
			'metadesc_template'           => '',
			'contentAnalysisActive'       => $analysis_readability->is_enabled() ? 1 : 0,
			'keywordAnalysisActive'       => $analysis_seo->is_enabled() ? 1 : 0,
			'cornerstoneActive'           => WPSEO_Options::get( 'enable_cornerstone_content', false ) ? 1 : 0,
			'semrushIntegrationActive'    => WPSEO_Options::get( 'semrush_integration_active', true ) ? 1 : 0,
			'intl'                        => $this->get_content_analysis_component_translations(),
			'isRtl'                       => is_rtl(),
			'isPremium'                   => WPSEO_Utils::is_yoast_seo_premium(),
			'wordFormRecognitionActive'   => YoastSEO()->helpers->language->is_word_form_recognition_active( WPSEO_Language_Utils::get_language( get_locale() ) ),
			'siteIconUrl'                 => get_site_icon_url(),
			'countryCode'                 => WPSEO_Options::get( 'semrush_country_code', false ),
			'SEMrushLoginStatus'          => WPSEO_Options::get( 'semrush_integration_active', true ) ? $this->get_semrush_login_status() : false,
			'showSocial'                  => [
				'facebook' => WPSEO_Options::get( 'opengraph', false ),
				'twitter'  => WPSEO_Options::get( 'twitter', false ),
			],
			'schema'                      => [
				'displayFooter'      => WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ),
				'pageTypeOptions'    => $schema_types->get_page_type_options(),
				'articleTypeOptions' => $schema_types->get_article_type_options(),
			],
			'twitterCardType'             => YoastSEO()->helpers->options->get( 'twitter_card_type' ),

			/**
			 * Filter to determine if the markers should be enabled or not.
			 *
			 * @param bool $showMarkers Should the markers being enabled. Default = true.
			 */
			'show_markers'                => apply_filters( 'wpseo_enable_assessment_markers', true ),
			'publish_box'                 => [
				'labels' => [
					'content' => [
						'na'   => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the readability score. */
							__( '%1$sReadability%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-readability-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Not available', 'wordpress-seo' ) . '</strong>'
						),
						'bad'  => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the readability score. */
							__( '%1$sReadability%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-readability-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Needs improvement', 'wordpress-seo' ) . '</strong>'
						),
						'ok'   => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the readability score. */
							__( '%1$sReadability%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-readability-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'OK', 'wordpress-seo' ) . '</strong>'
						),
						'good' => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the readability score. */
							__( '%1$sReadability%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-readability-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Good', 'wordpress-seo' ) . '</strong>'
						),
					],
					'keyword' => [
						'na'   => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the SEO score. */
							__( '%1$sSEO%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-seo-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Not available', 'wordpress-seo' ) . '</strong>'
						),
						'bad'  => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the SEO score. */
							__( '%1$sSEO%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-seo-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Needs improvement', 'wordpress-seo' ) . '</strong>'
						),
						'ok'   => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the SEO score. */
							__( '%1$sSEO%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-seo-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'OK', 'wordpress-seo' ) . '</strong>'
						),
						'good' => sprintf(
							/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the SEO score. */
							__( '%1$sSEO%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-seo-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Good', 'wordpress-seo' ) . '</strong>'
						),
					],
				],
			],
			'markdownEnabled'             => $this->is_markdown_enabled(),
			'analysisHeadingTitle'        => __( 'Analysis', 'wordpress-seo' ),
			'zapierIntegrationActive'     => WPSEO_Options::get( 'zapier_integration_active', false ) ? 1 : 0,
			'zapierConnectedStatus'       => ! empty( WPSEO_Options::get( 'zapier_subscription', [] ) ) ? 1 : 0,

			/**
			 * Filter to determine whether the PreviouslyUsedKeyword assessment should run.
			 *
			 * @param bool $previouslyUsedKeywordActive Whether the PreviouslyUsedKeyword assessment should run.
			 */
			'previouslyUsedKeywordActive' => apply_filters( 'wpseo_previously_used_keyword_active', true ),
		];
	}

	/**
	 * Returns required yoast-component translations.
	 *
	 * @return array
	 */
	private function get_content_analysis_component_translations() {
		// Esc_html is not needed because React already handles HTML in the (translations of) these strings.
		return [
			'locale'                                         => \get_user_locale(),
			'content-analysis.errors'                        => __( 'Errors', 'wordpress-seo' ),
			'content-analysis.problems'                      => __( 'Problems', 'wordpress-seo' ),
			'content-analysis.improvements'                  => __( 'Improvements', 'wordpress-seo' ),
			'content-analysis.considerations'                => __( 'Considerations', 'wordpress-seo' ),
			'content-analysis.good'                          => __( 'Good results', 'wordpress-seo' ),
			'content-analysis.highlight'                     => __( 'Highlight this result in the text', 'wordpress-seo' ),
			'content-analysis.nohighlight'                   => __( 'Remove highlight from the text', 'wordpress-seo' ),
			'content-analysis.disabledButton'                => __( 'Marks are disabled in current view', 'wordpress-seo' ),
			'a11yNotice.opensInNewTab'                       => __( '(Opens in a new browser tab)', 'wordpress-seo' ),
		];
	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_translations() {
		$locale = \get_user_locale();

		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . $locale . '.json';
		if ( file_exists( $file ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Retrieving a local file.
			$file = file_get_contents( $file );
			if ( is_string( $file ) && $file !== '' ) {
				return json_decode( $file, true );
			}
		}

		return [];
	}

	/**
	 * Checks if Jetpack's markdown module is enabled.
	 * Can be extended to work with other plugins that parse markdown in the content.
	 *
	 * @return boolean
	 */
	private function is_markdown_enabled() {
		$is_markdown = false;

		if ( class_exists( 'Jetpack' ) && method_exists( 'Jetpack', 'get_active_modules' ) ) {
			$active_modules = Jetpack::get_active_modules();

			// First at all, check if Jetpack's markdown module is active.
			$is_markdown = in_array( 'markdown', $active_modules, true );
		}

		/**
		 * Filters whether markdown support is active in the readability- and seo-analysis.
		 *
		 * @since 11.3
		 *
		 * @param array $is_markdown Is markdown support for Yoast SEO active.
		 */
		return apply_filters( 'wpseo_is_markdown_enabled', $is_markdown );
	}

	/**
	 * Checks if the user is logged in to SEMrush.
	 *
	 * @return boolean The SEMrush login status.
	 */
	private function get_semrush_login_status() {
		try {
			$semrush_client = YoastSEO()->classes->get( SEMrush_Client::class );
		} catch ( Empty_Property_Exception $e ) {
			// return false if token is malformed (empty property).
			return false;
		}

		// Get token (and refresh it if it's expired).
		try {
			$semrush_client->get_tokens();
		} catch ( Authentication_Failed_Exception $e ) {
			return false;
		} catch ( Empty_Token_Exception $e ) {
			return false;
		}

		return $semrush_client->has_valid_tokens();
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Returns the translations for the Add Keyword modal.
	 *
	 * These strings are not escaped because they're meant to be used with React
	 * which already takes care of that. If used in PHP, they should be escaped.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @return array Translated text strings for the Add Keyword modal.
	 */
	public function get_add_keyword_upsell_translations() {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		return [
			'title'                    => __( 'Would you like to add more than one keyphrase?', 'wordpress-seo' ),
			'intro'                    => sprintf(
			/* translators: %s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
				__( 'Great news: you can, with %s!', 'wordpress-seo' ),
				'{{link}}Yoast SEO Premium{{/link}}'
			),
			'link'                     => WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
			'other'                    => sprintf(
			/* translators: %s expands to 'Yoast SEO Premium'. */
				__( 'Other benefits of %s for you:', 'wordpress-seo' ),
				'Yoast SEO Premium'
			),
			'buylink'                  => WPSEO_Shortlinker::get( 'https://yoa.st/add-keywords-popup' ),
			'buy'                      => sprintf(
			/* translators: %s expands to 'Yoast SEO Premium'. */
				__( 'Get %s', 'wordpress-seo' ),
				'Yoast SEO Premium'
			),
			'small'                    => __( '1 year free support and updates included!', 'wordpress-seo' ),
			'a11yNotice.opensInNewTab' => __( '(Opens in a new browser tab)', 'wordpress-seo' ),
		];
	}
}
