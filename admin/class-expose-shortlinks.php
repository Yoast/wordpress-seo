<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Exposes shortlinks in a global, so that we can pass them to our Javascript components.
 */
class WPSEO_Expose_Shortlinks implements WPSEO_WordPress_Integration {

	/**
	 * Array containing the keys and shortlinks.
	 *
	 * @var array
	 */
	private $shortlinks = [
		'shortlinks.advanced.allow_search_engines'                  => 'https://yoa.st/allow-search-engines',
		'shortlinks.advanced.follow_links'                          => 'https://yoa.st/follow-links',
		'shortlinks.advanced.meta_robots'                           => 'https://yoa.st/meta-robots-advanced',
		'shortlinks.advanced.breadcrumbs_title'                     => 'https://yoa.st/breadcrumbs-title',
		'shortlinks.metabox.schema.explanation'                     => 'https://yoa.st/400',
		'shortlinks.metabox.schema.page_type'                       => 'https://yoa.st/402',
		'shortlinks.sidebar.schema.explanation'                     => 'https://yoa.st/401',
		'shortlinks.sidebar.schema.page_type'                       => 'https://yoa.st/403',
		'shortlinks.focus_keyword_info'                             => 'https://yoa.st/focus-keyword',
		'shortlinks.nofollow_sponsored'                             => 'https://yoa.st/nofollow-sponsored',
		'shortlinks.snippet_preview_info'                           => 'https://yoa.st/snippet-preview',
		'shortlinks.cornerstone_content_info'                       => 'https://yoa.st/1i9',
		'shortlinks.upsell.social_previews'                         => 'https://yoa.st/social-preview-cta',
		'shortlinks.upsell.sidebar.news'                            => 'https://yoa.st/get-news-sidebar',
		'shortlinks.upsell.sidebar.focus_keyword_synonyms_link'     => 'https://yoa.st/textlink-synonyms-popup-sidebar',
		'shortlinks.upsell.sidebar.focus_keyword_synonyms_button'   => 'https://yoa.st/keyword-synonyms-popup-sidebar',
		'shortlinks.upsell.sidebar.premium_seo_analysis_button'     => 'https://yoa.st/premium-seo-analysis-sidebar',
		'shortlinks.upsell.sidebar.focus_keyword_additional_link'   => 'https://yoa.st/textlink-keywords-popup-sidebar',
		'shortlinks.upsell.sidebar.focus_keyword_additional_button' => 'https://yoa.st/add-keywords-popup-sidebar',
		'shortlinks.upsell.sidebar.additional_link'                 => 'https://yoa.st/textlink-keywords-sidebar',
		'shortlinks.upsell.sidebar.additional_button'               => 'https://yoa.st/add-keywords-sidebar',
		'shortlinks.upsell.sidebar.keyphrase_distribution'          => 'https://yoa.st/keyphrase-distribution-sidebar',
		'shortlinks.upsell.sidebar.word_complexity'                 => 'https://yoa.st/word-complexity-sidebar',
		'shortlinks.upsell.metabox.news'                            => 'https://yoa.st/get-news-metabox',
		'shortlinks.upsell.metabox.go_premium'                      => 'https://yoa.st/pe-premium-page',
		'shortlinks.upsell.metabox.focus_keyword_synonyms_link'     => 'https://yoa.st/textlink-synonyms-popup-metabox',
		'shortlinks.upsell.metabox.focus_keyword_synonyms_button'   => 'https://yoa.st/keyword-synonyms-popup',
		'shortlinks.upsell.metabox.premium_seo_analysis_button'     => 'https://yoa.st/premium-seo-analysis-metabox',
		'shortlinks.upsell.metabox.focus_keyword_additional_link'   => 'https://yoa.st/textlink-keywords-popup-metabox',
		'shortlinks.upsell.metabox.focus_keyword_additional_button' => 'https://yoa.st/add-keywords-popup',
		'shortlinks.upsell.metabox.additional_link'                 => 'https://yoa.st/textlink-keywords-metabox',
		'shortlinks.upsell.metabox.additional_button'               => 'https://yoa.st/add-keywords-metabox',
		'shortlinks.upsell.metabox.keyphrase_distribution'          => 'https://yoa.st/keyphrase-distribution-metabox',
		'shortlinks.upsell.metabox.word_complexity'                 => 'https://yoa.st/word-complexity-metabox',
		'shortlinks.upsell.gsc.create_redirect_button'              => 'https://yoa.st/redirects',
		'shortlinks.readability_analysis_info'                      => 'https://yoa.st/readability-analysis',
		'shortlinks.activate_premium_info'                          => 'https://yoa.st/activate-subscription',
		'shortlinks.upsell.sidebar.morphology_upsell_metabox'       => 'https://yoa.st/morphology-upsell-metabox',
		'shortlinks.upsell.sidebar.morphology_upsell_sidebar'       => 'https://yoa.st/morphology-upsell-sidebar',
		'shortlinks.semrush.volume_help'                            => 'https://yoa.st/3-v',
		'shortlinks.semrush.trend_help'                             => 'https://yoa.st/3-v',
		'shortlinks.semrush.prices'                                 => 'https://yoa.st/semrush-prices',
		'shortlinks.semrush.premium_landing_page'                   => 'https://yoa.st/413',
		'shortlinks.wincher.seo_performance'                        => 'https://yoa.st/wincher-integration',
		'shortlinks-insights-estimated_reading_time'                => 'https://yoa.st/4fd',
		'shortlinks-insights-flesch_reading_ease'                   => 'https://yoa.st/34r',
		'shortlinks-insights-flesch_reading_ease_sidebar'           => 'https://yoa.st/4mf',
		'shortlinks-insights-flesch_reading_ease_metabox'           => 'https://yoa.st/4mg',
		'shortlinks-insights-flesch_reading_ease_article'           => 'https://yoa.st/34s',
		'shortlinks-insights-keyword_research_link'                 => 'https://yoa.st/keyword-research-metabox',
		'shortlinks-insights-upsell-sidebar-prominent_words'        => 'https://yoa.st/prominent-words-upsell-sidebar',
		'shortlinks-insights-upsell-metabox-prominent_words'        => 'https://yoa.st/prominent-words-upsell-metabox',
		'shortlinks-insights-upsell-elementor-prominent_words'      => 'https://yoa.st/prominent-words-upsell-elementor',
		'shortlinks-insights-word_count'                            => 'https://yoa.st/word-count',
	];

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'wpseo_admin_l10n', [ $this, 'expose_shortlinks' ] );
	}

	/**
	 * Adds shortlinks to the passed array.
	 *
	 * @param array $input The array to add shortlinks to.
	 *
	 * @return array The passed array with the additional shortlinks.
	 */
	public function expose_shortlinks( $input ) {
		foreach ( $this->get_shortlinks() as $key => $shortlink ) {
			$input[ $key ] = WPSEO_Shortlinker::get( $shortlink );
		}

		$input['default_query_params'] = WPSEO_Shortlinker::get_query_params();

		return $input;
	}

	/**
	 * Retrieves the shortlinks.
	 *
	 * @return array The shortlinks.
	 */
	private function get_shortlinks() {
		if ( ! $this->is_term_edit() ) {
			return $this->shortlinks;
		}

		$shortlinks = $this->shortlinks;

		$shortlinks['shortlinks.upsell.metabox.focus_keyword_synonyms_link']     = 'https://yoa.st/textlink-synonyms-popup-metabox-term';
		$shortlinks['shortlinks.upsell.metabox.focus_keyword_synonyms_button']   = 'https://yoa.st/keyword-synonyms-popup-term';
		$shortlinks['shortlinks.upsell.metabox.focus_keyword_additional_link']   = 'https://yoa.st/textlink-keywords-popup-metabox-term';
		$shortlinks['shortlinks.upsell.metabox.focus_keyword_additional_button'] = 'https://yoa.st/add-keywords-popup-term';
		$shortlinks['shortlinks.upsell.metabox.additional_link']                 = 'https://yoa.st/textlink-keywords-metabox-term';
		$shortlinks['shortlinks.upsell.metabox.additional_button']               = 'https://yoa.st/add-keywords-metabox-term';
		$shortlinks['shortlinks.upsell.sidebar.morphology_upsell_metabox']       = 'https://yoa.st/morphology-upsell-metabox-term';
		$shortlinks['shortlinks.upsell.metabox.keyphrase_distribution']          = 'https://yoa.st/keyphrase-distribution-metabox-term';
		$shortlinks['shortlinks.upsell.metabox.word_complexity']                 = 'https://yoa.st/word-complexity-metabox-term';

		return $shortlinks;
	}

	/**
	 * Checks if the current page is a term edit page.
	 *
	 * @return bool True when page is term edit.
	 */
	private function is_term_edit() {
		global $pagenow;

		return WPSEO_Taxonomy::is_term_edit( $pagenow );
	}
}
