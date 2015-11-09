<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */
class WPSEO_Metabox extends WPSEO_Meta {

	/**
	 * @var array
	 */
	private $options;

	/**
	 * @var WPSEO_Social_Admin
	 */
	protected $social_admin;

	/**
	 * Class constructor
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_insert_post', array( $this, 'save_postdata' ) );
		add_action( 'edit_attachment', array( $this, 'save_postdata' ) );
		add_action( 'add_attachment', array( $this, 'save_postdata' ) );
		add_action( 'post_submitbox_misc_actions', array( $this, 'publish_box' ) );
		add_action( 'admin_init', array( $this, 'setup_page_analysis' ) );
		add_action( 'admin_init', array( $this, 'translate_meta_boxes' ) );
		add_action( 'admin_footer', array( $this, 'scoring_svg' ) );
		add_action( 'admin_footer', array( $this, 'template_keyword_tab' ) );

		$this->options = WPSEO_Options::get_all();

		// Check if on of the social settings is checked in the options, if so, initialize the social_admin object.
		if ( $this->options['opengraph'] === true || $this->options['twitter'] === true || $this->options['googleplus'] === true ) {
			$this->social_admin = new WPSEO_Social_Admin( $this->options );
		}
	}

	/**
	 * Translate text strings for use in the meta box
	 *
	 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
	 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
	 */
	public static function translate_meta_boxes() {
		self::$meta_fields['general']['snippetpreview']['title'] = __( 'Snippet', 'wordpress-seo' );
		self::$meta_fields['general']['snippetpreview']['help']  = sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results.<br/><br/>Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/snippet-preview/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=snippet-preview">', '</a>' );

		self::$meta_fields['general']['pageanalysis']['title'] = __( 'Page Analysis', 'wordpress-seo' );
		self::$meta_fields['general']['pageanalysis']['help']  = sprintf( __( 'This is the content analysis, a collection of content checks that analyze the content of your page. Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/real-time-content-analysis/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=snippet-preview">', '</a>' );

		self::$meta_fields['general']['focuskw']['title'] = __( 'Focus Keyword', 'wordpress-seo' );
		self::$meta_fields['general']['focuskw']['help']  = sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about.<br/><br/>Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/focus-keyword/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=focus-keyword">', '</a>' );

		self::$meta_fields['general']['title']['title']       = __( 'SEO Title', 'wordpress-seo' );

		self::$meta_fields['general']['metadesc']['title']       = __( 'Meta description', 'wordpress-seo' );

		self::$meta_fields['general']['metakeywords']['title']       = __( 'Meta keywords', 'wordpress-seo' );
		self::$meta_fields['general']['metakeywords']['description'] = __( 'If you type something above it will override your %smeta keywords template%s.', 'wordpress-seo' );


		self::$meta_fields['advanced']['meta-robots-noindex']['title'] = __( 'Meta Robots Index', 'wordpress-seo' );
		if ( '0' == get_option( 'blog_public' ) ) {
			self::$meta_fields['advanced']['meta-robots-noindex']['description'] = '<p class="error-message">' . __( 'Warning: even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) . '</p>';
		}
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['0'] = __( 'Default for post type, currently: %s', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['2'] = __( 'index', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['1'] = __( 'noindex', 'wordpress-seo' );

		self::$meta_fields['advanced']['meta-robots-nofollow']['title']        = __( 'Meta Robots Follow', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-nofollow']['options']['0'] = __( 'Follow', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-nofollow']['options']['1'] = __( 'Nofollow', 'wordpress-seo' );

		self::$meta_fields['advanced']['meta-robots-adv']['title']                   = __( 'Meta Robots Advanced', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['description']             = __( 'Advanced <code>meta</code> robots settings for this page.', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['-']            = __( 'Site-wide default: %s', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['none']         = __( 'None', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noodp']        = __( 'NO ODP', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noydir']       = __( 'NO YDIR', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noimageindex'] = __( 'No Image Index', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noarchive']    = __( 'No Archive', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['nosnippet']    = __( 'No Snippet', 'wordpress-seo' );

		self::$meta_fields['advanced']['bctitle']['title']       = __( 'Breadcrumbs Title', 'wordpress-seo' );
		self::$meta_fields['advanced']['bctitle']['description'] = __( 'Title to use for this page in breadcrumb paths', 'wordpress-seo' );

		self::$meta_fields['advanced']['canonical']['title']       = __( 'Canonical URL', 'wordpress-seo' );
		self::$meta_fields['advanced']['canonical']['description'] = sprintf( __( 'The canonical URL that this page should point to, leave empty to default to permalink. %sCross domain canonical%s supported too.', 'wordpress-seo' ), '<a target="_blank" href="http://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html">', '</a>' );

		self::$meta_fields['advanced']['redirect']['title']       = __( '301 Redirect', 'wordpress-seo' );
		self::$meta_fields['advanced']['redirect']['description'] = __( 'The URL that this page should redirect to.', 'wordpress-seo' );

		do_action( 'wpseo_tab_translate' );
	}

	/**
	 * Test whether the metabox should be hidden either by choice of the admin or because
	 * the post type is not a public post type
	 *
	 * @since 1.5.0
	 *
	 * @param  string $post_type (optional) The post type to test, defaults to the current post post_type.
	 *
	 * @return  bool        Whether or not the meta box (and associated columns etc) should be hidden
	 */
	function is_metabox_hidden( $post_type = null ) {
		if ( ! isset( $post_type ) && ( isset( $GLOBALS['post'] ) && ( is_object( $GLOBALS['post'] ) && isset( $GLOBALS['post']->post_type ) ) ) ) {
			$post_type = $GLOBALS['post']->post_type;
		}

		if ( isset( $post_type ) ) {
			// Don't make static as post_types may still be added during the run.
			$cpts    = get_post_types( array( 'public' => true ), 'names' );
			$options = get_option( 'wpseo_titles' );

			return ( ( isset( $options[ 'hideeditbox-' . $post_type ] ) && $options[ 'hideeditbox-' . $post_type ] === true ) || in_array( $post_type, $cpts ) === false );
		}
		return false;
	}

	/**
	 * Sets up all the functionality related to the prominence of the page analysis functionality.
	 */
	public function setup_page_analysis() {
		if ( apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
			add_action( 'post_submitbox_misc_actions', array( $this, 'publish_box' ) );
		}
	}

	/**
	 * Outputs the page analysis score in the Publish Box.
	 */
	public function publish_box() {
		if ( $this->is_metabox_hidden() === true ) {
			return;
		}

		$post = $this->get_metabox_post();
		if ( self::get_value( 'meta-robots-noindex', $post->ID ) === '1' ) {
			$score_label = 'noindex';
			$title       = __( 'Post is set to noindex.', 'wordpress-seo' );
			$score_title = $title;
		}
		else {
			$score = self::get_value( 'linkdex', $post->ID );
			if ( $score === '' ) {
				$score_label = 'na';
				$title       = __( 'No focus keyword set.', 'wordpress-seo' );
			}
			else {
				$score_label = WPSEO_Utils::translate_score( $score );
			}

			$score_title = WPSEO_Utils::translate_score( $score, false );
			if ( ! isset( $title ) ) {
				$title = $score_title;
			}
		}

		printf( '
		<div class="misc-pub-section misc-yoast misc-pub-section-last" id="wpseo-score">

		</div>',
			esc_attr( $title ),
			esc_attr( 'wpseo-score-icon ' . $score_label ),
			__( 'SEO:', 'wordpress-seo' ),
			$score_title,
			__( 'Check', 'wordpress-seo' )
		);
	}

	/**
	 * Adds the Yoast SEO meta box to the edit boxes in the edit post / page  / cpt pages.
	 */
	public function add_meta_box() {
		$post_types = get_post_types( array( 'public' => true ) );

		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $post_type ) {
				if ( $this->is_metabox_hidden( $post_type ) === false ) {
					$product_title = 'Yoast SEO';
					if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
						$product_title .= ' Premium';
					}

					add_meta_box( 'wpseo_meta', $product_title, array(
						$this,
						'meta_box',
					), $post_type, 'normal', apply_filters( 'wpseo_metabox_prio', 'high' ) );
				}
			}
		}
	}

	/**
	 * Pass variables to js for use with the post-scraper
	 *
	 * @return array
	 */
	public function localize_post_scraper_script() {
		$translations = $this->get_scraper_translations();

		return array(
			'translations'  => $translations,
			'keyword_usage' => $this->get_focus_keyword_usage(),
			'search_url'    => admin_url( 'edit.php?seo_kw_filter={keyword}' ),
			'post_edit_url' => admin_url( 'post.php?post={id}&action=edit' ),
			'home_url'      => home_url( '/', null ),
			'sep'           => WPSEO_Utils::get_title_separator(),
			'sitename'      => WPSEO_Utils::get_site_name(),
			'contentTab'    => __( 'Content:' , 'wordpress-seo' ),
		);
	}

	/**
	 * Pass some variables to js for replacing variables.
	 */
	public function localize_replace_vars_script() {
		return array(
			'no_parent_text' => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'   => $this->get_replace_vars(),
		);
	}

	/**
	 * Pass some variables to js for the edit / post page overview, snippet preview, etc.
	 *
	 * @return  array
	 */
	public function localize_shortcode_plugin_script() {
		return array(
			'wpseo_filter_shortcodes_nonce' => wp_create_nonce( 'wpseo-filter-shortcodes' ),
			'wpseo_shortcode_tags'          => $this->get_valid_shortcode_tags(),
		);
	}

	/**
	 * Output a tab in the Yoast SEO Metabox
	 *
	 * @param string $id      CSS ID of the tab.
	 * @param string $heading Heading for the tab.
	 * @param string $content Content of the tab. This content should be escaped.
	 */
	public function do_tab( $id, $heading, $content ) {
		?>
		<div id="wpseo_<?php echo esc_attr( $id ) ?>" class="wpseotab <?php echo esc_attr( $id ) ?>">
			<h4 class="wpseo-heading"><?php echo esc_html( $heading ); ?></h4>
			<table class="form-table">
				<?php echo $content ?>
			</table>
		</div>
	<?php
	}

	/**
	 * Output the meta box
	 */
	public function meta_box() {
		$content_sections = $this->get_content_sections();

		echo '<div class="wpseo-metabox-sidebar"><ul>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_link();
		}

		echo '</ul></div>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_content();
		}
	}

	/**
	 * Returns the relevant metabox sections for the current view.
	 *
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_content_sections() {
		$content_sections = array( $this->get_content_meta_section() );

		if ( current_user_can( 'manage_options' ) || $this->options['disableadvanced_meta'] === false ) {
			$content_sections[] = $this->get_advanced_meta_section();
		}

		// Check if social_admin is an instance of WPSEO_Social_Admin.
		if ( is_a( $this->social_admin, 'WPSEO_Social_Admin' ) ) {
			$content_sections[] = $this->social_admin->get_meta_section();
		}

		if ( has_action( 'wpseo_tab_header' ) || has_action( 'wpseo_tab_content' ) ) {
			$content_sections[] = $this->get_addons_meta_section();
		}
		return $content_sections;
	}

	/**
	 * Returns the metabox section for the content analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_content_meta_section() {
		$content = $this->get_tab_content( 'general' );

		$tabs = array();

		$tabs[] = new WPSEO_Metabox_Form_Tab(
			'content',
			$content,
			__( 'Content', 'wordpress-seo' ),
			array(
				'link_class' => 'wpseo_keyword_tab',
				'link_title' => __( 'Content', 'wordpress-seo' ),
			)
		);

		$tabs[] = new Metabox_Add_Keyword_Tab();

		return new WPSEO_Metabox_Tab_Section(
			'content',
			'<span class="yst-traffic-light-container">' . $this->traffic_light_svg() . '</span>',
			$tabs,
			array(
				'link_alt' => __( 'Content', 'wordpress-seo' ),
				'link_title' => __( 'Content', 'wordpress-seo' ),
			)
		);
	}

	/**
	 * Returns the metabox section for the advanced settings.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_advanced_meta_section() {
		$content = $this->get_tab_content( 'advanced' );

		$tab = new WPSEO_Metabox_Form_Tab(
			'advanced',
			$content,
			__( 'Advanced', 'wordpress-seo' ),
			array(
				'link_title' => __( 'Advanced', 'wordpress-seo' ),
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'advanced',
			'<span class="dashicons dashicons-admin-generic"></span>',
			array( $tab ),
			array(
				'link_alt' => __( 'Advanced', 'wordpress-seo' ),
				'link_title' => __( 'Advanced', 'wordpress-seo' ),
			)
		);
	}

	/**
	 * Returns a metabox section dedicated to hosting metabox tabs that have been added by other plugins through the
	 * `wpseo_tab_header` and `wpseo_tab_content` actions.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_addons_meta_section() {
		return new WPSEO_Metabox_Addon_Tab_Section(
			'addons',
			'<span class="dashicons dashicons-admin-plugins"></span>',
			array(),
			array(
				'link_alt' => __( 'Add-ons', 'wordpress-seo' ),
				'link_title' => __( 'Add-ons', 'wordpress-seo' ),
			)
		);
	}

	/**
	 * Gets the table contents for the metabox tab.
	 *
	 * @param string $tab_name Tab for which to retrieve the field definitions.
	 *
	 * @return string
	 */
	private function get_tab_content( $tab_name ) {
		$content = '';
		foreach ( $this->get_meta_field_defs( $tab_name ) as $key => $meta_field ) {
			$content .= $this->do_meta_box( $meta_field, $key );
		}
		unset( $key, $meta_field );

		return $content;
	}

	/**
	 * Adds a line in the meta box
	 *
	 * @todo [JRF] check if $class is added appropriately everywhere
	 *
	 * @param   array  $meta_field_def Contains the vars based on which output is generated.
	 * @param   string $key            Internal key (without prefix).
	 *
	 * @return  string
	 */
	function do_meta_box( $meta_field_def, $key = '' ) {
		$content      = '';
		$esc_form_key = esc_attr( self::$form_prefix . $key );
		$meta_value   = self::get_value( $key, $this->get_metabox_post()->ID );

		$class = '';
		if ( isset( $meta_field_def['class'] ) && $meta_field_def['class'] !== '' ) {
			$class = ' ' . $meta_field_def['class'];
		}

		$placeholder = '';
		if ( isset( $meta_field_def['placeholder'] ) && $meta_field_def['placeholder'] !== '' ) {
			$placeholder = $meta_field_def['placeholder'];
		}

		switch ( $meta_field_def['type'] ) {
			case 'pageanalysis':
				$content .= '<div id="wpseo-pageanalysis"></div>';
				break;
			case 'snippetpreview':
				$content .= '<div id="wpseosnippet" class="wpseosnippet"></div>';
				break;

			case 'text':
				$ac = '';
				if ( isset( $meta_field_def['autocomplete'] ) && $meta_field_def['autocomplete'] === false ) {
					$ac = 'autocomplete="off" ';
				}
				if ( $placeholder !== '' ) {
					$placeholder = ' placeholder="' . esc_attr( $placeholder ) . '"';
				}
				$content .= '<input type="text"' . $placeholder . ' id="' . $esc_form_key . '" ' . $ac . 'name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '" class="large-text' . $class . '"/><br />';
				break;

			case 'textarea':
				$rows = 3;
				if ( isset( $meta_field_def['rows'] ) && $meta_field_def['rows'] > 0 ) {
					$rows = $meta_field_def['rows'];
				}
				$content .= '<textarea class="large-text' . $class . '" rows="' . esc_attr( $rows ) . '" id="' . $esc_form_key . '" name="' . $esc_form_key . '">' . esc_textarea( $meta_value ) . '</textarea>';
				break;

			case 'hidden':
				$content .= '<input type="hidden" id="' . $esc_form_key . '" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '"/><br />';
				break;
			case 'select':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== array() ) {
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
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== array() ) {

					// Set $meta_value as $selected_arr.
					$selected_arr = $meta_value;

					// If the multiselect field is 'meta-robots-adv' we should explode on ,.
					if ( 'meta-robots-adv' === $key ) {
						$selected_arr = explode( ',', $meta_value );
					}

					if ( ! is_array( $selected_arr ) ) {
						$selected_arr = (array) $selected_arr;
					}

					$options_count = count( $meta_field_def['options'] );

					// @todo [JRF => whomever] verify height calculation for older WP versions, was 16x, for WP3.8 20x is more appropriate.
					$content .= '<select multiple="multiple" size="' . esc_attr( $options_count ) . '" style="height: ' . esc_attr( ( $options_count * 20 ) + 4 ) . 'px;" name="' . $esc_form_key . '[]" id="' . $esc_form_key . '" class="yoast' . $class . '">';
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$selected = '';
						if ( in_array( $val, $selected_arr ) ) {
							$selected = ' selected="selected"';
						}
						$content .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
					}
					$content .= '</select>';
					unset( $val, $option, $selected, $selected_arr, $options_count );
				}
				break;

			case 'checkbox':
				$checked = checked( $meta_value, 'on', false );
				$expl    = ( isset( $meta_field_def['expl'] ) ) ? esc_html( $meta_field_def['expl'] ) : '';
				$content .= '<label for="' . $esc_form_key . '"><input type="checkbox" id="' . $esc_form_key . '" name="' . $esc_form_key . '" ' . $checked . ' value="on" class="yoast' . $class . '"/> ' . $expl . '</label><br />';
				unset( $checked, $expl );
				break;

			case 'radio':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== array() ) {
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$checked = checked( $meta_value, $val, false );
						$content .= '<input type="radio" ' . $checked . ' id="' . $esc_form_key . '_' . esc_attr( $val ) . '" name="' . $esc_form_key . '" value="' . esc_attr( $val ) . '"/> <label for="' . $esc_form_key . '_' . esc_attr( $val ) . '">' . esc_html( $option ) . '</label> ';
					}
					unset( $val, $option, $checked );
				}
				break;

			case 'upload':
				$content .= '<input id="' . $esc_form_key . '" type="text" size="36" class="' . $class . '" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '" />';
				$content .= '<input id="' . $esc_form_key . '_button" class="wpseo_image_upload_button button" type="button" value="Upload Image" />';
				break;
		}


		$html = '';
		if ( $content === '' ) {
			$content = apply_filters( 'wpseo_do_meta_box_field_' . $key, $content, $meta_value, $esc_form_key, $meta_field_def, $key );
		}

		if ( $content !== '' ) {

			$label = esc_html( $meta_field_def['title'] );
			if ( in_array( $meta_field_def['type'], array(
					'snippetpreview',
					'pageanalysis',
					'radio',
					'checkbox',
				), true ) === false
			) {
				$label = '<label for="' . $esc_form_key . '">' . $label . ':</label>';
			}

			$help = '';
			if ( isset( $meta_field_def['help'] ) && $meta_field_def['help'] !== '' ) {
				$help = '<img src="' . plugins_url( 'images/question-mark.png', WPSEO_FILE ) . '" class="alignright yoast_help" id="' . esc_attr( $key . 'help' ) . '" alt="' . esc_attr( $meta_field_def['help'] ) . '" />';
			}

			if ( $meta_field_def['type'] === 'hidden' ) {
				$html = '<tr class="wpseo_hidden"><td>' . $content . '</td></tr>';
			}
			else {
				$html = '
					<tr>
						<th scope="row">' . $label . $help . '</th>
						<td>';

				$html .= $content;

				if ( isset( $meta_field_def['description'] ) ) {
					$html .= '<div>' . $meta_field_def['description'] . '</div>';
				}

				$html .= '
					</td>
				</tr>';
			}
		}

		return $html;
	}

	/**
	 * Save the WP SEO metadata for posts.
	 *
	 * @internal $_POST parameters are validated via sanitize_post_meta()
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return  bool|void   Boolean false if invalid save post request
	 */
	function save_postdata( $post_id ) {
		if ( $post_id === null ) {
			return false;
		}

		if ( wp_is_post_revision( $post_id ) ) {
			$post_id = wp_is_post_revision( $post_id );
		}

		clean_post_cache( $post_id );
		$post = get_post( $post_id );

		if ( ! is_object( $post ) ) {
			// Non-existent post.
			return false;
		}

		do_action( 'wpseo_save_compare_data', $post );

		$meta_boxes = apply_filters( 'wpseo_save_metaboxes', array() );
		$meta_boxes = array_merge( $meta_boxes, $this->get_meta_field_defs( 'general', $post->post_type ), $this->get_meta_field_defs( 'advanced' ) );

		foreach ( $meta_boxes as $key => $meta_box ) {
			$data = null;
			if ( 'checkbox' === $meta_box['type'] ) {
				$data = isset( $_POST[ self::$form_prefix . $key ] ) ? 'on' : 'off';
			}
			else {
				if ( isset( $_POST[ self::$form_prefix . $key ] ) ) {
					$data = $_POST[ self::$form_prefix . $key ];
				}
			}
			if ( isset( $data ) ) {
				self::set_value( $key, $data, $post_id );
			}
		}

		do_action( 'wpseo_saved_postdata' );
	}

	/**
	 * Enqueues all the needed JS and CSS.
	 * @todo [JRF => whomever] create css/metabox-mp6.css file and add it to the below allowed colors array when done
	 */
	public function enqueue() {
		global $pagenow;
		/* Filter 'wpseo_always_register_metaboxes_on_admin' documented in wpseo-main.php */
		if ( ( ! in_array( $pagenow, array(
					'post-new.php',
					'post.php',
					'edit.php',
				), true ) && apply_filters( 'wpseo_always_register_metaboxes_on_admin', false ) === false ) || $this->is_metabox_hidden() === true
		) {
			return;
		}

		if ( $pagenow == 'edit.php' ) {
			wp_enqueue_style( 'edit-page', plugins_url( 'css/edit-page' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		}
		else {

			if ( 0 != get_queried_object_id() ) {
				wp_enqueue_media( array( 'post' => get_queried_object_id() ) ); // Enqueue files needed for upload functionality.
			}

			wp_enqueue_style( 'wp-seo-metabox', plugins_url( 'css/metabox' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'wp-seo-scoring', plugins_url( 'css/yst_seo_score' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'wp-seo-snippet', plugins_url( 'css/snippet' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'yoast-seo', plugins_url( 'css/dist/yoast-seo/yoast-seo.min.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'jquery-qtip', plugins_url( 'css/jquery.qtip' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), '2.2.1' );

			wp_enqueue_script( 'wp-seo-metabox', plugins_url( 'js/wp-seo-metabox' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
			), WPSEO_VERSION );

			wp_enqueue_script( 'wpseo-admin-media', plugins_url( 'js/wp-seo-admin-media' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
			), WPSEO_VERSION, true );

			wp_enqueue_script( 'yoast-seo', plugins_url( 'js/dist/yoast-seo/yoast-seo.min.js', WPSEO_FILE ), null, WPSEO_VERSION, true );
			wp_enqueue_script( 'wp-seo-post-scraper', plugins_url( 'js/wp-seo-post-scraper' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'yoast-seo' ), WPSEO_VERSION, true );
			wp_enqueue_script( 'wp-seo-replacevar-plugin', plugins_url( 'js/wp-seo-replacevar-plugin' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'yoast-seo', 'wp-seo-post-scraper' ), WPSEO_VERSION, true );
			wp_enqueue_script( 'wp-seo-shortcode-plugin', plugins_url( 'js/wp-seo-shortcode-plugin' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'yoast-seo', 'wp-seo-post-scraper' ), WPSEO_VERSION, true );
			wp_enqueue_script( 'jquery-ui-autocomplete' );
			wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '2.2.1', true );

			wp_localize_script( 'wpseo-admin-media', 'wpseoMediaL10n', $this->localize_media_script() );
			wp_localize_script( 'wp-seo-post-scraper', 'wpseoPostScraperL10n', $this->localize_post_scraper_script() );
			wp_localize_script( 'wp-seo-replacevar-plugin', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );
			wp_localize_script( 'wp-seo-shortcode-plugin', 'wpseoShortcodePluginL10n', $this->localize_shortcode_plugin_script() );

			if ( post_type_supports( get_post_type(), 'thumbnail' ) ) {
				wp_enqueue_style( 'featured-image', plugins_url( 'css/featured-image' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
				wp_enqueue_script( 'wp-seo-featured-image', plugins_url( 'js/wp-seo-featured-image' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );

				$featured_image_l10 = array( 'featured_image_notice' => __( 'The featured image should be at least 200x200 pixels to be picked up by Facebook and other social media sites.', 'wordpress-seo' ) );
				wp_localize_script( 'wp-seo-metabox', 'wpseoFeaturedImageL10n', $featured_image_l10 );
			}
		}
	}

	/**
	 * Pass some variables to js for upload module.
	 *
	 * @return  array
	 */
	public function localize_media_script() {
		return array(
			'choose_image' => __( 'Use Image', 'wordpress-seo' ),
		);
	}

	/**
	 * Retrieve a post date when post is published, or return current date when it's not.
	 *
	 * @param WP_Post $post The post for which to retrieve the post date.
	 *
	 * @return string
	 */
	public function get_post_date( $post ) {
		if ( isset( $post->post_date ) && $post->post_status === 'publish' ) {
			$date = date_i18n( 'j M Y', strtotime( $post->post_date ) );
		}
		else {
			$date = date_i18n( 'j M Y' );
		}

		return (string) $date;
	}

	/**
	 * Returns post in metabox context
	 *
	 * @returns WP_Post|array
	 */
	protected function get_metabox_post() {
		if ( $post = filter_input( INPUT_GET, 'post' ) ) {
			$post_id = (int) WPSEO_Utils::validate_int( $post );

			return get_post( $post_id );
		}


		if ( isset( $GLOBALS['post'] ) ) {
			return $GLOBALS['post'];
		}

		return array();
	}

	/**
	 * Counting the number of given keyword used for other posts than given post_id
	 *
	 * @return array
	 */
	private function get_focus_keyword_usage() {
		$post = $this->get_metabox_post();
		if ( is_object( $post ) ) {
			$keyword = WPSEO_Meta::get_value( 'focuskw', $post->ID );

			return array(
				$keyword => WPSEO_Meta::keyword_usage( $keyword, $post->ID ),
			);
		}

		return array();
	}

	/********************** DEPRECATED METHODS **********************/

	/**
	 * Adds the Yoast SEO box
	 *
	 * @deprecated 1.4.24
	 * @deprecated use WPSEO_Metabox::add_meta_box()
	 * @see        WPSEO_Meta::add_meta_box()
	 */
	public function add_custom_box() {
		_deprecated_function( __METHOD__, 'WPSEO 1.4.24', 'WPSEO_Metabox::add_meta_box()' );
		$this->add_meta_box();
	}

	/**
	 * Retrieve the meta boxes for the given post type.
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Meta::get_meta_field_defs()
	 * @see        WPSEO_Meta::get_meta_field_defs()
	 *
	 * @param  string $post_type The post type for which to get the meta fields.
	 *
	 * @return  array
	 */
	public function get_meta_boxes( $post_type = 'post' ) {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_meta_field_defs()' );

		return $this->get_meta_field_defs( 'general', $post_type );
	}

	/**
	 * Pass some variables to js
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Meta::localize_script()
	 * @see        WPSEO_Meta::localize_script()
	 */
	public function script() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Meta::localize_script()' );

		return $this->localize_script();
	}

	/**
	 * Returns an array with shortcode tags for all registered shortcodes.
	 *
	 * @return array
	 */
	private function get_valid_shortcode_tags() {
		$shortcode_tags = array();

		foreach ( $GLOBALS['shortcode_tags'] as $tag => $description ) {
			array_push( $shortcode_tags, $tag );
		}

		return $shortcode_tags;
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @return array replace vars
	 */
	private function get_replace_vars() {
		$post = $this->get_metabox_post();

		$cached_replacement_vars = array();

		$vars_to_cache = array(
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'currenttime',
			'currentdate',
			'currentday',
			'currentmonth',
			'currentyear',
		);

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = wpseo_replace_vars( '%%' . $var . '%%', $post );
		}

		return $cached_replacement_vars;
	}

	/**
	 * SVG for the general SEO score.
	 */
	public function scoring_svg() {
		// Only do this on the edit post pages.
		if ( 'post' !== get_current_screen()->base && 'post-new' !== get_current_screen()->base ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-score_svg">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve" width="50" height="50">
					<g id="BG"></g>
					<g id="BG_dark"></g>
					<g id="bg_light"><path fill="#5B2942" d="M415,500H85c-46.8,0-85-38.2-85-85V85C0,38.2,38.2,0,85,0h330c46.8,0,85,38.2,85,85v330	C500,461.8,461.8,500,415,500z"/>
						<path fill="none" stroke="#7EADB9" stroke-width="17" stroke-miterlimit="10" d="M404.6,467H95.4C61.1,467,33,438.9,33,404.6V95.4	C33,61.1,61.1,33,95.4,33h309.2c34.3,0,62.4,28.1,62.4,62.4v309.2C467,438.9,438.9,467,404.6,467z"/>
					</g>
					<g id="Layer_2">
						<circle id="score_circle_shadow" fill="#77B227" cx="250" cy="250" r="155"/>
						<path id="score_circle" fill="#9FDA4F" d="M172.5,384.2C98.4,341.4,73,246.6,115.8,172.5S253.4,73,327.5,115.8"/>
						<g>
							<g>
								<g display="none">
									<path display="inline" fill="#FEC228" d="M668,338.4c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
									<path display="inline" fill="#8BDA53" d="M668,215.1c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
									<path display="inline" fill="#FF443D" d="M668,461.7c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</script>';
	}

	/**
	 * Return the SVG for the traffic light in the metabox.
	 */
	public function traffic_light_svg() {
		return <<<SVG
<svg class="yst-traffic-light na" version="1.1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
	 x="0px" y="0px" viewBox="0 0 30 47" enable-background="new 0 0 30 47" xml:space="preserve">
<g id="BG_1_">
</g>
<g id="traffic_light">
	<g>
		<g>
			<g>
				<path fill="#5B2942" d="M22,0H8C3.6,0,0,3.6,0,7.9v31.1C0,43.4,3.6,47,8,47h14c4.4,0,8-3.6,8-7.9V7.9C30,3.6,26.4,0,22,0z
					 M27.5,38.8c0,3.1-2.6,5.7-5.8,5.7H8.3c-3.2,0-5.8-2.5-5.8-5.7V8.3c0-1.5,0.6-2.9,1.7-4c1.1-1,2.5-1.6,4.1-1.6h13.4
					c1.5,0,3,0.6,4.1,1.6c1.1,1.1,1.7,2.5,1.7,4V38.8z"/>
			</g>
			<g class="traffic-light-color traffic-light-red">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#E31C15" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-orange">
				<ellipse fill="#F49A00" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-green">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#63B22B" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-empty">
				<ellipse fill="#5B2942" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#5B2942" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#5B2942" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
		</g>
	</g>
</g>
</svg>
SVG;

	}

	/**
	 * Keyword tab for enabling analysis of multiple keywords.
	 */
	public function template_keyword_tab() {
		// Only do this on the edit post pages.
		if ( 'post' !== get_current_screen()->base && 'post-new' !== get_current_screen()->base ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-keyword_tab">
				<li class="wpseo_keyword_tab<# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_content" data-keyword="{{data.keyword}}" data-score="{{data.score}}">
						{{data.prefix}}
						<span class="wpseo-score-icon {{data.score}}">
							<span class="screen-reader-text"></span>
						</span>
						<em><span class="wpseo_keyword">{{data.placeholder}}</span></em>
					</a>
					<# if ( ! data.hideRemove ) { #>
						<a href="#" class="remove-keyword"><span>x</span></a>
					<# } #>
				</li>
			</script>';
	}

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_scraper_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}
		return array();
	}
} /* End of class */
