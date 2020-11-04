<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * Collects anonymized settings data.
 */
class WPSEO_Tracking_Settings_Data implements WPSEO_Collection {

	/**
	 * The options that need to be anonymized before they can be sent elsewhere.
	 *
	 * @var array $anonymous_settings All of the option_names which need to be
	 * anonymized before they can be sent elsewhere.
	 */
	private $anonymous_settings = [
		'baiduverify',
		'googleverify',
		'msverify',
		'yandexverify',
		'myyoast-oauth',
		'website_name',
		'alternate_website_name',
		'company_logo',
		'company_name',
		'person_name',
		'person_logo',
		'person_logo_id',
		'company_logo_id',
		'facebook_site',
		'instagram_url',
		'linkedin_url',
		'myspace_url',
		'og_default_image',
		'og_default_image_id',
		'og_frontpage_title',
		'og_frontpage_desc',
		'og_frontpage_image',
		'og_frontpage_image_id',
		'pinterest_url',
		'pinterestverify',
		'twitter_site',
		'youtube_url',
		'wikipedia_url',
		'fbadminapp',
		'semrush_tokens',
		'zapier_api_key',
	];

	/**
	 * The options we want to track.
	 *
	 * @var array $include_list The option_names for the options we want to track.
	 */
	private $include_list = [
		'ms_defaults_set',
		'version',
		'disableadvanced_meta',
		'ryte_indexability',
		'baiduverify',
		'googleverify',
		'msverify',
		'yandexverify',
		'site_type',
		'has_multiple_authors',
		'environment_type',
		'content_analysis_active',
		'keyword_analysis_active',
		'enable_admin_bar_menu',
		'enable_cornerstone_content',
		'enable_xml_sitemap',
		'enable_text_link_counter',
		'show_onboarding_notice',
		'first_activated_on',
		'myyoast-oauth',
		'dynamic_permalinks',
		'website_name',
		'alternate_website_name',
		'company_logo',
		'company_name',
		'company_or_person',
		'person_name',
		'forcerewritetitle',
		'separator',
		'title-home-wpseo',
		'title-author-wpseo',
		'title-archive-wpseo',
		'title-search-wpseo',
		'title-404-wpseo',
		'metadesc-home-wpseo',
		'metadesc-author-wpseo',
		'metadesc-archive-wpseo',
		'rssbefore',
		'rssafter',
		'noindex-author-wpseo',
		'noindex-author-noposts-wpseo',
		'noindex-archive-wpseo',
		'disable-author',
		'disable-date',
		'disable-post_format',
		'disable-attachment',
		'is-media-purge-relevant',
		'breadcrumbs-404crumb',
		'breadcrumbs-display-blog-page',
		'breadcrumbs-boldlast',
		'breadcrumbs-archiveprefix',
		'breadcrumbs-enable',
		'breadcrumbs-home',
		'breadcrumbs-prefix',
		'breadcrumbs-searchprefix',
		'breadcrumbs-sep',
		'person_logo',
		'person_logo_id',
		'company_logo_id',
		'company_or_person_user_id',
		'stripcategorybase',
		'noindex-post',
		'display-metabox-pt-post',
		'noindex-page',
		'display-metabox-pt-page',
		'noindex-attachment',
		'display-metabox-pt-attachment',
		'display-metabox-tax-category',
		'noindex-tax-category',
		'display-metabox-tax-post_tag',
		'noindex-tax-post_tag',
		'display-metabox-tax-post_format',
		'noindex-tax-post_format',
		'taxonomy-category-ptparent',
		'taxonomy-post_tag-ptparent',
		'taxonomy-post_format-ptparent',
		'breadcrumbs-blog-remove',
		'hideeditbox-post',
		'hideeditbox-page',
		'hideeditbox-attachment',
		'hideeditbox-tax-category',
		'hideeditbox-tax-post_tag',
		'hideeditbox-tax-post_format',
		'facebook_site',
		'instagram_url',
		'linkedin_url',
		'myspace_url',
		'og_default_image',
		'og_default_image_id',
		'og_frontpage_title',
		'og_frontpage_desc',
		'og_frontpage_image',
		'og_frontpage_image_id',
		'opengraph',
		'pinterest_url',
		'pinterestverify',
		'twitter',
		'twitter_site',
		'twitter_card_type',
		'youtube_url',
		'wikipedia_url',
		'fbadminapp',
		'indexables_indexing_completed',
		'semrush_integration_active',
		'semrush_tokens',
		'semrush_country_code',
		'enable_enhanced_slack_sharing',
		'zapier_integration_active',
		'zapier_api_key',
	];

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_tracking_settings_include_list' - Allow filtering the settings included in tracking.
		 *
		 * @api string $include_list the list with included setting names.
		 */
		$this->include_list = apply_filters( 'wpseo_tracking_settings_include_list', $this->include_list );

		$options = WPSEO_Options::get_all();
		// Returns the settings of which the keys intersect with the values of the include list.
		$options = array_intersect_key( $options, array_flip( $this->include_list ) );

		return [
			'settings' => $this->anonymize_settings( $options ),
		];
	}

	/**
	 * Anonimizes the WPSEO_Options array by replacing all $anonymous_settings values to 'used'.
	 *
	 * @param array $settings The settings.
	 *
	 * @return array The anonymized settings.
	 */
	private function anonymize_settings( $settings ) {
		foreach ( $this->anonymous_settings as $setting ) {
			if ( ! empty( $settings[ $setting ] ) ) {
				$settings[ $setting ] = 'used';
			}
		}

		return $settings;
	}
}
