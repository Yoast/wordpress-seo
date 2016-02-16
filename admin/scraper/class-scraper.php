<?php
/**
 * @package WPSEO\Admin|Scraper
 */

/**
 * This abstract class forces needed methods for the postscraper
 */
abstract class WPSEO_Scraper {

	/**
	 * @var array Array with the WPSEO_Titles options.
	 */
	protected $options;

	/**
	 * Returns the url to search for keyword.
	 *
	 * @return string
	 */
	abstract protected function search_url();

	/**
	 * Returns the url to edit opened item.
	 *
	 * @return string
	 */
	abstract protected function edit_url();

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account
	 *
	 * @return string
	 */
	abstract protected function get_base_url_for_js();

	/**
	 * Returns array with all the values always needed by a scraper object
	 *
	 * @return array
	 */
	protected function get_defaults() {
		return array(
			'search_url'        => $this->search_url(),
			'post_edit_url'     => $this->edit_url(),
			'contentTab'        => __( 'Content:', 'wordpress-seo' ),
			'locale'            => get_locale(),
			'base_url'          => $this->get_base_url_for_js(),
			'translations'      => $this->get_scraper_translations(),
			'keyword_usage'       => array(),
			'title_template'      => '',
			'metadesc_template'   => '',
		);
	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	protected function get_scraper_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}

		return array();
	}

	/**
	 * Retrieves a template.
	 *
	 * @param String $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	protected function get_template( $template_option_name ) {

		$template = '';
		if ( isset( $this->options[ $template_option_name ] ) && $this->options[ $template_option_name ] !== '' ) {
			$template = $this->options[ $template_option_name ];
		}

		return $template;
	}


}