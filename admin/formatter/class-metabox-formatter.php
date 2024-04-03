<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Application\Integrations\Integration_Information_Repository;

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
	 * @return array<string,string|array<string|int|bool>|bool|int>
	 */
	public function get_values() {
		$defaults = $this->get_defaults();
		$values   = $this->formatter->get_values();

		return ( $values + $defaults );
	}

	/**
	 * Returns array with all the values always needed by a scraper object.
	 *
	 * @return array<string,string|array<string|int|bool>|bool|int> Default settings for the metabox.
	 */
	private function get_defaults() {
		$schema_types = new Schema_Types();
		$host         = YoastSEO()->helpers->url->get_url_host( get_site_url() );

		$defaults = [
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
			'userLocale'                         => get_user_locale(),
			'translations'                       => $this->get_translations(),
			'keyword_usage'                      => [],
			'title_template'                     => '',
			'metadesc_template'                  => '',
			'intl'                               => $this->get_content_analysis_component_translations(),
			'isRtl'                              => is_rtl(),
			'isPremium'                          => YoastSEO()->helpers->product->is_premium(),
			'siteIconUrl'                        => get_site_icon_url(),
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
			/**
			 * Filter to determine if the markers should be enabled or not.
			 *
			 * @param bool $showMarkers Should the markers being enabled. Default = true.
			 */
			'show_markers'                       => apply_filters( 'wpseo_enable_assessment_markers', true ),
			'analysisHeadingTitle'               => __( 'Analysis', 'wordpress-seo' ),
			'zapierIntegrationActive'            => WPSEO_Options::get( 'zapier_integration_active', false ) ? 1 : 0,
			'zapierConnectedStatus'              => ! empty( WPSEO_Options::get( 'zapier_subscription', [] ) ) ? 1 : 0,
			'wordproofIntegrationActive'         => YoastSEO()->helpers->wordproof->is_active() ? 1 : 0,
			'getJetpackBoostPrePublishLink'      => WPSEO_Shortlinker::get( 'https://yoa.st/jetpack-boost-get-prepublish?domain=' . $host ),
			'upgradeJetpackBoostPrePublishLink'  => WPSEO_Shortlinker::get( 'https://yoa.st/jetpack-boost-upgrade-prepublish?domain=' . $host ),
			'woocommerceUpsellSchemaLink'        => WPSEO_Shortlinker::get( 'https://yoa.st/product-schema-metabox' ),
			'woocommerceUpsellGooglePreviewLink' => WPSEO_Shortlinker::get( 'https://yoa.st/product-google-preview-metabox' ),
		];

		$integration_information_repo = YoastSEO()->classes->get( Integration_Information_Repository::class );

		$enabled_integrations  = $integration_information_repo->get_integration_information();
		$defaults              = array_merge( $defaults, $enabled_integrations );
		$enabled_features_repo = YoastSEO()->classes->get( Enabled_Analysis_Features_Repository::class );

		$enabled_features = $enabled_features_repo->get_enabled_features()->parse_to_legacy_array();
		return array_merge( $defaults, $enabled_features );
	}

	/**
	 * Returns required yoast-component translations.
	 *
	 * @return string[]
	 */
	private function get_content_analysis_component_translations() {
		// Esc_html is not needed because React already handles HTML in the (translations of) these strings.
		return [
			'locale'                                         => get_user_locale(),
			'content-analysis.errors'                        => __( 'Errors', 'wordpress-seo' ),
			'content-analysis.problems'                      => __( 'Problems', 'wordpress-seo' ),
			'content-analysis.improvements'                  => __( 'Improvements', 'wordpress-seo' ),
			'content-analysis.considerations'                => __( 'Considerations', 'wordpress-seo' ),
			'content-analysis.good'                          => __( 'Good results', 'wordpress-seo' ),
			'content-analysis.highlight'                     => __( 'Highlight this result in the text', 'wordpress-seo' ),
			'content-analysis.nohighlight'                   => __( 'Remove highlight from the text', 'wordpress-seo' ),
			'content-analysis.disabledButton'                => __( 'Marks are disabled in current view', 'wordpress-seo' ),
			/* translators: Hidden accessibility text. */
			'a11yNotice.opensInNewTab'                       => __( '(Opens in a new browser tab)', 'wordpress-seo' ),
		];
	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return string[]
	 */
	private function get_translations() {
		$locale = get_user_locale();

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
}
