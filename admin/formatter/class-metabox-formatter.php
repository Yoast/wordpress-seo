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
	 * @return array
	 */
	private function get_defaults() {
		return array(
			'search_url'        => '',
			'post_edit_url'     => '',
			'base_url'          => '',
			'contentTab'        => __( 'Readability', 'wordpress-seo' ),
			'keywordTab'        => __( 'Keyword:', 'wordpress-seo' ),
			'enterFocusKeyword' => __( 'Enter your focus keyword', 'wordpress-seo' ),
			'locale'            => get_locale(),
			'translations'      => $this->get_translations(),
			'keyword_usage'     => array(),
			'title_template'    => '',
			'metadesc_template' => '',
			'contentAnalysisActive' => $this->is_content_analysis_active(),
			'keywordAnalysisActive' => $this->is_keyword_analysis_active(),

			/**
			 * Filter to determine if the markers should be enabled or not.
			 *
			 * @param bool $showMarkers Should the markers being enabled. Default = true.
			 */
			'show_markers'      => apply_filters( 'wpseo_enable_assessment_markers', true ),
			'publish_box'       => array(
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
		);

	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}

		return array();
	}

	/**
	 * Determines if the content analysis is active or not.
	 *
	 * @return bool Whether or not the content analysis is active.
	 */
	private function is_content_analysis_active() {
		$options = WPSEO_Options::get_option( 'wpseo_titles' );

		if ( ! $options['content-analysis-active'] ) {
			return 0;
		}

		return ( ! get_the_author_meta( 'wpseo_content_analysis_disable', get_current_user_id() ) ) ? 1 : 0;
	}

	/**
	 * Determines if the keyword analysis is active or not.
	 *
	 * @return bool Whether or not the keyword analysis is active.
	 */
	private function is_keyword_analysis_active() {
		$options = WPSEO_Options::get_option( 'wpseo_titles' );

		if ( ! $options['keyword-analysis-active'] ) {
			return 0;
		}

		return ( ! get_the_author_meta( 'wpseo_keyword_analysis_disable', get_current_user_id() ) ) ? 1 : 0;
	}
}
