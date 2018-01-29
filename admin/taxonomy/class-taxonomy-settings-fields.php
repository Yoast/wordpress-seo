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
	 * @var array   Options array for the sitemap_include options, including translated labels
	 */
	private $sitemap_include_options = array();

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
				esc_html__( 'Meta robots index', 'wordpress-seo' ),
				esc_html__( 'This taxonomy follows the indexation rules set under Metas and Titles, you can override it here.', 'wordpress-seo' ),
				'select',
				$this->get_noindex_options()
			),
			'sitemap_include' => $this->get_field_config(
				esc_html__( 'Include in Sitemap?', 'wordpress-seo' ),
				'',
				'select',
				$this->sitemap_include_options
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
		$this->sitemap_include_options = WPSEO_Taxonomy_Meta::$sitemap_include_options;

		/* translators: %s expands to the current taxonomy index value */
		$this->no_index_options['default'] = __( 'Default for this taxonomy type, currently: %s', 'wordpress-seo' );
		$this->no_index_options['index']   = __( 'Index', 'wordpress-seo' );
		$this->no_index_options['noindex'] = __( 'Noindex', 'wordpress-seo' );

		$this->sitemap_include_options['-']      = __( 'Auto detect', 'wordpress-seo' );
		$this->sitemap_include_options['always'] = __( 'Always include', 'wordpress-seo' );
		$this->sitemap_include_options['never']  = __( 'Never include', 'wordpress-seo' );
	}

	/**
	 * Getting the data for the noindex fields
	 *
	 * @return array
	 */
	private function get_noindex_options() {
		$noindex_options['options']            = $this->no_index_options;
		$noindex_options['options']['default'] = sprintf( $noindex_options['options']['default'], $this->get_robot_index() );

		if ( get_option( 'blog_public' ) === 0 ) {
			$noindex_options['description'] = '<br /><span class="error-message">' . esc_html__( 'Warning: even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) . '</span>';
		}

		return $noindex_options;
	}

	/**
	 * Returns the current robot index value for the taxonomy
	 *
	 * @return string
	 */
	private function get_robot_index() {
		$robot_index  = 'index';
		$index_option = 'noindex-tax-' . $this->term->taxonomy;
		if ( isset( $this->options[ $index_option ] ) && $this->options[ $index_option ] === true ) {
			$robot_index = 'noindex';
		}

		return $robot_index;
	}
}
