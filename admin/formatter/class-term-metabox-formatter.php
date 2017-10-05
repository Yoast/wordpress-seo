<?php
/**
 * @package WPSEO\Admin\Formatter
 */

/**
 * This class provides data for the term metabox by return its values for localization
 */
class WPSEO_Term_Metabox_Formatter implements WPSEO_Metabox_Formatter_Interface {

	/**
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * @var array Array with the WPSEO_Titles options.
	 */
	protected $options;

	/**
	 * WPSEO_Taxonomy_Scraper constructor.
	 *
	 * @param stdClass         $taxonomy Taxonomy.
	 * @param WP_Term|stdClass $term     Term.
	 * @param array            $options  Options with WPSEO_Titles.
	 */
	public function __construct( $taxonomy, $term, array $options ) {
		$this->term     = $term;
		$this->taxonomy = $taxonomy;
		$this->options  = $options;
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = array();

		// Todo: a column needs to be added on the termpages to add a filter for the keyword, so this can be used in the focus kw doubles.
		if ( is_object( $this->term ) && property_exists( $this->term, 'taxonomy' ) ) {
			$values = array(
				'search_url'        => $this->search_url(),
				'post_edit_url'     => $this->edit_url(),
				'base_url'          => $this->base_url_for_js(),
				'taxonomy'          => $this->term->taxonomy,
				'keyword_usage'     => $this->get_focus_keyword_usage(),
				'title_template'    => $this->get_title_template(),
				'metadesc_template' => $this->get_metadesc_template(),
			);
		}

		return $values;
	}

	/**
	 * Returns the url to search for keyword for the taxonomy
	 *
	 * @return string
	 */
	private function search_url() {
		return admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy
	 *
	 * @return string
	 */
	private function edit_url() {
		global $wp_version;
		$script_filename = version_compare( $wp_version, '4.5', '<' ) ? 'edit-tags' : 'term';
		return admin_url( $script_filename . '.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account
	 *
	 * @return string
	 */
	private function base_url_for_js() {

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
		$focuskw = WPSEO_Taxonomy_Meta::get_term_meta( $this->term, $this->term->taxonomy, 'focuskw' );

		return WPSEO_Taxonomy_Meta::get_keyword_usage( $focuskw, $this->term->term_id, $this->term->taxonomy );
	}

	/**
	 * Retrieves the title template.
	 *
	 * @return string
	 */
	private function get_title_template() {
		return $this->get_template( 'title' );
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string
	 */
	private function get_metadesc_template() {
		return $this->get_template( 'metadesc' );
	}

	/**
	 * Retrieves a template.
	 *
	 * @param String $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private function get_template( $template_option_name ) {
		$needed_option = $template_option_name . '-tax-' . $this->term->taxonomy;
		if ( isset( $this->options[ $needed_option ] ) && $this->options[ $needed_option ] !== '' ) {
			return $this->options[ $needed_option ];
		}

		return '';
	}
}
