<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

use Yoast\WP\SEO\Conditionals\Third_Party\Polylang_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\TranslatePress_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\WPML_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;

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
		$analysis_seo                = new WPSEO_Metabox_Analysis_SEO();
		$analysis_readability        = new WPSEO_Metabox_Analysis_Readability();
		$analysis_inclusive_language = new WPSEO_Metabox_Analysis_Inclusive_Language();
		$schema_types                = new Schema_Types();
		$is_wincher_active           = YoastSEO()->helpers->wincher->is_active();
		$host                        = YoastSEO()->helpers->url->get_url_host( get_site_url() );

		return [
			'author_name'                        => get_the_author_meta( 'display_name' ),
			'site_name'                          => YoastSEO()->meta->for_current_page()->site_name,
			'sitewide_social_image'              => WPSEO_Options::get( 'og_default_image' ),
			'search_url'                         => '',
			'post_edit_url'                      => '',
			'base_url'                           => '',
			'contentTab'                         => __( 'Readability', 'wordpress-seo' ),
			'keywordTab'                         => __( 'Keyphrase:', 'wordpress-seo' ),
			'removeKeyword'                      => __( 'Remove keyphrase', 'wordpress-seo' ),
			'contentLocale'                      => get_locale(),
			'userLocale'                         => \get_user_locale(),
			'translations'                       => $this->get_translations(),
			'keyword_usage'                      => [],
			'title_template'                     => '',
			'metadesc_template'                  => '',
			'contentAnalysisActive'              => $analysis_readability->is_enabled() ? 1 : 0,
			'keywordAnalysisActive'              => $analysis_seo->is_enabled() ? 1 : 0,
			'inclusiveLanguageAnalysisActive'    => $analysis_inclusive_language->is_enabled() ? 1 : 0,
			'cornerstoneActive'                  => WPSEO_Options::get( 'enable_cornerstone_content', false ) ? 1 : 0,
			'semrushIntegrationActive'           => WPSEO_Options::get( 'semrush_integration_active', true ) ? 1 : 0,
			'intl'                               => $this->get_content_analysis_component_translations(),
			'isRtl'                              => is_rtl(),
			'isPremium'                          => YoastSEO()->helpers->product->is_premium(),
			'wordFormRecognitionActive'          => YoastSEO()->helpers->language->is_word_form_recognition_active( WPSEO_Language_Utils::get_language( get_locale() ) ),
			'siteIconUrl'                        => get_site_icon_url(),
			'countryCode'                        => WPSEO_Options::get( 'semrush_country_code', false ),
			'SEMrushLoginStatus'                 => WPSEO_Options::get( 'semrush_integration_active', true ) ? $this->get_semrush_login_status() : false,
			'showSocial'                         => [
				'facebook' => WPSEO_Options::get( 'opengraph', false ),
				'twitter'  => WPSEO_Options::get( 'twitter', false ),
			],
			'schema'                             => [
				'displayFooter'      => WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ),
				'pageTypeOptions'    => $schema_types->get_page_type_options(),
				'articleTypeOptions' => $schema_types->get_article_type_options(),
			],
			'twitterCardType'                    => 'summary_large_image',

			/**
			 * Filter to determine if the markers should be enabled or not.
			 *
			 * @param bool $showMarkers Should the markers being enabled. Default = true.
			 */
			'show_markers'                       => apply_filters( 'wpseo_enable_assessment_markers', true ),
			'publish_box'                        => [
				'labels' => [
					'keyword'            => [
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
					'content'            => [
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
					'inclusive-language' => [
						'na'   => sprintf(
						/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the inclusive language score. */
							__( '%1$sInclusive language%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-inclusive-language-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Not available', 'wordpress-seo' ) . '</strong>'
						),
						'bad'  => sprintf(
						/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the inclusive language score. */
							__( '%1$sInclusive language%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-inclusive-language-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Needs improvement', 'wordpress-seo' ) . '</strong>'
						),
						'ok'   => sprintf(
						/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the inclusive language score. */
							__( '%1$sInclusive language%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-inclusive-language-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Potentially non-inclusive', 'wordpress-seo' ) . '</strong>'
						),
						'good' => sprintf(
						/* translators: %1$s expands to the opening anchor tag, %2$s to the closing anchor tag, %3$s to the inclusive language score. */
							__( '%1$sInclusive language%2$s: %3$s', 'wordpress-seo' ),
							'<a href="#yoast-inclusive-language-analysis-collapsible-metabox">',
							'</a>',
							'<strong>' . __( 'Good', 'wordpress-seo' ) . '</strong>'
						),
					],
				],
			],
			'markdownEnabled'                    => $this->is_markdown_enabled(),
			'analysisHeadingTitle'               => __( 'Analysis', 'wordpress-seo' ),
			'zapierIntegrationActive'            => WPSEO_Options::get( 'zapier_integration_active', false ) ? 1 : 0,
			'zapierConnectedStatus'              => ! empty( WPSEO_Options::get( 'zapier_subscription', [] ) ) ? 1 : 0,
			'wincherIntegrationActive'           => ( $is_wincher_active ) ? 1 : 0,
			'wincherLoginStatus'                 => ( $is_wincher_active ) ? YoastSEO()->helpers->wincher->login_status() : false,
			'wincherWebsiteId'                   => WPSEO_Options::get( 'wincher_website_id', '' ),
			'wincherAutoAddKeyphrases'           => WPSEO_Options::get( 'wincher_automatically_add_keyphrases', false ),
			'wordproofIntegrationActive'         => YoastSEO()->helpers->wordproof->is_active() ? 1 : 0,
			'multilingualPluginActive'           => $this->multilingual_plugin_active(),

			/**
			 * Filter to determine whether the PreviouslyUsedKeyword assessment should run.
			 *
			 * @param bool $previouslyUsedKeywordActive Whether the PreviouslyUsedKeyword assessment should run.
			 */
			'previouslyUsedKeywordActive'        => apply_filters( 'wpseo_previously_used_keyword_active', true ),
			'getJetpackBoostPrePublishLink'      => WPSEO_Shortlinker::get( 'https://yoa.st/jetpack-boost-get-prepublish?domain=' . $host ),
			'upgradeJetpackBoostPrePublishLink'  => WPSEO_Shortlinker::get( 'https://yoa.st/jetpack-boost-upgrade-prepublish?domain=' . $host ),
			'woocommerceUpsellSchemaLink'        => WPSEO_Shortlinker::get( 'https://yoa.st/product-schema-metabox' ),
			'woocommerceUpsellGooglePreviewLink' => WPSEO_Shortlinker::get( 'https://yoa.st/product-google-preview-metabox' ),
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

		$file = WPSEO_PATH . 'languages/wordpress-seo-' . $locale . '.json';
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
	 * @return bool
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
	 * @return bool The SEMrush login status.
	 */
	private function get_semrush_login_status() {
		try {
			$semrush_client = YoastSEO()->classes->get( SEMrush_Client::class );
		} catch ( Empty_Property_Exception $e ) {
			// Return false if token is malformed (empty property).
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

	/**
	 * Checks whether a multilingual plugin is currently active. Currently, we only check the following plugins: WPML, Polylang, and TranslatePress.
	 *
	 * @return bool Whether a multilingual plugin is currently active.
	 */
	private function multilingual_plugin_active() {
		$wpml_active           = YoastSEO()->classes->get( WPML_Conditional::class )->is_met();
		$polylang_active       = YoastSEO()->classes->get( Polylang_Conditional::class )->is_met();
		$translatepress_active = YoastSEO()->classes->get( TranslatePress_Conditional::class )->is_met();

		return ( $wpml_active || $polylang_active || $translatepress_active );
	}
}
