<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */
class WPSEO_Metabox extends WPSEO_Meta {

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
		self::$meta_fields['general']['pageanalysis']['help']  = sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results.<br/><br/>Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/snippet-preview/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=snippet-preview">', '</a>' );

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
					add_meta_box( 'wpseo_meta', 'Yoast SEO', array(
						$this,
						'meta_box',
					), $post_type, 'normal', apply_filters( 'wpseo_metabox_prio', 'high' ) );
				}
			}
		}
	}

	/**
	 * Pass some variables to js for the edit / post page overview, snippet preview, etc.
	 *
	 * @return  array
	 */
	public function localize_script() {
		$post = $this->get_metabox_post();

		if ( ( ! is_object( $post ) || ! isset( $post->post_type ) ) || $this->is_metabox_hidden( $post->post_type ) === true ) {
			return array();
		}

		$options = get_option( 'wpseo_titles' );

		$date = '';
		if ( isset( $options[ 'showdate-' . $post->post_type ] ) && $options[ 'showdate-' . $post->post_type ] === true ) {
			$date = $this->get_post_date( $post );

			self::$meta_length        = ( self::$meta_length - ( strlen( $date ) + 5 ) );
			self::$meta_length_reason = __( ' (because of date display)', 'wordpress-seo' );
		}

		self::$meta_length_reason = apply_filters( 'wpseo_metadesc_length_reason', self::$meta_length_reason, $post );
		self::$meta_length        = apply_filters( 'wpseo_metadesc_length', self::$meta_length, $post );

		unset( $date );

		$title_template = '';
		if ( isset( $options[ 'title-' . $post->post_type ] ) && $options[ 'title-' . $post->post_type ] !== '' ) {
			$title_template = $options[ 'title-' . $post->post_type ];
		}

		// If there's no title template set, use the default, otherwise title preview won't work.
		if ( $title_template == '' ) {
			$title_template = '%%title%% - %%sitename%%';
		}

		$metadesc_template = '';
		if ( isset( $options[ 'metadesc-' . $post->post_type ] ) && $options[ 'metadesc-' . $post->post_type ] !== '' ) {
			$metadesc_template = $options[ 'metadesc-' . $post->post_type ];
		}

		$sample_permalink = get_sample_permalink( $post->ID );
		$sample_permalink = str_replace( '%page', '%post', $sample_permalink[0] );

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

		return array_merge( $cached_replacement_vars, array(
			'field_prefix'                => self::$form_prefix,
			'keyword_header'              => '<strong>' . __( 'Focus keyword usage', 'wordpress-seo' ) . '</strong><br>' . __( 'Your focus keyword was found in:', 'wordpress-seo' ),
			'article_header_text'         => __( 'Article Heading: ', 'wordpress-seo' ),
			'page_title_text'             => __( 'Page title: ', 'wordpress-seo' ),
			'page_url_text'               => __( 'Page URL: ', 'wordpress-seo' ),
			'content_text'                => __( 'Content: ', 'wordpress-seo' ),
			'meta_description_text'       => __( 'Meta description: ', 'wordpress-seo' ),
			'choose_image'                => __( 'Use Image', 'wordpress-seo' ),
			'wpseo_meta_desc_length'      => self::$meta_length,
			'wpseo_title_template'        => $title_template,
			'wpseo_metadesc_template'     => $metadesc_template,
			'wpseo_permalink_template'    => $sample_permalink,
			'wpseo_keyword_suggest_nonce' => wp_create_nonce( 'wpseo-get-suggest' ),
			'wpseo_replace_vars_nonce'    => wp_create_nonce( 'wpseo-replace-vars' ),
			'no_parent_text'              => __( '(no parent)', 'wordpress-seo' ),
			'featured_image_notice'       => __( 'The featured image should be at least 200x200 pixels to be picked up by Facebook and other social media sites.', 'wordpress-seo' ),
			'keyword_usage'               => $this->get_focus_keyword_usage( $post->ID ),
			'search_url'                  => admin_url( 'edit.php?seo_kw_filter={keyword}' ),
			'post_edit_url'               => admin_url( 'post.php?post={id}&action=edit' ),
		) );
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
		<div class="wpseotab <?php echo esc_attr( $id ) ?>">
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
		$post    = $this->get_metabox_post();
		$options = WPSEO_Options::get_all();

		?>
		<div class="wpseo-metabox-tabs-div">
		<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs">
			<li class="general">
				<a class="wpseo_tablink" href="#wpseo_general"><?php _e( 'Content', 'wordpress-seo' ); ?></a></li>

			<?php if ( current_user_can( 'manage_options' ) || $options['disableadvanced_meta'] === false ) : ?>
				<li class="advanced">
					<a class="wpseo_tablink" href="#wpseo_advanced"><?php _e( 'Advanced', 'wordpress-seo' ); ?></a>
				</li>
			<?php endif; ?>
			<?php do_action( 'wpseo_tab_header' ); ?>
		</ul>
		<?php
		$content = '';
		if ( is_object( $post ) && isset( $post->post_type ) ) {
			foreach ( $this->get_meta_field_defs( 'general', $post->post_type ) as $key => $meta_field ) {
				$content .= $this->do_meta_box( $meta_field, $key );
			}
			unset( $key, $meta_field );
		}
		$this->do_tab( 'general', __( 'General', 'wordpress-seo' ), $content );

		if ( current_user_can( 'manage_options' ) || $options['disableadvanced_meta'] === false ) {
			$content = '';
			foreach ( $this->get_meta_field_defs( 'advanced' ) as $key => $meta_field ) {
				$content .= $this->do_meta_box( $meta_field, $key );
			}
			unset( $key, $meta_field );
			$this->do_tab( 'advanced', __( 'Advanced', 'wordpress-seo' ), $content );
		}

		do_action( 'wpseo_tab_content' );

		echo '</div>';
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
				$content .= '<div id="wpseosnippet"></div>';
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
				$content .= '<input type="hidden"' . '" id="' . $esc_form_key . '" ' . $esc_form_key . '" value="' . esc_attr( $meta_value ) . '"/><br />';
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
	 * @param  int $post_id
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

		$color = get_user_meta( get_current_user_id(), 'admin_color', true );
		if ( '' == $color || in_array( $color, array( 'classic', 'fresh' ), true ) === false ) {
			$color = 'fresh';
		}

		if ( $pagenow == 'edit.php' ) {
			wp_enqueue_style( 'edit-page', plugins_url( 'css/edit-page' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		}
		else {
			if ( 0 != get_queried_object_id() ) {
				wp_enqueue_media( array( 'post' => get_queried_object_id() ) ); // Enqueue files needed for upload functionality.
			}
			wp_enqueue_style( 'metabox-tabs', plugins_url( 'css/metabox-tabs' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( "metabox-$color", plugins_url( 'css/metabox-' . esc_attr( $color ) . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'featured-image', plugins_url( 'css/featured-image' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_style( 'jquery-qtip.js', plugins_url( 'css/jquery.qtip' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), '2.2.1' );
			wp_enqueue_style( 'snippet', plugins_url( 'css/snippet' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), '2.2.1' );
			wp_enqueue_script( 'jquery-ui-autocomplete' );

			// Always enqueue minified as it's not our code.
			wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '2.2.1', true );

			wp_enqueue_script( 'wp-seo-metabox', plugins_url( 'js/wp-seo-metabox' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
				'jquery-ui-autocomplete',
			), WPSEO_VERSION, true );

//			wp_enqueue_script( 'wp-seo-wordpressScraper.js', plugins_url( 'js/wp-seo-wordpress-scraper' . '.js', WPSEO_FILE ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-snippetPreview.js', plugins_url( 'js-seo/js/snippetPreview.js' ), null, '2.2.1', true );

			wp_enqueue_script( 'js-seo-config.js', plugins_url( 'js-seo/js/config/config.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-scoring.js', plugins_url( 'js-seo/js/config/scoring.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-analyzer.js', plugins_url( 'js-seo/js/analyzer.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-analyzescorer.js', plugins_url( 'js-seo/js/analyzescorer.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-preprocessor.js', plugins_url( 'js-seo/js/preprocessor.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-preprocessor.js', plugins_url( 'js-seo/js/preprocessor.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-stringhelper.js', plugins_url( 'js-seo/js/stringhelper.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-scoreformatter.js', plugins_url( 'js-seo/js/scoreFormatter.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-YoastSEO.js', plugins_url( 'js-seo/js/YoastSEO.js' ), null, '2.2.1', true );
			wp_enqueue_script( 'js-seo-wp-config.js', plugins_url( 'js-seo/js/config/wp-config.js' ), null, '2.2.1', true );

			if ( post_type_supports( get_post_type(), 'thumbnail' ) ) {
				wp_enqueue_script( 'wp-seo-featured-image', plugins_url( 'js/wp-seo-featured-image' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
			}

			wp_enqueue_script( 'wpseo-admin-media', plugins_url( 'js/wp-seo-admin-media' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
			), WPSEO_VERSION, true );

			wp_localize_script( 'wpseo-admin-media', 'wpseoMediaL10n', $this->localize_media_script() );

			// Text strings to pass to metabox for keyword analysis.
			wp_localize_script( 'wp-seo-metabox', 'wpseoMetaboxL10n', $this->localize_script() );
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
	 **
	 * @return string
	 */
	public function get_post_date( $post ) {
		if ( isset( $post->post_date ) && $post->post_status == 'publish' ) {
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
	 * @returns WP_Post
	 */
	private function get_metabox_post() {
		if ( $post = filter_input( INPUT_GET, 'post' ) ) {
			$post_id = (int) WPSEO_Utils::validate_int( $post );

			return get_post( $post_id );
		}

		return $GLOBALS['post'];
	}

	/**
	 * Counting the number of given keyword used for other posts than given post_id
	 *
	 * @param integer $post_id
	 *
	 * @return int
	 */
	private function get_focus_keyword_usage( $post_id ) {
		$keyword = WPSEO_Meta::get_value( 'focuskw', $post_id );

		return array(
			$keyword => WPSEO_Meta::keyword_usage( $keyword, $post_id ),
		);
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
	 * @param  string $post_type
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

} /* End of class */
