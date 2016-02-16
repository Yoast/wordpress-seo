<?php
/**
 * @package WPSEO\Admin|Scraper
 */

/**
 * This class provides data for the js term scraper by return its values for localization
 */

class WPSEO_Term_Scraper extends WPSEO_Scraper {

	/**
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * WPSEO_Taxonomy_Scraper constructor.
	 *
	 * @param WP_Term|stdClass $term
	 * @param stdClass         $taxonomy
	 */
	public function __construct( $taxonomy, $term ) {
		$this->term     = $term;
		$this->taxonomy = $taxonomy;
		$this->options  = WPSEO_Options::get_option( 'wpseo_titles' );
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = parent::get_defaults();

		if ( is_object( $this->term ) && property_exists( $this->term, 'taxonomy' ) ) {
			// Todo: a column needs to be added on the termpages to add a filter for the keyword, so this can be used in the focus kw doubles.
			$values_to_set = array(
				'taxonomy'          => $this->term->taxonomy,
				'keyword_usage'     => $this->get_focus_keyword_usage(),
				'title_template'    => $this->get_title_template(),
				'metadesc_template' => $this->get_metadesc_template(),
			);

			$values = $values_to_set + $values;
		}

		return $values;
	}

	/**
	 * Returns the url to search for keyword for the taxonomy
	 *
	 * @return string
	 */
	protected function search_url() {
		return admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy
	 *
	 * @return string
	 */
	protected function edit_url() {
		return admin_url( 'edit-tags.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account
	 *
	 * @return string
	 */
	protected function get_base_url_for_js() {
		$base_url = home_url( '/', null );
		$options  = WPSEO_Options::get_option( 'wpseo_permalinks' );
		if ( ! $options['stripcategorybase'] ) {
			$base_url = trailingslashit( $base_url . $this->taxonomy->rewrite['slug'] );
		}

		return $base_url;
	}

	/**
	 * Counting the number of given keyword used for other term than given term_id
	 *
	 * @return array
	 */
	private function get_focus_keyword_usage() {
		$focuskw  = WPSEO_Taxonomy_Meta::get_term_meta( $this->term, $this->term->taxonomy, 'focuskw' );

		return WPSEO_Taxonomy_Meta::get_keyword_usage( $focuskw, $this->term->term_id, $this->term->taxonomy );
	}

	/**
	 * Retrieves the title template.
	 *
	 * @return string
	 */
	private function get_title_template() {
		$needed_option = 'title-tax-' . $this->term->taxonomy;

		return $this->get_template( $needed_option );
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string
	 */
	private function get_metadesc_template() {
		$template_option_name = 'metadesc-tax-' . $this->term->taxonomy;

		return $this->get_template( $template_option_name );
	}


}