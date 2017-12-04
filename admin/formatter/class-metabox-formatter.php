<?php
/**
 * @package WPSEO\Admin\Formatter
 */

/**
 * This class forces needed methods for the metabox localization
 */
class WPSEO_Metabox_Formatter {

	/**
	 * @var WPSEO_Metabox_Formatter_Interface Object that provides formatted values.
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
	 * Returns the values
	 *
	 * @return array
	 */
	public function get_values() {
		$defaults = $this->get_defaults();
		$values   = $this->formatter->get_values();

		return ( $values + $defaults );
	}

	/**
	 * Returns array with all the values always needed by a scraper object
	 *
	 * @return array Default settings for the metabox.
	 */
	private function get_defaults() {
		$analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$analysis_readability = new WPSEO_Metabox_Analysis_Readability();

		return array(
			'language'              => WPSEO_Language_Utils::get_site_language_name(),
			'settings_link'         => $this->get_settings_link(),
			'search_url'            => '',
			'post_edit_url'         => '',
			'base_url'              => '',
			'contentTab'            => __( 'Readability', 'wordpress-seo' ),
			'keywordTab'            => __( 'Keyword:', 'wordpress-seo' ),
			'enterFocusKeyword'     => __( 'Enter your focus keyword', 'wordpress-seo' ),
			'removeKeyword'         => __( 'Remove keyword', 'wordpress-seo' ),
			'contentLocale'         => get_locale(),
			'userLocale'            => WPSEO_Utils::get_user_locale(),
			'translations'          => $this->get_translations(),
			'keyword_usage'         => array(),
			'title_template'        => '',
			'metadesc_template'     => '',
			'contentAnalysisActive' => $analysis_readability->is_enabled() ? 1 : 0,
			'keywordAnalysisActive' => $analysis_seo->is_enabled() ? 1 : 0,
			'intl'                  => $this->get_content_analysis_component_translations(),
			/**
			 * Filter to determine if the markers should be enabled or not.
			 *
			 * @param bool $showMarkers Should the markers being enabled. Default = true.
			 */
			'show_markers'          => apply_filters( 'wpseo_enable_assessment_markers', true ),
			'publish_box'           => array(
				'labels'   => array(
					'content' => __( 'Readability', 'wordpress-seo' ),
					'keyword' => __( 'SEO', 'wordpress-seo' ),
				),
				'statuses' => array(
					'na'   => __( 'Not available', 'wordpress-seo' ),
					'bad'  => __( 'Needs improvement', 'wordpress-seo' ),
					'ok'   => __( 'OK', 'wordpress-seo' ),
					'good' => __( 'Good', 'wordpress-seo' ),
				),
			),
			'markdownEnabled'       => $this->is_markdown_enabled(),
		);
	}

	/**
	 * Returns a link to the settings page, if the user has the right capabilities.
	 * Returns an empty string otherwise.
	 *
	 * @return string The settings link.
	 */
	private function get_settings_link() {
		if ( current_user_can( 'manage_options' ) ) {
			return admin_url( 'options-general.php' );
		}

		return '';
	}

	/**
	 * Returns required yoast-component translations.
	 *
	 * @return array
	 */
	private function get_content_analysis_component_translations() {
		// Esc_html is not needed because React already handles HTML in the (translations of) these strings.
		return array(
			'locale'                                         => WPSEO_Utils::get_user_locale(),
			'content-analysis.language-notice-link'          => __( 'Change language', 'wordpress-seo' ),
			'content-analysis.errors'                        => __( 'Errors', 'wordpress-seo' ),
			'content-analysis.problems'                      => __( 'Problems', 'wordpress-seo' ),
			'content-analysis.improvements'                  => __( 'Improvements', 'wordpress-seo' ),
			'content-analysis.considerations'                => __( 'Considerations', 'wordpress-seo' ),
			'content-analysis.good'                          => __( 'Good', 'wordpress-seo' ),
			'content-analysis.highlight'                     => __( 'Highlight this result in the text', 'wordpress-seo' ),
			'content-analysis.language-notice'				 => sprintf(
																	/* translators: %s expands to the site language. */
																	__( 'Your site language is set to %s.', 'wordpress-seo' ),
																	'{language}'
																),
			'content-analysis.language-notice-contact-admin' => sprintf(
																	/* translators: %s expands to the site language. */
																	__( 'Your site language is set to %s. If this is not correct, contact your site administrator.', 'wordpress-seo' ),
																	'{language}'
																),
		);
	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_translations() {
		$locale = WPSEO_Utils::get_user_locale();

		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . $locale . '.json';
		if ( file_exists( $file ) ) {
			$file = file_get_contents( $file );
			if ( is_string( $file ) && $file !== '' ) {
				return json_decode( $file, true );
			}
		}

		return array();
	}

	/**
	 * Checks if Jetpack's markdown module is enabled.
	 * Can be extended to work with other plugins that parse markdown in the content.
	 *
	 * @return boolean
	 */
	private function is_markdown_enabled() {
		if ( class_exists( 'Jetpack' ) && method_exists( 'Jetpack', 'get_active_modules' ) ) {
			$active_modules = Jetpack::get_active_modules();

			return in_array( 'markdown', $active_modules, true );
		}

		return false;
	}
}
