<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox
 */
class WPSEO_Taxonomy_Settings_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * @var array   Options array for the no-index options, including translated labels
	 */
	private $no_index_options = array();

	/**
	 * @param stdClass $term The currenct taxonomy.
	 */
	public function __construct( $term ) {
		parent::__construct( $term );
		$this->translate_meta_options();
	}

	/**
	 * Returns array with the fields for the general tab
	 *
	 * @return array
	 */
	public function get() {
		$fields = array(
			'noindex'         => $this->get_field_config(
				esc_html( sprintf( __( 'Allow search engines to show this %s in search results?', 'wordpress-seo' ), $this->get_taxonomy_label() ) ),
				'',
				'select',
				$this->get_noindex_options()
			),
			'bctitle'         => $this->get_field_config(
				__( 'Breadcrumbs Title', 'wordpress-seo' ),
				esc_html__( 'The Breadcrumbs Title is used in the breadcrumbs where this taxonomy appears.', 'wordpress-seo' ),
				'text',
				'',
				$this->options['breadcrumbs-enable'] !== true
			),
			'canonical'       => $this->get_field_config(
				__( 'Canonical URL', 'wordpress-seo' ),
				esc_html__( 'The canonical link is shown on the archive page for this term.', 'wordpress-seo' )
			),
		);

		return $this->filter_hidden_fields( $fields );
	}

	/**
	 * Translate options text strings for use in the select fields
	 *
	 * {@internal IMPORTANT: if you want to add a new string (option) somewhere, make sure you add
	 * that array key to the main options definition array in the class WPSEO_Taxonomy_Meta() as well!!!!}}
	 */
	private function translate_meta_options() {
		$this->no_index_options        = WPSEO_Taxonomy_Meta::$no_index_options;

		/* translators: %1$s expands to the taxonomy name %2$s expands to the current taxonomy index value */
		$this->no_index_options['default'] = __( 'Default for %1$s, currently: %2$s', 'wordpress-seo' );
		$this->no_index_options['index']   = __( 'Yes', 'wordpress-seo' );
		$this->no_index_options['noindex'] = __( 'No', 'wordpress-seo' );
	}

	/**
	 * Getting the data for the noindex fields
	 *
	 * @return array
	 */
	private function get_noindex_options() {
		$noindex_options['options']            = $this->no_index_options;
		$noindex_options['options']['default'] = sprintf( $noindex_options['options']['default'], $this->get_taxonomy_label(), $this->get_robot_index() );

		return $noindex_options;
	}

	/**
	 * Retrieve the taxonomies plural for use in sentences.
	 *
	 * @return string
	 */
	private function get_taxonomy_label() {
		$taxonomy = get_taxonomy( $this->term->taxonomy );
		return $taxonomy->labels->name;
	}

	/**
	 * Returns the current robot index value for the taxonomy
	 *
	 * @return string
	 */
	private function get_robot_index() {
		$robot_index  = __( 'yes', 'wordpress-seo' );
		$index_option = 'noindex-tax-' . $this->term->taxonomy;
		if ( isset( $this->options[ $index_option ] ) && $this->options[ $index_option ] === true ) {
			$robot_index = __( 'no', 'wordpress-seo' );
		}

		return $robot_index;
	}
}
