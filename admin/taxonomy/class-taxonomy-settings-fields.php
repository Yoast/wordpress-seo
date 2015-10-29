<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_General_Tab
 *
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
			'metakey'         => $this->get_field_config(
				__( 'Meta keywords', 'wordpress-seo' ),
				esc_html__( 'Meta keywords used on the archive page for this term.', 'wordpress-seo' ),
				'text',
				'',
				$this->options['usemetakeywords'] !== true
			),
			'canonical'       => $this->get_field_config(
				__( 'Canonical', 'wordpress-seo' ),
				esc_html__( 'The canonical link is shown on the archive page for this term.', 'wordpress-seo' )
			),
			'bctitle'         => $this->get_field_config(
				__( 'Breadcrumbs title', 'wordpress-seo' ),
				/* translators: %s expands to the taxonomy name  */
				sprintf( esc_html__( 'The Breadcrumbs title is used in the breadcrumbs where this %s appears.', 'wordpress-seo' ), $this->term->taxonomy ),
				'text',
				'',
				$this->options['breadcrumbs-enable'] !== true
			),
			'noindex'         => $this->get_field_config(
				/* translators: %s expands to taxonomy name  */
				sprintf( __( 'Noindex this %s', 'wordpress-seo' ), $this->term->taxonomy ),
				/* translators: %s expands to taxonomy name  */
				sprintf( esc_html__( 'This %s follows the indexation rules set under Metas and Titles, you can override it here.', 'wordpress-seo' ), $this->term->taxonomy ),
				'select',
				$this->get_noindex_options()
			),
			'sitemap_include' => $this->get_field_config(
				/* translators: %1$s expands to the taxonomy name  */
				sprintf( __( 'Include %1$s in sitemap?', 'wordpress-seo' ), $this->term->taxonomy ),
				'',
				'select',
				$this->sitemap_include_options
			),
		);

		return $this->filter_hidden_fields( $fields );
	}

	/**
	 * Translate options text strings for use in the select fields
	 *
	 * @internal IMPORTANT: if you want to add a new string (option) somewhere, make sure you add
	 * that array key to the main options definition array in the class WPSEO_Taxonomy_Meta() as well!!!!
	 */
	private function translate_meta_options() {
		$this->no_index_options        = WPSEO_Taxonomy_Meta::$no_index_options;
		$this->sitemap_include_options = WPSEO_Taxonomy_Meta::$sitemap_include_options;

		/* translators: %s$s expands to the taxonomy name and %2$s to the current index value */
		$this->no_index_options['default'] = __( 'Use %1$s default (Currently: %2$s)', 'wordpress-seo' );
		$this->no_index_options['index']   = __( 'Always index', 'wordpress-seo' );
		$this->no_index_options['noindex'] = __( 'Always noindex', 'wordpress-seo' );

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
		$noindex_options['options']['default'] = sprintf( $noindex_options['options']['default'], $this->term->taxonomy, $this->get_robot_index() );

		if ( get_option( 'blog_public' ) === '0' ) {
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
