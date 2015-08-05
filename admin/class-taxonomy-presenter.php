<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_Presenter
 */
class WPSEO_Taxonomy_Presenter {

	/**
	 * @var array
	 */
	private $options = array();

	/**
	 * @var bool|mixed
	 */
	private $tax_meta;

	/**
	 * @var stdClass
	 */
	private $term;

	/**
	 * @var array   Options array for the no-index options, including translated labels
	 */
	private $no_index_options = array();

	/**
	 * @var array   Options array for the sitemap_include options, including translated labels
	 */
	private $sitemap_include_options = array();

	/**
	 * @param stdClass $term
	 */
	public function __construct( $term ) {
		$this->term     = $term;
		$this->tax_meta = WPSEO_Taxonomy_Meta::get_term_meta( (int) $term->term_id, $term->taxonomy );
		$this->options  = WPSEO_Options::get_all();

		$this->translate_meta_options();
	}

	/**
	 * Displaying the form fields
	 *
	 * @param array $fields
	 */
	public function display_fields( array $fields ) {
		foreach ( $fields as $field_name => $field_options ) {
			if ( empty( $field_options['hide'] ) ) {
				$this->form_row( 'wpseo_' . $field_name, $field_options['label'], $field_options['description'], $field_options['type'], $field_options['options'] );
			}
		}
	}

	/**
	 * Getting the fields for the general tab
	 *
	 * @return array
	 */
	public function general_fields() {

		$current = 'index';
		if ( isset( $options[ 'noindex-tax-' . $this->term->taxonomy ] ) && $this->options[ 'noindex-tax-' . $this->term->taxonomy ] === true ) {
			$current = 'noindex';
		}

		$noindex_options['options']            = $this->no_index_options;
		$noindex_options['options']['default'] = sprintf( $noindex_options['options']['default'], $this->term->taxonomy, $current );

		if ( '0' === get_option( 'blog_public' ) ) {
			$noindex_options['description'] = '<br /><span class="error-message">' . esc_html__( 'Warning: even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) . '</span>';
		}

		$fields = array(
			'title' => array(
				'label'       => __( 'SEO Title', 'wordpress-seo' ),
				'description' => esc_html__( 'The SEO title is used on the archive page for this term.', 'wordpress-seo' ),
				'type'        => 'text',
				'options'     => '',
			),
			'desc' => array(
				'label'       => __( 'SEO Description', 'wordpress-seo' ),
				'description' => esc_html__( 'The SEO description is used for the meta description on the archive page for this term.', 'wordpress-seo' ),
				'type'        => 'text',
				'options'     => '',
			),
			'metakey'  => array(
				'label'       => __( 'Meta keywords', 'wordpress-seo' ),
				'description' => esc_html__( 'Meta keywords used on the archive page for this term.', 'wordpress-seo' ),
				'type'        => 'text',
				'options'     => '',
				'hide'        => $this->options['usemetakeywords'] !== true,
			),
			'canonical'  => array(
				'label'       => __( 'Canonical', 'wordpress-seo' ),
				'description' => esc_html__( 'The canonical link is shown on the archive page for this term.', 'wordpress-seo' ),
				'type'        => 'text',
				'options'     => '',
			),
			'bctitle'  => array(
				'label'       => __( 'Breadcrumbs title', 'wordpress-seo' ),
				'description' => sprintf( esc_html__( 'The Breadcrumbs title is used in the breadcrumbs where this %s appears.', 'wordpress-seo' ), $this->term->taxonomy ),
				'type'        => 'text',
				'options'     => '',
				'hide'        => $this->options['breadcrumbs-enable'] !== true,
			),
			'noindex'  => array(
				'label'       => sprintf( __( 'Noindex this %s', 'wordpress-seo' ), $this->term->taxonomy ),
				'description' => sprintf( esc_html__( 'This %s follows the indexation rules set under Metas and Titles, you can override it here.', 'wordpress-seo' ), $this->term->taxonomy ),
				'type'        => 'select',
				'options'     => $noindex_options,
			),
			'sitemap_include'  => array(
				'label'       => sprintf( __( 'Include in sitemap?', 'wordpress-seo' ), $this->term->taxonomy ),
				'description' => '',
				'type'        => 'select',
				'options'     => $this->sitemap_include_options,
			),
		);

		unset( $current, $no_index_options );

		return $fields;
	}

	/**
	 * Returning the fields for the social media tab
	 *
	 * @return array
	 */
	public function social_fields() {
		$social_networks = array(
			'opengraph'  => array(
				'network' => 'opengraph',
				'label'   => __( 'Facebook', 'wordpress-seo' ),
				'size'    => '1200 x 628',
			),
			'twitter'    => array(
				'network' => 'twitter',
				'label'   => __( 'Twitter', 'wordpress-seo' ),
				'size'    => '1024 x 512',
			),
			'googleplus' => array(
				'network' => 'google-plus',
				'label'   => __( 'Google+', 'wordpress-seo' ),
				'size'    => '800 x 1200',
			),
		);

		$fields = array();
		foreach ( $social_networks as $option => $settings ) {
			if ( true === $this->options[ $option ] ) {
				$fields_to_push = array(
					$settings['network'] . '-title' => array(
						'label' 	  => sprintf( __( '%s Title', 'wordpress-seo' ), $settings['label'] ),
						'description' => sprintf( esc_html__( 'If you don\'t want to use the title for sharing on %1$s  but instead want another title there, write it here.', 'wordpress-seo' ), $settings['label'] ),
						'type'        => 'text',
						'options'     => array( 'class' => 'large-text' ),
					),
					$settings['network'] . '-description' => array(
						'label'       => sprintf( __( '%s Description', 'wordpress-seo' ), $settings['label'] ),
						'description' => sprintf( esc_html__( 'If you don\'t want to use the meta description for sharing on %1$s but want another description there, write it here.', 'wordpress-seo' ), $settings['label'] ),
						'type'        => 'textarea',
						'options'     => '',

					),
					$settings['network'] . '-image' => array(
						'label'       => sprintf( __( '%s Image', 'wordpress-seo' ), $settings['label'] ),
						'description' => sprintf( esc_html__( 'If you want to use an image for sharing on %1$s, you can upload / choose an image or add the image URL here.', 'wordpress-seo' ), $settings['label'] ) . '<br />' .
							sprintf( __( 'The recommended image size for %1$s is %2$spx.', 'wordpress-seo' ), $settings['label'], $settings['size'] ),
						'type'        => 'upload',
						'options'     => '',

					),
				);

				$fields = array_merge( $fields, $fields_to_push );

			}
		}

		return $fields;
	}

	/**
	 * Returns a bool to determine if the social tab has to be visible
	 *
	 * @return bool
	 */
	public function show_social() {
		return ( $this->options['opengraph'] === true || $this->options['twitter'] === true || $this->options['googleplus'] === true );
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

		$this->no_index_options['default'] = __( 'Use %s default (Currently: %s)', 'wordpress-seo' );
		$this->no_index_options['index']   = __( 'Always index', 'wordpress-seo' );
		$this->no_index_options['noindex'] = __( 'Always noindex', 'wordpress-seo' );

		$this->sitemap_include_options['-']      = __( 'Auto detect', 'wordpress-seo' );
		$this->sitemap_include_options['always'] = __( 'Always include', 'wordpress-seo' );
		$this->sitemap_include_options['never']  = __( 'Never include', 'wordpress-seo' );
	}

	/**
	 * Create a row in the form table.
	 *
	 * @param string $field_name      Variable the row controls.
	 * @param string $label    Label for the variable.
	 * @param string $description     Description of the use of the variable.
	 * @param string $type     Type of form row to create.
	 * @param array  $options  Options to use when form row is a select box.
	 */
	private function form_row( $field_name, $label, $description, $type = 'text', $options = array() ) {
		$value = '';
		if ( isset( $this->tax_meta[ $field_name ] ) && $this->tax_meta[ $field_name ] !== '' ) {
			$value = $this->tax_meta[ $field_name ];
		}

		$esc_var = esc_attr( $field_name );
		$field   = '';

		$class = '';
		if ( ! empty( $options['class'] ) ) {
			$class = ' class="' . esc_attr( $options['class'] ) . '"';
		}

		switch ( $type ) {
			case 'text' :
				$field .= '<input name="' . $esc_var . '" id="' . $esc_var . '" ' . $class . ' type="text" value="' . esc_attr( $value ) . '" size="40"/>';
				break;
			case 'checkbox' :
				$field .= '<input name="' . $esc_var . '" id="' . $esc_var . '" type="checkbox" ' . checked( $value ) . '/>';
				break;
			case 'textarea' :
				$rows = 3;
				if ( ! empty( $options['rows'] ) ) {
					$rows = $options['rows'];
				}
				$field .= '<textarea class="large-text" rows="' . esc_attr( $rows ) . '" id="' . $esc_var . '" name="' . $esc_var . '">' . esc_textarea( $value ) . '</textarea>';
				break;
			case 'upload' :
				$field .= '<input id="' . $esc_var . '" type="text" size="36" name="' . $esc_var . '" value="' . esc_attr( $value ) . '" />';
				$field .= '<input id="' . $esc_var . '_button" class="wpseo_image_upload_button button" type="button" value="Upload Image" />';
				break;
			case 'select' :
				if ( is_array( $options ) && $options !== array() ) {
					$field .= '<select name="' . $esc_var . '" id="' . $esc_var . '">';

					$select_options = ( array_key_exists( 'options', $options ) ) ? $options['options'] : $options;

					foreach ( $select_options as $option => $option_label ) {
						$selected = selected( $option, $value, false );
						$field .= '<option ' . $selected . ' value="' . esc_attr( $option ) . '">' . esc_html( $option_label ) . '</option>';
					}
					unset( $option, $option_label, $selected );

					$field .= '</select>';
				}
				break;
			case 'hidden' :
				$field .= '<input name="' . $esc_var . '" id="hidden_' . $esc_var . '" type="hidden" value="' . esc_attr( $value ) . '" />';
				break;
		}

		$help = '';
		if ( $field !== '' && ( is_string( $description ) && $description !== '' ) ) {
			$help = $this->parse_help( $esc_var, $description );
		}

		if ( $field !== '' && ( ! empty( $options['description'] ) && is_string( $options['description'] ) ) ) {
			$field .= '<p class="description">' . $options['description'] . '</p>';
		}

		echo '<tr>
			<th scope="row">' . ( ( '' !== $label ) ? '<label for="' . $esc_var . '">' . esc_html( $label ) . '</label>' : '' ) . '' . $help . '</th>
			<td>' . $field . '</td>
		</tr>';
	}

	/**
	 * Parsing question mark with the help-text
	 *
	 * @param string $esc_var
	 * @param string $desc
	 *
	 * @return string
	 */
	private function parse_help( $esc_var, $desc ) {
		static $image_src;

		if ( $image_src === null ) {
			$image_src = plugins_url( 'images/question-mark.png', WPSEO_FILE );
		}

		return  sprintf(
			'<img src="%1$s" class="alignright yoast_help" id="%2$s" alt="%3$s" />',
			$image_src,
			esc_attr( $esc_var . 'help' ),
			esc_attr( $desc )
		);
	}

}
