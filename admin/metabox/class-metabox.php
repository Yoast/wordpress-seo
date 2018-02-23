<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */
class WPSEO_Metabox extends WPSEO_Meta {

	/**
	 * @var WPSEO_Social_Admin
	 */
	protected $social_admin;

	/**
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	protected $analysis_seo;

	/**
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	protected $analysis_readability;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_insert_post', array( $this, 'save_postdata' ) );
		add_action( 'edit_attachment', array( $this, 'save_postdata' ) );
		add_action( 'add_attachment', array( $this, 'save_postdata' ) );
		add_action( 'post_submitbox_start', array( $this, 'publish_box' ) );
		add_action( 'admin_init', array( $this, 'setup_page_analysis' ) );
		add_action( 'admin_init', array( $this, 'translate_meta_boxes' ) );
		add_action( 'admin_footer', array( $this, 'template_keyword_tab' ) );
		add_action( 'admin_footer', array( $this, 'template_generic_tab' ) );

		// Check if one of the social settings is checked in the options, if so, initialize the social_admin object.
		if ( WPSEO_Options::get( 'opengraph', false ) || WPSEO_Options::get( 'twitter', false ) ) {
			$this->social_admin = new WPSEO_Social_Admin();
		}

		$this->editor = new WPSEO_Metabox_Editor();
		$this->editor->register_hooks();

		$this->analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$this->analysis_readability = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Translate text strings for use in the meta box.
	 *
	 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
	 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
	 */
	public static function translate_meta_boxes() {
		self::$meta_fields['general']['snippetpreview']['title'] = __( 'Snippet editor', 'wordpress-seo' );
		/* translators: 1: link open tag; 2: link close tag. */
		self::$meta_fields['general']['snippetpreview']['help']        = sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results. %1$sLearn more about the Snippet Preview%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/snippet-preview' ) . '">', '</a>' );
		self::$meta_fields['general']['snippetpreview']['help-button'] = __( 'Show information about the snippet editor', 'wordpress-seo' );

		self::$meta_fields['general']['pageanalysis']['title'] = __( 'Analysis', 'wordpress-seo' );
		/* translators: 1: link open tag; 2: link close tag. */
		self::$meta_fields['general']['pageanalysis']['help']        = sprintf( __( 'This is the content analysis, a collection of content checks that analyze the content of your page. %1$sLearn more about the Content Analysis Tool%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/content-analysis' ) . '">', '</a>' );
		self::$meta_fields['general']['pageanalysis']['help-button'] = __( 'Show information about the content analysis', 'wordpress-seo' );

		self::$meta_fields['general']['focuskw_text_input']['title'] = __( 'Focus keyword', 'wordpress-seo' );
		self::$meta_fields['general']['focuskw_text_input']['label'] = __( 'Enter a focus keyword', 'wordpress-seo' );
		/* translators: 1: link open tag; 2: link close tag. */
		self::$meta_fields['general']['focuskw_text_input']['help']        = sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about. %1$sLearn more about the Focus Keyword%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/focus-keyword' ) . '">', '</a>' );
		self::$meta_fields['general']['focuskw_text_input']['help-button'] = __( 'Show information about the focus keyword', 'wordpress-seo' );

		self::$meta_fields['general']['title']['title'] = __( 'SEO title', 'wordpress-seo' );

		self::$meta_fields['general']['metadesc']['title'] = __( 'Meta description', 'wordpress-seo' );

		/* translators: %s expands to the post type name. */
		self::$meta_fields['advanced']['meta-robots-noindex']['title'] = __( 'Allow search engines to show this %s in search results?', 'wordpress-seo' );
		if ( '0' === (string) get_option( 'blog_public' ) ) {
			self::$meta_fields['advanced']['meta-robots-noindex']['description'] = '<p class="error-message">' . __( 'Warning: even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) . '</p>';
		}
		/* translators: %1$s expands to Yes or No,  %2$s expands to the post type name.*/
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['0'] = __( 'Default for %2$s, currently: %1$s', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['2'] = __( 'Yes', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-noindex']['options']['1'] = __( 'No', 'wordpress-seo' );

		/* translators: %1$s expands to the post type name.*/
		self::$meta_fields['advanced']['meta-robots-nofollow']['title']        = __( 'Should search engines follow links on this %1$s?', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-nofollow']['options']['0'] = __( 'Yes', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-nofollow']['options']['1'] = __( 'No', 'wordpress-seo' );

		self::$meta_fields['advanced']['meta-robots-adv']['title']       = __( 'Meta robots advanced', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['description'] = __( 'Advanced <code>meta</code> robots settings for this page.', 'wordpress-seo' );
		/* translators: %s expands to the advanced robots settings default as set in the site-wide settings.*/
		self::$meta_fields['advanced']['meta-robots-adv']['options']['-']            = __( 'Site-wide default: %s', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['none']         = __( 'None', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noimageindex'] = __( 'No Image Index', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['noarchive']    = __( 'No Archive', 'wordpress-seo' );
		self::$meta_fields['advanced']['meta-robots-adv']['options']['nosnippet']    = __( 'No Snippet', 'wordpress-seo' );

		self::$meta_fields['advanced']['bctitle']['title']       = __( 'Breadcrumbs Title', 'wordpress-seo' );
		self::$meta_fields['advanced']['bctitle']['description'] = __( 'Title to use for this page in breadcrumb paths', 'wordpress-seo' );

		self::$meta_fields['advanced']['canonical']['title'] = __( 'Canonical URL', 'wordpress-seo' );
		/* translators: 1: link open tag; 2: link close tag. */
		self::$meta_fields['advanced']['canonical']['description'] = sprintf( __( 'The canonical URL that this page should point to, leave empty to default to permalink. %1$sCross domain canonical%2$s supported too.', 'wordpress-seo' ), '<a target="_blank" href="http://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html">', '</a>' );

		self::$meta_fields['advanced']['redirect']['title']       = __( '301 Redirect', 'wordpress-seo' );
		self::$meta_fields['advanced']['redirect']['description'] = __( 'The URL that this page should redirect to.', 'wordpress-seo' );

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
	 * Sets up all the functionality related to the prominence of the page analysis functionality.
	 */
	public function setup_page_analysis() {
		if ( apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
			add_action( 'post_submitbox_start', array( $this, 'publish_box' ) );
		}
	}

	/**
	 * Outputs the page analysis score in the Publish Box.
	 */
	public function publish_box() {
		if ( $this->display_metabox() === false ) {
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
	}

	/**
	 * Adds the Yoast SEO meta box to the edit boxes in the edit post, page,
	 * attachment, and custom post types pages.
	 *
	 * @return void
	 */
	public function add_meta_box() {
		$post_types = WPSEO_Post_Type::get_accessible_post_types();

		if ( ! is_array( $post_types ) || $post_types === array() ) {
			return;
		}

		foreach ( $post_types as $post_type ) {
			if ( $this->display_metabox( $post_type ) === false ) {
				continue;
			}

			$product_title = 'Yoast SEO';

			if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
				$product_title .= ' Premium';
			}

			if ( get_current_screen() !== null ) {
				$screen_id = get_current_screen()->id;
				add_filter( "postbox_classes_{$screen_id}_wpseo_meta", array( $this, 'wpseo_metabox_class' ) );
			}

			add_meta_box( 'wpseo_meta', $product_title, array(
				$this,
				'meta_box',
			), $post_type, 'normal', apply_filters( 'wpseo_metabox_prio', 'high' ) );
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
	 * Pass variables to js for use with the post-scraper.
	 *
	 * @return array
	 */
	public function localize_post_scraper_script() {
		$post      = $this->get_metabox_post();
		$permalink = '';

		if ( is_object( $post ) ) {
			$permalink = get_sample_permalink( $post->ID );
			$permalink = $permalink[0];
		}

		$post_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter( $post, array(), $permalink )
		);

		return $post_formatter->get_values();
	}

	/**
	 * Pass some variables to js for replacing variables.
	 */
	public function localize_replace_vars_script() {
		return array(
			'no_parent_text' => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'   => $this->get_replace_vars(),
			'scope'          => $this->determine_scope(),
		);
	}

	/**
	 * Determines the scope based on the post type.
	 * This can be used by the replacevar plugin to determine if a replacement needs to be executed.
	 *
	 * @return string String decribing the current scope.
	 */
	private function determine_scope() {
		$post_type = get_post_type( $this->get_metabox_post() );

		if ( $post_type === 'page' ) {
			return 'page';
		}

		return 'post';
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
	 * Output a tab in the Yoast SEO Metabox.
	 *
	 * @param string $id      CSS ID of the tab.
	 * @param string $heading Heading for the tab.
	 * @param string $content Content of the tab. This content should be escaped.
	 */
	public function do_tab( $id, $heading, $content ) {
		?>
		<div id="<?php echo esc_attr( 'wpseo_' . $id ); ?>" class="wpseotab <?php echo esc_attr( $id ); ?>">
			<?php echo $content; ?>
		</div>
	<?php
	}

	/**
	 * Output the meta box.
	 */
	public function meta_box() {
		$content_sections = $this->get_content_sections();

		$helpcenter_tab = new WPSEO_Option_Tab( 'metabox', __( 'Meta box', 'wordpress-seo' ),
			array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/metabox-screencast' ) ) );

		$help_center = new WPSEO_Help_Center( '', $helpcenter_tab, WPSEO_Utils::is_yoast_seo_premium() );
		$help_center->localize_data();
		$help_center->mount();

		if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) {
			echo $this->get_buy_premium_link();
		}

		echo '<div class="wpseo-metabox-content">';
		echo '<div class="wpseo-metabox-sidebar"><ul>';

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
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_content_sections() {
		$content_sections = array( $this->get_content_meta_section() );

		// Check if social_admin is an instance of WPSEO_Social_Admin.
		if ( $this->social_admin instanceof WPSEO_Social_Admin ) {
			$content_sections[] = $this->social_admin->get_meta_section();
		}

		if ( WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) || WPSEO_Options::get( 'disableadvanced_meta' ) === false ) {
			$content_sections[] = $this->get_advanced_meta_section();
		}

		if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) {
			$content_sections[] = $this->get_buy_premium_section();
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
			'',
			array(
				'tab_class' => 'yoast-seo__remove-tab',
			)
		);

		$tabs[] = new WPSEO_Metabox_Add_Keyword_Tab();

		return new WPSEO_Metabox_Tab_Section(
			'content',
			'<span class="screen-reader-text">' . __( 'Content optimization', 'wordpress-seo' ) . '</span><span class="yst-traffic-light-container">' . $this->traffic_light_svg() . '</span>',
			$tabs,
			array(
				'link_aria_label' => __( 'Content optimization', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
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
				'single' => true,
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'advanced',
			'<span class="screen-reader-text">' . __( 'Advanced', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-admin-generic"></span>',
			array( $tab ),
			array(
				'link_aria_label' => __( 'Advanced', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
		);
	}

	/**
	 * Returns a link to activate the Buy Premium tab.
	 *
	 * @return string
	 */
	private function get_buy_premium_link() {
		return sprintf( "<div class='%s'><a href='#wpseo-meta-section-premium' class='wpseo-meta-section-link'><span class='dashicons dashicons-star-filled wpseo-buy-premium'></span>%s</a></div>",
			'wpseo-metabox-buy-premium',
			__( 'Go Premium', 'wordpress-seo' )
		);
	}

	/**
	 * Returns the metabox section for the Premium section.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_buy_premium_section() {
		$content = sprintf( "<div class='wpseo-premium-description'>
			%s
			<ul class='wpseo-premium-advantages-list'>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
			</ul>

			<a target='_blank' id='wpseo-buy-premium-popup-button' class='button button-buy-premium wpseo-metabox-go-to' href='%s'>
				%s
			</a>

			<p><a target='_blank' class='wpseo-metabox-go-to' href='%s'>%s</a></p>
		</div>",
			/* translators: %1$s expands to Yoast SEO Premium. */
			sprintf( __( 'You\'re not getting the benefits of %1$s yet. If you had %1$s, you could use its awesome features:', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			__( 'Redirect manager', 'wordpress-seo' ),
			__( 'Create and manage redirects within your WordPress install.', 'wordpress-seo' ),
			__( 'Multiple focus keywords', 'wordpress-seo' ),
			__( 'Optimize a single post for up to 5 keywords.', 'wordpress-seo' ),
			__( 'Social Previews', 'wordpress-seo' ),
			__( 'Check what your Facebook or Twitter post will look like.', 'wordpress-seo' ),
			__( 'Premium support', 'wordpress-seo' ),
			__( 'Gain access to our 24/7 support team.', 'wordpress-seo' ),
			WPSEO_Shortlinker::get( 'https://yoa.st/pe-buy-premium' ),
			/* translators: %s expands to Yoast SEO Premium. */
			sprintf( __( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
			__( 'More info', 'wordpress-seo' )
		);

		$tab = new WPSEO_Metabox_Form_Tab(
			'premium',
			$content,
			'Yoast SEO Premium',
			array(
				'single' => true,
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'premium',
			'<span class="dashicons dashicons-star-filled wpseo-buy-premium"></span>',
			array( $tab ),
			array(
				'link_aria_label' => 'Yoast SEO Premium',
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
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
			'<span class="screen-reader-text">' . __( 'Add-ons', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-admin-plugins"></span>',
			array(),
			array(
				'link_aria_label' => __( 'Add-ons', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
		);
	}

	/**
	 * Gets the contents for the metabox tab.
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
	 * Adds a line in the meta box.
	 *
	 * @todo [JRF] Check if $class is added appropriately everywhere.
	 *
	 * @param   array  $meta_field_def Contains the vars based on which output is generated.
	 * @param   string $key            Internal key (without prefix).
	 *
	 * @return  string
	 */
	public function do_meta_box( $meta_field_def, $key = '' ) {
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

		$aria_describedby = '';
		$description      = '';
		if ( isset( $meta_field_def['description'] ) ) {
			$aria_describedby = ' aria-describedby="' . $esc_form_key . '-desc"';
			$description      = '<p id="' . $esc_form_key . '-desc" class="yoast-metabox__description">' . $meta_field_def['description'] . '</p>';
		}

		switch ( $meta_field_def['type'] ) {
			case 'pageanalysis':
				if ( WPSEO_Options::get( 'content_analysis_active' ) === false && WPSEO_Options::get( 'keyword_analysis_active' ) === false ) {
					break;
				}

				$content .= '<div id="pageanalysis">';
				$content .= '<section class="yoast-section" id="wpseo-pageanalysis-section">';
				$content .= '<h3 class="yoast-section__heading yoast-section__heading-icon yoast-section__heading-icon-list">' . __( 'Analysis', 'wordpress-seo' ) . '</h3>';
				$content .= '<div id="wpseo-pageanalysis"></div>';
				$content .= '<div id="yoast-seo-content-analysis"></div>';
				$content .= '</section>';
				$content .= '</div>';
				break;
			case 'snippetpreview':
				$content .= '<div id="wpseosnippet" class="wpseosnippet"></div>';
				break;
			case 'focuskeyword':
				if ( $placeholder !== '' ) {
					$placeholder = ' placeholder="' . esc_attr( $placeholder ) . '"';
				}

				$content .= '<div id="wpseofocuskeyword">';
				$content .= '<section class="yoast-section" id="wpseo-focuskeyword-section">';
				$content .= '<h3 class="yoast-section__heading yoast-section__heading-icon yoast-section__heading-icon-key">' . esc_html( $meta_field_def['title'] ) . '</h3>';
				$content .= '<label for="' . $esc_form_key . '" class="screen-reader-text">' . esc_html( $meta_field_def['label'] ) . '</label>';
				$content .= '<input type="text"' . $placeholder . ' id="' . $esc_form_key . '" autocomplete="off" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '" class="large-text' . $class . '"/>';

				if ( WPSEO_Options::get( 'enable_cornerstone_content', false ) ) {
					$cornerstone_field = new WPSEO_Cornerstone_Field();

					$content .= $cornerstone_field->get_html( $this->get_metabox_post() );
				}
				$content .= '</section>';
				$content .= '</div>';
				break;
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

			case 'textarea':
				$rows = 3;
				if ( isset( $meta_field_def['rows'] ) && $meta_field_def['rows'] > 0 ) {
					$rows = $meta_field_def['rows'];
				}
				$content .= '<textarea class="large-text' . $class . '" rows="' . esc_attr( $rows ) . '" id="' . $esc_form_key . '" name="' . $esc_form_key . '"' . $aria_describedby . '>' . esc_textarea( $meta_value ) . '</textarea>';
				break;

			case 'hidden':
				$content .= '<input type="hidden" id="' . $esc_form_key . '" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '"/>' . "\n";
				break;
			case 'select':
				if ( isset( $meta_field_def['options'] ) && is_array( $meta_field_def['options'] ) && $meta_field_def['options'] !== array() ) {
					$content .= '<select name="' . $esc_form_key . '" id="' . $esc_form_key . '" class="yoast' . $class . '">';
					foreach ( $meta_field_def['options'] as $val => $option ) {
						$selected = selected( $meta_value, $val, false );
						$content  .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
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

					// This select now uses Select2.
					$content .= '<select multiple="multiple" size="' . esc_attr( $options_count ) . '" name="' . $esc_form_key . '[]" id="' . $esc_form_key . '" class="yoast' . $class . '"' . $aria_describedby . '>';
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
				$content .= '<input type="checkbox" id="' . $esc_form_key . '" name="' . $esc_form_key . '" ' . $checked . ' value="on" class="yoast' . $class . '"' . $aria_describedby . '/> <label for="' . $esc_form_key . '">' . $expl . '</label>';
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
				$content .= '<input id="' . $esc_form_key . '" type="text" size="36" class="' . $class . '" name="' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '"' . $aria_describedby . ' />';
				$content .= '<input id="' . $esc_form_key . '_button" class="wpseo_image_upload_button button" type="button" value="' . esc_attr__( 'Upload Image', 'wordpress-seo' ) . '" />';
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
			if ( 'radio' === $meta_field_def['type'] ) {
				return '<fieldset><legend>' . $title . '</legend>' . $help_button . $help_panel . $content . $description . '</fieldset>';
			}

			// If it's a single checkbox, ignore the title.
			if ( 'checkbox' === $meta_field_def['type'] ) {
				$label = '';
			}

			// Special meta box sections such as the Snippet Preview, the Analysis, etc.
			if ( in_array( $meta_field_def['type'], array(
				'snippetpreview',
				'pageanalysis',
				'focuskeyword',
			), true )
			) {
				return $this->create_content_box( $content, $meta_field_def['type'], $help_button, $help_panel );
			}

			// Other meta box content or form fields.
			if ( $meta_field_def['type'] === 'hidden' ) {
				$html = $content;
			}
			else {
				$html = $label . $help_button . $help_panel . $content . $description;
			}
		}

		return $html;
	}

	/**
	 * Creates a sections specific row.
	 *
	 * @param string $content          The content to show.
	 * @param string $hidden_help_name Escaped form key name.
	 * @param string $help_button      The help button.
	 * @param string $help_panel       The help text.
	 *
	 * @return string
	 */
	private function create_content_box( $content, $hidden_help_name, $help_button, $help_panel ) {
		$html = $content;
		$html .= '<div class="wpseo_hidden" id="help-yoast-' . $hidden_help_name . '">' . $help_button . $help_panel . '</div>';

		return $html;
	}

	/**
	 * Save the WP SEO metadata for posts.
	 *
	 * {@internal $_POST parameters are validated via sanitize_post_meta().}}
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return  bool|void   Boolean false if invalid save post request.
	 */
	public function save_postdata( $post_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return false;
		}

		if ( $post_id === null ) {
			return false;
		}

		if ( wp_is_post_revision( $post_id ) ) {
			$post_id = wp_is_post_revision( $post_id );
		}

		/**
		 * Determine we're not accidentally updating a different post.
		 * We can't use filter_input here as the ID isn't available at this point, other than in the $_POST data.
		 */
		// @codingStandardsIgnoreStart
		if ( ! isset( $_POST['ID'] ) || $post_id !== (int) $_POST['ID'] ) {
			return false;
		}
		// @codingStandardsIgnoreEnd

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

			// If analysis is disabled remove that analysis score value from the DB.
			if ( $this->is_meta_value_disabled( $key ) ) {
				self::delete( $key, $post_id );
				continue;
			}

			$data = null;
			if ( 'checkbox' === $meta_box['type'] ) {
				// @codingStandardsIgnoreLine
				$data = isset( $_POST[ self::$form_prefix . $key ] ) ? 'on' : 'off';
			}
			else {
				// @codingStandardsIgnoreLine
				if ( isset( $_POST[ self::$form_prefix . $key ] ) ) {
					// @codingStandardsIgnoreLine
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
	 * Determines if the given meta value key is disabled.
	 *
	 * @param string $key The key of the meta value.
	 *
	 * @return bool Whether the given meta value key is disabled.
	 */
	public function is_meta_value_disabled( $key ) {
		if ( 'linkdex' === $key && ! $this->analysis_seo->is_enabled() ) {
			return true;
		}

		if ( 'content_score' === $key && ! $this->analysis_readability->is_enabled() ) {
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

		/* Filter 'wpseo_always_register_metaboxes_on_admin' documented in wpseo-main.php */
		if ( ( $is_editor === false && apply_filters( 'wpseo_always_register_metaboxes_on_admin', false ) === false ) || $this->display_metabox() === false ) {
			return;
		}

		if ( self::is_post_overview( $pagenow ) ) {
			$asset_manager->enqueue_style( 'edit-page' );
			$asset_manager->enqueue_script( 'edit-page-script' );
		}
		else {

			if ( get_queried_object_id() !== 0 ) {
				wp_enqueue_media( array( 'post' => get_queried_object_id() ) ); // Enqueue files needed for upload functionality.
			}

			$asset_manager->enqueue_style( 'metabox-css' );
			$asset_manager->enqueue_style( 'scoring' );
			$asset_manager->enqueue_style( 'snippet' );
			$asset_manager->enqueue_style( 'select2' );

			$asset_manager->enqueue_script( 'metabox' );
			$asset_manager->enqueue_script( 'help-center' );
			$asset_manager->enqueue_script( 'admin-media' );

			$asset_manager->enqueue_script( 'post-scraper' );
			$asset_manager->enqueue_script( 'replacevar-plugin' );
			$asset_manager->enqueue_script( 'shortcode-plugin' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-media', 'wpseoMediaL10n', $this->localize_media_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'post-scraper', 'wpseoPostScraperL10n', $this->localize_post_scraper_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'replacevar-plugin', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'shortcode-plugin', 'wpseoShortcodePluginL10n', $this->localize_shortcode_plugin_script() );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoAdminL10n', WPSEO_Help_Center::get_translated_texts() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoSelect2Locale', WPSEO_Utils::get_language( WPSEO_Utils::get_user_locale() ) );

			if ( post_type_supports( get_post_type(), 'thumbnail' ) ) {
				$asset_manager->enqueue_style( 'featured-image' );

				$asset_manager->enqueue_script( 'featured-image' );

				$featured_image_l10 = array( 'featured_image_notice' => __( 'SEO issue: The featured image should be at least 200 by 200 pixels to be picked up by Facebook and other social media sites.', 'wordpress-seo' ) );
				wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoFeaturedImageL10n', $featured_image_l10 );
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

		return array();
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

		// Merge custom replace variables with the WordPress ones.
		return array_merge( $cached_replacement_vars, $this->get_custom_replace_vars( $post ) );
	}

	/**
	 * Gets the custom replace variables for custom taxonomies and fields.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_replace_vars( $post ) {
		return array(
			'custom_fields'     => $this->get_custom_fields_replace_vars( $post ),
			'custom_taxonomies' => $this->get_custom_taxonomies_replace_vars( $post ),
		);
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
		$custom_replace_vars = array();

		foreach ( $taxonomies as $taxonomy_name => $taxonomy ) {

			if ( is_string( $taxonomy ) ) { // If attachment, see https://core.trac.wordpress.org/ticket/37368 .
				$taxonomy_name = $taxonomy;
				$taxonomy      = get_taxonomy( $taxonomy_name );
			}

			if ( $taxonomy->_builtin && $taxonomy->public ) {
				continue;
			}

			$custom_replace_vars[ $taxonomy_name ] = array(
				'name'        => $taxonomy->name,
				'description' => $taxonomy->description,
			);
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
		$custom_replace_vars = array();

		// If no post object is passed, return the empty custom_replace_vars array.
		if ( ! is_object( $post ) ) {
			return $custom_replace_vars;
		}

		$custom_fields = get_post_custom( $post->ID );

		foreach ( $custom_fields as $custom_field_name => $custom_field ) {
			if ( substr( $custom_field_name, 0, 1 ) === '_' ) {
				continue;
			}

			$custom_replace_vars[ $custom_field_name ] = $custom_field[0];
		}

		return $custom_replace_vars;
	}


	/**
	 * Return the SVG for the traffic light in the metabox.
	 */
	public function traffic_light_svg() {
		return <<<SVG
<svg class="yst-traffic-light init" version="1.1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
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
				<ellipse fill="#DC3232" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
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
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-init">
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
	 * Generic tab.
	 */
	public function template_generic_tab() {
		// This template belongs to the post scraper so don't echo it if it isn't enqueued.
		if ( ! wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'post-scraper' ) ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-generic_tab">
				<li class="<# if ( data.classes ) { #>{{data.classes}}<# } #><# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_generic" data-score="{{data.score}}">
						<span class="wpseo-score-icon {{data.score}}"></span>
						<span class="wpseo-tab-prefix">{{data.prefix}}</span>
						<span class="wpseo-tab-label">{{data.label}}</span>
						<span class="screen-reader-text wpseo-generic-tab-textual-score">{{data.scoreText}}</span>
					</a>
					<# if ( data.hideable ) { #>
						<button type="button" class="remove-tab" aria-label="{{data.removeLabel}}"><span>x</span></button>
					<# } #>
				</li>
			</script>';
	}

	/**
	 * Keyword tab for enabling analysis of multiple keywords.
	 */
	public function template_keyword_tab() {
		// This template belongs to the post scraper so don't echo it if it isn't enqueued.
		if ( ! wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'post-scraper' ) ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-keyword_tab">
				<li class="<# if ( data.classes ) { #>{{data.classes}}<# } #><# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_content" data-keyword="{{data.keyword}}" data-score="{{data.score}}">
						<span class="wpseo-score-icon {{data.score}}"></span>
						<span class="wpseo-tab-prefix">{{data.prefix}}</span>
						<em class="wpseo-keyword">{{data.label}}</em>
						<span class="screen-reader-text wpseo-keyword-tab-textual-score">{{data.scoreText}}</span>
					</a>
					<# if ( data.hideable ) { #>
						<button type="button" class="remove-keyword" aria-label="{{data.removeLabel}}"><span>x</span></button>
					<# } #>
				</li>
			</script>';
	}

	/**
	 * @param string $page The page to check for the post overview page.
	 *
	 * @return bool Whether or not the given page is the post overview page.
	 */
	public static function is_post_overview( $page ) {
		return 'edit.php' === $page;
	}

	/**
	 * @param string $page The page to check for the post edit page.
	 *
	 * @return bool Whether or not the given page is the post edit page.
	 */
	public static function is_post_edit( $page ) {
		return 'post.php' === $page
			   || 'post-new.php' === $page;
	}
}
