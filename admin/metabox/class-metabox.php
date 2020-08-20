<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * This class generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */
class WPSEO_Metabox extends WPSEO_Meta {

	/**
	 * Whether or not the social tab is enabled for this metabox.
	 *
	 * @var bool
	 */
	private $social_is_enabled;

	/**
	 * An instance of the Metabox Analysis SEO class.
	 *
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	protected $analysis_seo;

	/**
	 * An instance of the Metabox Analysis Readability class.
	 *
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	protected $analysis_readability;

	/**
	 * The metabox editor object.
	 *
	 * @var WPSEO_Metabox_Editor
	 */
	protected $editor;

	/**
	 * Whether or not the advanced metadata is enabled.
	 *
	 * @var bool
	 */
	protected $is_advanced_metadata_enabled;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		if ( $this->is_internet_explorer() ) {
			add_action( 'add_meta_boxes', [ $this, 'internet_explorer_metabox' ] );
			return;
		}

		add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
		add_action( 'wp_insert_post', [ $this, 'save_postdata' ] );
		add_action( 'edit_attachment', [ $this, 'save_postdata' ] );
		add_action( 'add_attachment', [ $this, 'save_postdata' ] );
		add_action( 'admin_init', [ $this, 'translate_meta_boxes' ] );

		$this->editor = new WPSEO_Metabox_Editor();
		$this->editor->register_hooks();

		$this->social_is_enabled            = WPSEO_Options::get( 'opengraph', false ) || WPSEO_Options::get( 'twitter', false );
		$this->is_advanced_metadata_enabled = WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) || WPSEO_Options::get( 'disableadvanced_meta' ) === false;

		$this->analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$this->analysis_readability = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Checks whether the request comes from an IE 11 browser.
	 *
	 * @return bool Whether the request comes from an IE 11 browser.
	 */
	public static function is_internet_explorer() {
		if ( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
			return false;
		}

		$user_agent = sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) );

		if ( stripos( $user_agent, 'Trident/7.0' ) === false ) {
			return false;
		}

		return true;
	}

	/**
	 * Adds an alternative metabox for internet explorer users.
	 */
	public function internet_explorer_metabox() {
		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		$post_types = array_filter( $post_types, [ $this, 'display_metabox' ] );

		if ( ! is_array( $post_types ) || $post_types === [] ) {
			return;
		}

		$product_title = $this->get_product_title();

		foreach ( $post_types as $post_type ) {
			add_filter( "postbox_classes_{$post_type}_wpseo_meta", [ $this, 'wpseo_metabox_class' ] );

			add_meta_box(
				'wpseo_meta',
				$product_title,
				[ $this, 'render_internet_explorer_notice' ],
				$post_type,
				'normal',
				apply_filters( 'wpseo_metabox_prio', 'high' ),
				[ '__block_editor_compatible_meta_box' => true ]
			);
		}
	}

	/**
	 * Renders the content for the internet explorer metabox.
	 *
	 * @return void
	 */
	public function render_internet_explorer_notice() {
		$content = sprintf(
			/* translators: 1: Link start tag to the Firefox website, 2: Link start tag to the Chrome website, 3: Link start tag to the Edge website, 4: Link closing tag. */
			esc_html__( 'The browser you are currently using is unfortunately rather dated. Since we strive to give you the best experience possible, we no longer support this browser. Instead, please use %1$sFirefox%4$s, %2$sChrome%4$s or %3$sMicrosoft Edge%4$s.', 'wordpress-seo' ),
			'<a href="https://www.mozilla.org/firefox/new/">',
			'<a href="https://www.google.com/chrome/">',
			'<a href="https://www.microsoft.com/windows/microsoft-edge">',
			'</a>'
		);

		echo new Alert_Presenter( $content );
	}

	/**
	 * Translates text strings for use in the meta box.
	 *
	 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
	 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
	 */
	public static function translate_meta_boxes() {
		WPSEO_Meta::$meta_fields['general']['title']['title']    = __( 'SEO title', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['general']['metadesc']['title'] = __( 'Meta description', 'wordpress-seo' );

		/* translators: %s expands to the post type name. */
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-noindex']['title'] = __( 'Allow search engines to show this %s in search results?', 'wordpress-seo' );
		if ( (string) get_option( 'blog_public' ) === '0' ) {
			WPSEO_Meta::$meta_fields['advanced']['meta-robots-noindex']['description'] = '<span class="error-message">' . __( 'Warning: even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) . '</span>';
		}
		/* translators: %1$s expands to Yes or No,  %2$s expands to the post type name.*/
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-noindex']['options']['0'] = __( 'Default for %2$s, currently: %1$s', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-noindex']['options']['2'] = __( 'Yes', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-noindex']['options']['1'] = __( 'No', 'wordpress-seo' );

		/* translators: %1$s expands to the post type name.*/
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-nofollow']['title']        = __( 'Should search engines follow links on this %1$s?', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-nofollow']['options']['0'] = __( 'Yes', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-nofollow']['options']['1'] = __( 'No', 'wordpress-seo' );

		WPSEO_Meta::$meta_fields['advanced']['meta-robots-adv']['title']                   = __( 'Meta robots advanced', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-adv']['description']             = __( 'If you want to apply advanced <code>meta</code> robots settings for this page, please define them in the following field.', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-adv']['options']['noimageindex'] = __( 'No Image Index', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-adv']['options']['noarchive']    = __( 'No Archive', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['meta-robots-adv']['options']['nosnippet']    = __( 'No Snippet', 'wordpress-seo' );

		WPSEO_Meta::$meta_fields['advanced']['bctitle']['title']       = __( 'Breadcrumbs Title', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['bctitle']['description'] = __( 'Title to use for this page in breadcrumb paths', 'wordpress-seo' );

		WPSEO_Meta::$meta_fields['advanced']['canonical']['title'] = __( 'Canonical URL', 'wordpress-seo' );

		WPSEO_Meta::$meta_fields['advanced']['canonical']['description'] = sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			__( 'The canonical URL that this page should point to. Leave empty to default to permalink. %1$sCross domain canonical%2$s supported too.', 'wordpress-seo' ),
			'<a href="https://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html" target="_blank" rel="noopener">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);

		WPSEO_Meta::$meta_fields['advanced']['redirect']['title']       = __( '301 Redirect', 'wordpress-seo' );
		WPSEO_Meta::$meta_fields['advanced']['redirect']['description'] = __( 'The URL that this page should redirect to.', 'wordpress-seo' );

		do_action( 'wpseo_tab_translate' );
	}

	/**
	 * Determines whether the metabox should be shown for the passed identifier.
	 *
	 * By default the check is done for post types, but can also be used for taxonomies.
	 *
	 * @param string|null $identifier The identifier to check.
	 * @param string      $type       The type of object to check. Defaults to post_type.
	 *
	 * @return bool Whether or not the metabox should be displayed.
	 */
	public function display_metabox( $identifier = null, $type = 'post_type' ) {
		return WPSEO_Utils::is_metabox_active( $identifier, $type );
	}

	/**
	 * Adds the Yoast SEO meta box to the edit boxes in the edit post, page,
	 * attachment, and custom post types pages.
	 *
	 * @return void
	 */
	public function add_meta_box() {
		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		$post_types = array_filter( $post_types, [ $this, 'display_metabox' ] );

		if ( ! is_array( $post_types ) || $post_types === [] ) {
			return;
		}

		$product_title = $this->get_product_title();

		foreach ( $post_types as $post_type ) {
			add_filter( "postbox_classes_{$post_type}_wpseo_meta", [ $this, 'wpseo_metabox_class' ] );

			add_meta_box(
				'wpseo_meta',
				$product_title,
				[ $this, 'meta_box' ],
				$post_type,
				'normal',
				apply_filters( 'wpseo_metabox_prio', 'high' ),
				[ '__block_editor_compatible_meta_box' => true ]
			);
		}
	}

	/**
	 * Adds CSS classes to the meta box.
	 *
	 * @param array $classes An array of postbox CSS classes.
	 *
	 * @return array List of classes that will be applied to the editbox container.
	 */
	public function wpseo_metabox_class( $classes ) {
		$classes[] = 'yoast wpseo-metabox';

		return $classes;
	}

	/**
	 * Passes variables to js for use with the post-scraper.
	 *
	 * @return array
	 */
	public function get_metabox_script_data() {
		$post      = $this->get_metabox_post();
		$permalink = '';

		if ( is_object( $post ) ) {
			$permalink = get_sample_permalink( $post->ID );
			$permalink = $permalink[0];
		}

		$post_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter( $post, [], $permalink )
		);

		$values = $post_formatter->get_values();

		/** This filter is documented in admin/filters/class-cornerstone-filter.php. */
		$post_types = apply_filters( 'wpseo_cornerstone_post_types', WPSEO_Post_Type::get_accessible_post_types() );
		if ( $values['cornerstoneActive'] && ! in_array( $post->post_type, $post_types, true ) ) {
			$values['cornerstoneActive'] = false;
		}

		return $values;
	}

	/**
	 * Determines whether or not the current post type has registered taxonomies.
	 *
	 * @return bool Whether the current post type has taxonomies.
	 */
	private function current_post_type_has_taxonomies() {
		$post_taxonomies = get_object_taxonomies( get_post_type() );

		return ! empty( $post_taxonomies );
	}

	/**
	 * Determines the scope based on the post type.
	 * This can be used by the replacevar plugin to determine if a replacement needs to be executed.
	 *
	 * @return string String describing the current scope.
	 */
	private function determine_scope() {
		$post_type = get_post_type( $this->get_metabox_post() );

		if ( $post_type === 'page' ) {
			return 'page';
		}

		return 'post';
	}

	/**
	 * Outputs the meta box.
	 *
	 * @param WP_Post $post The post.
	 */
	public function meta_box( $post ) {

		$content_sections = $this->get_content_sections( $post->post_type );

		echo '<div class="wpseo-metabox-content">';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $this->get_product_title is considered safe.
		printf( '<div class="wpseo-metabox-menu"><ul role="tablist" class="yoast-aria-tabs" aria-label="%s">', $this->get_product_title() );

		foreach ( $content_sections as $content_section ) {
			if ( $content_section->name === 'premium' ) {
				continue;
			}

			$content_section->display_link();
		}

		echo '</ul></div>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_content();
		}

		echo '</div>';
	}

	/**
	 * Returns the relevant metabox sections for the current view.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_content_sections( $post_type ) {
		$content_sections = [];

		$content_sections[] = $this->get_seo_meta_section();

		if ( $this->analysis_readability->is_enabled() ) {
			$content_sections[] = $this->get_readability_meta_section();
		}

		if ( $this->is_advanced_metadata_enabled ) {
			$content_sections[] = $this->get_schema_meta_section( $post_type );
		}

		// Whether social is enabled.
		if ( $this->social_is_enabled ) {
			$content_sections[] = $this->get_social_meta_section();
		}

		$content_sections = array_merge( $content_sections, $this->get_additional_meta_sections() );

		return $content_sections;
	}

	/**
	 * Returns the social section for the social previews.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_social_meta_section() {
		$content = '';

		$content .= $this->get_tab_content( 'social' );

		// Add react target.
		$content .= '<div id="wpseo-section-social"></div>';

		$link_content = '<span class="dashicons dashicons-share"></span>' . __( 'Social', 'wordpress-seo' );

		return new WPSEO_Metabox_Section_React(
			'social',
			$link_content,
			$content
		);
	}

	/**
	 * Returns the metabox section for the seo analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_seo_meta_section() {
		wp_nonce_field( 'yoast_free_metabox', 'yoast_free_metabox_nonce' );

		$content = $this->get_tab_content( 'general' );

		$label = __( 'SEO', 'wordpress-seo' );
		if ( $this->analysis_seo->is_enabled() ) {
			$label = '<span class="wpseo-score-icon-container" id="wpseo-seo-score-icon"></span>' . $label;
		}

		$html_after = '';

		if ( $this->is_advanced_metadata_enabled ) {
			$html_after = $this->get_tab_content( 'advanced' );
		}

		/**
		 * Filter: 'wpseo_content_meta_section_content' - Allow filtering the metabox content before outputting.
		 *
		 * @api string $post_content The metabox content string.
		 */
		$content = apply_filters( 'wpseo_content_meta_section_content', $content );

		return new WPSEO_Metabox_Section_React(
			'content',
			$label,
			$content,
			[
				'html_after' => $html_after,
			]
		);
	}

	/**
	 * Returns the metabox section for the schema tab.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return WPSEO_Metabox_Section_React
	 */
	private function get_schema_meta_section( $post_type ) {
		$content = $this->get_tab_content( 'schema', $post_type );
		return new WPSEO_Metabox_Section_React(
			'schema',
			'<span class="wpseo-schema-icon"></span>' . __( 'Schema', 'wordpress-seo' ),
			$content
		);
	}

	/**
	 * Returns the metabox section for the readability analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_readability_meta_section() {
		return new WPSEO_Metabox_Section_Readability();
	}

	/**
	 * Returns the metabox sections that have been added by other plugins.
	 *
	 * @return WPSEO_Metabox_Section_Additional[]
	 */
	protected function get_additional_meta_sections() {
		$sections = [];

		/**
		 * Private filter: 'yoast_free_additional_metabox_sections'.
		 *
		 * Meant for internal use only. Allows adding additional tabs to the Yoast SEO metabox.
		 *
		 * @since 11.9
		 *
		 * @param array[] $sections {
		 *     An array of arrays with tab specifications.
		 *
		 *     @type array $section {
		 *          A tab specification.
		 *
		 *          @type string $name         The name of the tab. Used in the HTML IDs, href and aria properties.
		 *          @type string $link_content The content of the tab link.
		 *          @type string $content      The content of the tab.
		 *          @type array $options {
		 *              Optional. Extra options.
		 *
		 *              @type string $link_class      Optional. The class for the tab link.
		 *              @type string $link_aria_label Optional. The aria label of the tab link.
		 *          }
		 *     }
		 * }
		 */
		$requested_sections = apply_filters( 'yoast_free_additional_metabox_sections', [] );

		foreach ( $requested_sections as $section ) {
			if ( is_array( $section ) && array_key_exists( 'name', $section ) && array_key_exists( 'link_content', $section ) && array_key_exists( 'content', $section ) ) {
				$options    = array_key_exists( 'options', $section ) ? $section['options'] : [];
				$sections[] = new WPSEO_Metabox_Section_Additional(
					$section['name'],
					$section['link_content'],
					$section['content'],
					$options
				);
			}
		}

		return $sections;
	}

	/**
	 * Retrieves the contents for the metabox tab.
	 *
	 * @param string $tab_name  Tab for which to retrieve the field definitions.
	 * @param string $post_type The post type. Defaults to post.
	 *
	 * @return string
	 */
	private function get_tab_content( $tab_name, $post_type = 'post' ) {
		$content = '';
		foreach ( WPSEO_Meta::get_meta_field_defs( $tab_name, $post_type ) as $key => $meta_field ) {
			$content .= $this->do_meta_box( $meta_field, $key );
		}

		return $content;
	}

	/**
	 * Adds a line in the meta box.
	 *
	 * @todo [JRF] Check if $class is added appropriately everywhere.
	 *
	 * @param array  $meta_field_def Contains the vars based on which output is generated.
	 * @param string $key            Internal key (without prefix).
	 *
	 * @return string
	 */
	public function do_meta_box( $meta_field_def, $key = '' ) {
		$content      = '';
		$esc_form_key = esc_attr( WPSEO_Meta::$form_prefix . $key );
		$meta_value   = WPSEO_Meta::get_value( $key, $this->get_metabox_post()->ID );

		$class = '';
		if ( isset( $meta_field_def['class'] ) && $meta_field_def['class'] !== '' ) {
			$class = ' ' . $meta_field_def['class'];
		}

		$placeholder = '';
		if ( isset( $meta_field_def['placeholder'] ) && $meta_field_def['placeholder'] !== '' ) {
			$placeholder = $meta_field_def['placeholder'];
		}

		$aria_describedby = '';
		$description      = '';
		if ( isset( $meta_field_def['description'] ) ) {
			$aria_describedby = ' aria-describedby="' . $esc_form_key . '-desc"';
			$description      = '<p id="' . $esc_form_key . '-desc" class="yoast-metabox__description">' . $meta_field_def['description'] . '</p>';
		}

		// Add a hide_on_pages option that returns nothing when the field is rendered on a page.
		if ( isset( $meta_field_def['hide_on_pages'] ) && $meta_field_def['hide_on_pages'] && get_post_type() === 'page' ) {
			return '';
		}

		switch ( $meta_field_def['type'] ) {
			case 'text':
				$ac = '';
				if ( isset( $meta_field_def['autocomplete'] ) && $meta_field_def['autocomplete'] === false ) {
					$ac = 'autocomplete="off" ';
				}
				if ( $placeholder !== '' ) {
					$placeholder = ' placeholder="' . esc_attr( $placeholder ) . '"';
				}
				$content .= '<input type="text"' . $placeholder . ' id="' . $esc_form_key . '" ' . $ac . 'name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '" class="large-text' . $class . '"' . $aria_describedby . '/>';
				break;

			case 'url':
				if ( $placeholder !== '' ) {
					$placeholder = ' placeholder="' . esc_attr( $placeholder ) . '"';
				}
				$content .= '<input type="url"' . $placeholder . ' id="' . $esc_form_key . '" name="' . $esc_form_key . '" value="' . esc_attr( urldecode( $meta_value ) ) . '" class="large-text' . $class . '"' . $aria_describedby . '/>';
				break;

			case 'textarea':
				$rows = 3;
				if ( isset( $meta_field_def['rows'] ) && $meta_field_def['rows'] > 0 ) {
					$rows = $meta_field_def['rows'];
				}
				$content .= '<textarea class="large-text' . $class . '" rows="' . esc_attr( $rows ) . '" id="' . $esc_form_key . '" name="' . $esc_form_key . '"' . $aria_describedby . '>' . esc_textarea( $meta_value ) . '</textarea>';
				break;

			case 'hidden':
				$default = '';
				if ( isset( $meta_field_def['default'] ) ) {
					$default = sprintf( ' data-default="%s"', esc_attr( $meta_field_def['default'] ) );
				}
				$content .= '<input type="hidden" id="' . $esc_form_key . '" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '"' . $default . '/>' . "\n";
				break;
			case 'select':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== [] ) {
					$content .= '<select name="' . $esc_form_key . '" id="' . $esc_form_key . '" class="yoast' . $class . '">';
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$selected = selected( $meta_value, $val, false );
						$content .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
					}
					unset( $val, $option, $selected );
					$content .= '</select>';
				}
				break;

			case 'multiselect':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== [] ) {

					// Set $meta_value as $selected_arr.
					$selected_arr = $meta_value;

					// If the multiselect field is 'meta-robots-adv' we should explode on ,.
					if ( $key === 'meta-robots-adv' ) {
						$selected_arr = explode( ',', $meta_value );
					}

					if ( ! is_array( $selected_arr ) ) {
						$selected_arr = (array) $selected_arr;
					}

					$options_count = count( $meta_field_def['options'] );

					// This select now uses Select2.
					$content .= '<select multiple="multiple" size="' . esc_attr( $options_count ) . '" name="' . $esc_form_key . '[]" id="' . $esc_form_key . '" class="yoast' . $class . '"' . $aria_describedby . '>';
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$selected = '';
						if ( in_array( $val, $selected_arr, true ) ) {
							$selected = ' selected="selected"';
						}
						$content .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
					}
					$content .= '</select>';
					unset( $val, $option, $selected, $selected_arr, $options_count );
				}
				break;

			case 'checkbox':
				$checked  = checked( $meta_value, 'on', false );
				$expl     = ( isset( $meta_field_def['expl'] ) ) ? esc_html( $meta_field_def['expl'] ) : '';
				$content .= '<input type="checkbox" id="' . $esc_form_key . '" name="' . $esc_form_key . '" ' . $checked . ' value="on" class="yoast' . $class . '"' . $aria_describedby . '/> <label for="' . $esc_form_key . '">' . $expl . '</label>';
				unset( $checked, $expl );
				break;

			case 'radio':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== [] ) {
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$checked  = checked( $meta_value, $val, false );
						$content .= '<input type="radio" ' . $checked . ' id="' . $esc_form_key . '_' . esc_attr( $val ) . '" name="' . $esc_form_key . '" value="' . esc_attr( $val ) . '"/> <label for="' . $esc_form_key . '_' . esc_attr( $val ) . '">' . esc_html( $option ) . '</label> ';
					}
					unset( $val, $option, $checked );
				}
				break;

			case 'upload':
				$content .= '<input' .
					' id="' . $esc_form_key . '"' .
					' type="text"' .
					' size="36"' .
					' class="' . $class . '"' .
					' name="' . $esc_form_key . '"' .
					' value="' . esc_attr( $meta_value ) . '"' . $aria_describedby .
					' readonly="readonly"' .
					' /> ';
				$content .= '<input' .
					' id="' . esc_attr( $esc_form_key ) . '_button"' .
					' class="wpseo_image_upload_button button"' .
					' data-target="' . esc_attr( $esc_form_key ) . '"' .
					' data-target-id="' . esc_attr( $esc_form_key ) . '-id"' .
					' type="button"' .
					' value="' . esc_attr__( 'Upload Image', 'wordpress-seo' ) . '"' .
					' /> ';
				$content .= '<input' .
					' class="wpseo_image_remove_button button"' .
					' type="button"' .
					' value="' . esc_attr__( 'Clear Image', 'wordpress-seo' ) . '"' .
					' />';
				break;
		}

		$html = '';
		if ( $content === '' ) {
			$content = apply_filters( 'wpseo_do_meta_box_field_' . $key, $content, $meta_value, $esc_form_key, $meta_field_def, $key );
		}

		if ( $content !== '' ) {

			$title = esc_html( $meta_field_def['title'] );

			// By default, use the field title as a label element.
			$label = '<label for="' . $esc_form_key . '">' . $title . '</label>';

			// Set the inline help and help panel, if any.
			$help_button = '';
			$help_panel  = '';
			if ( isset( $meta_field_def['help'] ) && $meta_field_def['help'] !== '' ) {
				$help        = new WPSEO_Admin_Help_Panel( $key, $meta_field_def['help-button'], $meta_field_def['help'] );
				$help_button = $help->get_button_html();
				$help_panel  = $help->get_panel_html();
			}

			// If it's a set of radio buttons, output proper fieldset and legend.
			if ( $meta_field_def['type'] === 'radio' ) {
				return '<fieldset><legend>' . $title . '</legend>' . $help_button . $help_panel . $content . $description . '</fieldset>';
			}

			// If it's a single checkbox, ignore the title.
			if ( $meta_field_def['type'] === 'checkbox' ) {
				$label = '';
			}

			// Other meta box content or form fields.
			if ( $meta_field_def['type'] === 'hidden' ) {
				$html = $content;
			}
			else {
				$html = $label . $description . $help_button . $help_panel . $content;
			}
		}

		return $html;
	}

	/**
	 * Saves the WP SEO metadata for posts.
	 *
	 * {@internal $_POST parameters are validated via sanitize_post_meta().}}
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return bool|void Boolean false if invalid save post request.
	 */
	public function save_postdata( $post_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return false;
		}

		if ( $post_id === null ) {
			return false;
		}

		if ( ! isset( $_POST['yoast_free_metabox_nonce'] ) || ! wp_verify_nonce( $_POST['yoast_free_metabox_nonce'], 'yoast_free_metabox' ) ) {
			return false;
		}

		if ( wp_is_post_revision( $post_id ) ) {
			$post_id = wp_is_post_revision( $post_id );
		}

		/**
		 * Determine we're not accidentally updating a different post.
		 * We can't use filter_input here as the ID isn't available at this point, other than in the $_POST data.
		 */
		if ( ! isset( $_POST['ID'] ) || $post_id !== (int) $_POST['ID'] ) {
			return false;
		}

		clean_post_cache( $post_id );
		$post = get_post( $post_id );

		if ( ! is_object( $post ) ) {
			// Non-existent post.
			return false;
		}

		do_action( 'wpseo_save_compare_data', $post );

		$social_fields = [];
		if ( $this->social_is_enabled ) {
			$social_fields = WPSEO_Meta::get_meta_field_defs( 'social' );
		}

		$meta_boxes = apply_filters( 'wpseo_save_metaboxes', [] );
		$meta_boxes = array_merge(
			$meta_boxes,
			WPSEO_Meta::get_meta_field_defs( 'general', $post->post_type ),
			WPSEO_Meta::get_meta_field_defs( 'advanced' ),
			$social_fields,
			WPSEO_Meta::get_meta_field_defs( 'schema', $post->post_type )
		);

		foreach ( $meta_boxes as $key => $meta_box ) {

			// If analysis is disabled remove that analysis score value from the DB.
			if ( $this->is_meta_value_disabled( $key ) ) {
				WPSEO_Meta::delete( $key, $post_id );
				continue;
			}

			$data       = null;
			$field_name = WPSEO_Meta::$form_prefix . $key;

			if ( $meta_box['type'] === 'checkbox' ) {
				$data = isset( $_POST[ $field_name ] ) ? 'on' : 'off';
			}
			else {
				if ( isset( $_POST[ $field_name ] ) ) {
					$data = wp_unslash( $_POST[ $field_name ] );

					// For multi-select.
					if ( is_array( $data ) ) {
						$data = array_map( [ 'WPSEO_Utils', 'sanitize_text_field' ], $data );
					}

					if ( is_string( $data ) ) {
						$data = ( $key !== 'canonical' ) ? WPSEO_Utils::sanitize_text_field( $data ) : WPSEO_Utils::sanitize_url( $data );
					}
				}

				// Reset options when no entry is present with multiselect - only applies to `meta-robots-adv` currently.
				if ( ! isset( $_POST[ $field_name ] ) && ( $meta_box['type'] === 'multiselect' ) ) {
					$data = [];
				}
			}

			if ( $data !== null ) {
				WPSEO_Meta::set_value( $key, $data, $post_id );
			}
		}

		do_action( 'wpseo_saved_postdata' );
	}

	/**
	 * Determines if the given meta value key is disabled.
	 *
	 * @param string $key The key of the meta value.
	 *
	 * @return bool Whether the given meta value key is disabled.
	 */
	public function is_meta_value_disabled( $key ) {
		if ( $key === 'linkdex' && ! $this->analysis_seo->is_enabled() ) {
			return true;
		}

		if ( $key === 'content_score' && ! $this->analysis_readability->is_enabled() ) {
			return true;
		}

		return false;
	}

	/**
	 * Enqueues all the needed JS and CSS.
	 *
	 * @todo [JRF => whomever] Create css/metabox-mp6.css file and add it to the below allowed colors array when done.
	 */
	public function enqueue() {
		global $pagenow;

		$asset_manager = new WPSEO_Admin_Asset_Manager();

		$is_editor = self::is_post_overview( $pagenow ) || self::is_post_edit( $pagenow );

		if ( self::is_post_overview( $pagenow ) ) {
			$asset_manager->enqueue_style( 'edit-page' );
			$asset_manager->enqueue_script( 'edit-page-script' );

			return;
		}

		/* Filter 'wpseo_always_register_metaboxes_on_admin' documented in wpseo-main.php */
		if ( ( $is_editor === false && apply_filters( 'wpseo_always_register_metaboxes_on_admin', false ) === false ) || $this->display_metabox() === false ) {
			return;
		}

		$post_id = get_queried_object_id();
		if ( empty( $post_id ) && isset( $_GET['post'] ) ) {
			$post_id = sanitize_text_field( $_GET['post'] );
		}

		if ( $post_id !== 0 ) {
			// Enqueue files needed for upload functionality.
			wp_enqueue_media( [ 'post' => $post_id ] );
		}

		$asset_manager->enqueue_style( 'metabox-css' );
		$asset_manager->enqueue_style( 'scoring' );
		$asset_manager->enqueue_style( 'select2' );
		$asset_manager->enqueue_style( 'monorepo' );

		$is_block_editor = WP_Screen::get()->is_block_editor();
		$post_edit_handle = 'post-edit';
		if ( ! $is_block_editor ) {
			$post_edit_handle = 'post-edit-classic';
		}
		$asset_manager->enqueue_script( $post_edit_handle );
		$asset_manager->enqueue_style( 'admin-css' );

		$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
		$yoast_components_l10n->localize_script( WPSEO_Admin_Asset_Manager::PREFIX . $post_edit_handle );

		/**
		 * Removes the emoji script as it is incompatible with both React and any
		 * contenteditable fields.
		 */
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . $post_edit_handle, 'wpseoAdminL10n', WPSEO_Utils::get_admin_l10n() );
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . $post_edit_handle, 'wpseoFeaturesL10n', WPSEO_Utils::retrieve_enabled_features() );

		$analysis_worker_location          = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ) );
		$used_keywords_assessment_location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ), 'used-keywords-assessment' );

		$script_data = [
			'analysis'         => [
				'plugins' => [
					'replaceVars' => [
						'no_parent_text'           => __( '(no parent)', 'wordpress-seo' ),
						'replace_vars'             => $this->get_replace_vars(),
						'recommended_replace_vars' => $this->get_recommended_replace_vars(),
						'scope'                    => $this->determine_scope(),
						'has_taxonomies'           => $this->current_post_type_has_taxonomies(),
					],
					'shortcodes' => [
						'wpseo_filter_shortcodes_nonce' => wp_create_nonce( 'wpseo-filter-shortcodes' ),
						'wpseo_shortcode_tags'          => $this->get_valid_shortcode_tags(),
					],
				],
				'worker'  => [
					'url'                     => $analysis_worker_location->get_url( $analysis_worker_location->get_asset(), WPSEO_Admin_Asset::TYPE_JS ),
					'keywords_assessment_url' => $used_keywords_assessment_location->get_url( $used_keywords_assessment_location->get_asset(), WPSEO_Admin_Asset::TYPE_JS ),
					'log_level'               => WPSEO_Utils::get_analysis_worker_log_level(),
					// We need to make the feature flags separately available inside of the analysis web worker.
					'enabled_features'        => WPSEO_Utils::retrieve_enabled_features(),
				],
			],
			'media'            => [
				// @todo replace this translation with JavaScript translations.
				'choose_image' => __( 'Use Image', 'wordpress-seo' ),
			],
			'metabox'          => $this->get_metabox_script_data(),
			'userLanguageCode' => WPSEO_Language_Utils::get_language( WPSEO_Language_Utils::get_user_locale() ),
			'isPost'           => true,
			'isBlockEditor'    => $is_block_editor,
		];

		if ( post_type_supports( get_post_type(), 'thumbnail' ) ) {
			$asset_manager->enqueue_style( 'featured-image' );

			// @todo replace this translation with JavaScript translations.
			$script_data['featuredImage'] = [
				'featured_image_notice' => __( 'SEO issue: The featured image should be at least 200 by 200 pixels to be picked up by Facebook and other social media sites.', 'wordpress-seo' ),
			];
		}

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . $post_edit_handle, 'wpseoScriptData', $script_data );
	}

	/**
	 * Returns post in metabox context.
	 *
	 * @returns WP_Post|array
	 */
	protected function get_metabox_post() {
		$post = filter_input( INPUT_GET, 'post' );
		if ( ! empty( $post ) ) {
			$post_id = (int) WPSEO_Utils::validate_int( $post );

			return get_post( $post_id );
		}


		if ( isset( $GLOBALS['post'] ) ) {
			return $GLOBALS['post'];
		}

		return [];
	}

	/**
	 * Returns an array with shortcode tags for all registered shortcodes.
	 *
	 * @return array
	 */
	private function get_valid_shortcode_tags() {
		$shortcode_tags = [];

		foreach ( $GLOBALS['shortcode_tags'] as $tag => $description ) {
			$shortcode_tags[] = $tag;
		}

		return $shortcode_tags;
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @return array Replace vars.
	 */
	private function get_replace_vars() {
		$post = $this->get_metabox_post();

		$cached_replacement_vars = [];

		$vars_to_cache = [
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'currentyear',
		];

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = wpseo_replace_vars( '%%' . $var . '%%', $post );
		}

		// Merge custom replace variables with the WordPress ones.
		return array_merge( $cached_replacement_vars, $this->get_custom_replace_vars( $post ) );
	}

	/**
	 * Prepares the recommended replace vars for localization.
	 *
	 * @return array Recommended replacement variables.
	 */
	private function get_recommended_replace_vars() {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
		$post                     = $this->get_metabox_post();

		// What is recommended depends on the current context.
		$post_type = $recommended_replace_vars->determine_for_post( $post );

		return $recommended_replace_vars->get_recommended_replacevars_for( $post_type );
	}

	/**
	 * Gets the custom replace variables for custom taxonomies and fields.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_replace_vars( $post ) {
		return [
			'custom_fields'     => $this->get_custom_fields_replace_vars( $post ),
			'custom_taxonomies' => $this->get_custom_taxonomies_replace_vars( $post ),
		];
	}

	/**
	 * Gets the custom replace variables for custom taxonomies.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_taxonomies_replace_vars( $post ) {
		$taxonomies          = get_object_taxonomies( $post, 'objects' );
		$custom_replace_vars = [];

		foreach ( $taxonomies as $taxonomy_name => $taxonomy ) {

			if ( is_string( $taxonomy ) ) { // If attachment, see https://core.trac.wordpress.org/ticket/37368 .
				$taxonomy_name = $taxonomy;
				$taxonomy      = get_taxonomy( $taxonomy_name );
			}

			if ( $taxonomy->_builtin && $taxonomy->public ) {
				continue;
			}

			$custom_replace_vars[ $taxonomy_name ] = [
				'name'        => $taxonomy->name,
				'description' => $taxonomy->description,
			];
		}

		return $custom_replace_vars;
	}

	/**
	 * Gets the custom replace variables for custom fields.
	 *
	 * @param WP_Post $post The post to check for custom fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_fields_replace_vars( $post ) {
		$custom_replace_vars = [];

		// If no post object is passed, return the empty custom_replace_vars array.
		if ( ! is_object( $post ) ) {
			return $custom_replace_vars;
		}

		$custom_fields = get_post_custom( $post->ID );

		foreach ( $custom_fields as $custom_field_name => $custom_field ) {
			// Skip private custom fields.
			if ( substr( $custom_field_name, 0, 1 ) === '_' ) {
				continue;
			}

			// Skip custom field values that are serialized.
			if ( is_serialized( $custom_field[0] ) ) {
				continue;
			}

			$custom_replace_vars[ $custom_field_name ] = $custom_field[0];
		}

		return $custom_replace_vars;
	}

	/**
	 * Checks if the page is the post overview page.
	 *
	 * @param string $page The page to check for the post overview page.
	 *
	 * @return bool Whether or not the given page is the post overview page.
	 */
	public static function is_post_overview( $page ) {
		return $page === 'edit.php';
	}

	/**
	 * Checks if the page is the post edit page.
	 *
	 * @param string $page The page to check for the post edit page.
	 *
	 * @return bool Whether or not the given page is the post edit page.
	 */
	public static function is_post_edit( $page ) {
		return $page === 'post.php'
			|| $page === 'post-new.php';
	}

	/**
	 * Retrieves the product title.
	 *
	 * @return string The product title.
	 */
	protected function get_product_title() {
		$product_title = 'Yoast SEO';

		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			$product_title .= ' Premium';
		}

		return $product_title;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Outputs a tab in the Yoast SEO Metabox.
	 *
	 * @deprecated         12.2
	 * @codeCoverageIgnore
	 *
	 * @param string $id      CSS ID of the tab.
	 * @param string $heading Heading for the tab.
	 * @param string $content Content of the tab. This content should be escaped.
	 */
	public function do_tab( $id, $heading, $content ) {
		_deprecated_function( __METHOD__, '12.2' );

		?>
		<div id="<?php echo esc_attr( 'wpseo_' . $id ); ?>" class="wpseotab wpseo-form <?php echo esc_attr( $id ); ?>">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: deprecated function.
			echo $content;
			?>
		</div>
		<?php
	}
}
