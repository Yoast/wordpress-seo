<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

/**
 * This class provides data for the term metabox by return its values for localization.
 */
class WPSEO_Term_Metabox_Formatter implements WPSEO_Metabox_Formatter_Interface {

	/**
	 * The term the metabox formatter is for.
	 *
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * The term's taxonomy.
	 *
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * Whether we must return social templates values.
	 *
	 * @var bool
	 */
	private $use_social_templates = false;

	/**
	 * Array with the WPSEO_Titles options.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * WPSEO_Taxonomy_Scraper constructor.
	 *
	 * @param stdClass         $taxonomy Taxonomy.
	 * @param WP_Term|stdClass $term     Term.
	 */
	public function __construct( $taxonomy, $term ) {
		$this->taxonomy = $taxonomy;
		$this->term     = $term;

		$this->use_social_templates = $this->use_social_templates();
	}

	/**
	 * Determines whether the social templates should be used.
	 *
	 * @return bool Whether the social templates should be used.
	 */
	public function use_social_templates() {
		return WPSEO_Options::get( 'opengraph', false ) === true;
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = [];

		// Todo: a column needs to be added on the termpages to add a filter for the keyword, so this can be used in the focus keyphrase doubles.
		if ( is_object( $this->term ) && property_exists( $this->term, 'taxonomy' ) ) {
			$values = [
				'search_url'                  => $this->search_url(),
				'post_edit_url'               => $this->edit_url(),
				'base_url'                    => $this->base_url_for_js(),
				'taxonomy'                    => $this->term->taxonomy,
				'keyword_usage'               => $this->get_focus_keyword_usage(),
				'title_template'              => $this->get_title_template(),
				'title_template_no_fallback'  => $this->get_title_template( false ),
				'metadesc_template'           => $this->get_metadesc_template(),
				'first_content_image'         => $this->get_image_url(),
				'semrushIntegrationActive'    => 0,
				'social_title_template'       => $this->get_social_title_template(),
				'social_description_template' => $this->get_social_description_template(),
				'social_image_template'       => $this->get_social_image_template(),
				'wincherIntegrationActive'    => 0,
				'isInsightsEnabled'           => $this->is_insights_enabled(),
			];
		}

		return $values;
	}

	/**
	 * Gets the image URL for the term's social preview.
	 *
	 * @return string|null The image URL for the social preview.
	 */
	protected function get_image_url() {
		return WPSEO_Image_Utils::get_first_content_image_for_term( $this->term->term_id );
	}

	/**
	 * Returns the url to search for keyword for the taxonomy.
	 *
	 * @return string
	 */
	private function search_url() {
		return admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url() {
		global $wp_version;
		$script_filename = version_compare( $wp_version, '4.5', '<' ) ? 'edit-tags' : 'term';
		return admin_url( $script_filename . '.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js() {

		$base_url = home_url( '/', null );
		if ( ! WPSEO_Options::get( 'stripcategorybase', false ) ) {
			$base_url = trailingslashit( $base_url . $this->taxonomy->rewrite['slug'] );
		}

		return $base_url;
	}

	/**
	 * Counting the number of given keyword used for other term than given term_id.
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
	 * @param bool $fallback Whether to return the hardcoded fallback if the template value is empty.
	 *
	 * @return string The title template.
	 */
	private function get_title_template( $fallback = true ) {
		$title = $this->get_template( 'title' );

		if ( $title === '' && $fallback === true ) {
			/* translators: %s expands to the variable used for term title. */
			$archives = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' );
			return $archives . ' %%page%% %%sep%% %%sitename%%';
		}

		return $title;
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string The metadesc template.
	 */
	private function get_metadesc_template() {
		return $this->get_template( 'metadesc' );
	}

	/**
	 * Retrieves the social title template.
	 *
	 * @return string The social title template.
	 */
	private function get_social_title_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'title' );
		}

		return '';
	}

	/**
	 * Retrieves the social description template.
	 *
	 * @return string The social description template.
	 */
	private function get_social_description_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'description' );
		}

		return '';
	}

	/**
	 * Retrieves the social image template.
	 *
	 * @return string The social description template.
	 */
	private function get_social_image_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'image-url' );
		}

		return '';
	}

	/**
	 * Retrieves a template.
	 *
	 * @param string $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private function get_template( $template_option_name ) {
		$needed_option = $template_option_name . '-tax-' . $this->term->taxonomy;
		return WPSEO_Options::get( $needed_option, '' );
	}

	/**
	 * Retrieves a social template.
	 *
	 * @param string $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private function get_social_template( $template_option_name ) {
		/**
		 * Filters the social template value for a given taxonomy.
		 *
		 * @param string $template             The social template value, defaults to empty string.
		 * @param string $template_option_name The subname of the option in which the template you want to get is saved.
		 * @param string $taxonomy             The name of the taxonomy.
		 */
		return \apply_filters( 'wpseo_social_template_taxonomy', '', $template_option_name, $this->term->taxonomy );
	}

	/**
	 * Determines whether the insights feature is enabled for this taxonomy.
	 *
	 * @return bool
	 */
	protected function is_insights_enabled() {
		return WPSEO_Options::get( 'enable_metabox_insights', false );
	}
}
