<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Admin_Pages' ) ) {
	/**
	 * class WPSEO_Admin_Pages
	 *
	 * Class with functionality for the WP SEO admin pages.
	 */
	class WPSEO_Admin_Pages {

		/**
		 * @var string $currentoption The option in use for the current admin page.
		 */
		var $currentoption = 'wpseo';

		/**
		 * @var array $adminpages Array of admin pages that the plugin uses.
		 */
		var $adminpages = array(
			'wpseo_dashboard',
			'wpseo_rss',
			'wpseo_files',
			'wpseo_permalinks',
			'wpseo_internal-links',
			'wpseo_import',
			'wpseo_titles',
			'wpseo_xml',
			'wpseo_social',
			'wpseo_bulk-title-editor',
			'wpseo_bulk-description-editor',
		);

		/**
		 * Class constructor, which basically only hooks the init function on the init hook
		 */
		function __construct() {
			add_action( 'init', array( $this, 'init' ), 20 );
		}

		/**
		 * Make sure the needed scripts are loaded for admin pages
		 */
		function init() {
			if ( isset( $_GET['wpseo_reset_defaults'] ) && wp_verify_nonce( $_GET['nonce'], 'wpseo_reset_defaults' ) && current_user_can( 'manage_options' ) ) {
				WPSEO_Options::reset();
				wp_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
			}

			$this->adminpages = apply_filters( 'wpseo_admin_pages', $this->adminpages );

			if ( WPSEO_Options::grant_access() ) {
				add_action( 'admin_enqueue_scripts', array( $this, 'config_page_scripts' ) );
				add_action( 'admin_enqueue_scripts', array( $this, 'config_page_styles' ) );
			}
		}

		/**
		 * Generates the sidebar for admin pages.
		 */
		function admin_sidebar() {

			// Make the sidebar filterable
			if ( false === apply_filters( 'wpseo_sidebar_banners', true ) ) {
				return;
			}

			$banners = array(
				array(
					'url' => 'https://yoast.com/hire-us/website-review/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=website-review-banner',
					'img' => 'banner-website-review.png',
					'alt' => 'Website Review banner',
				),
				array(
					'url' => 'https://yoast.com/wordpress/seo-premium/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=premium-seo-banner',
					'img' => 'banner-premium-seo.png',
					'alt' => 'Banner WordPress SEO Premium',
				),
			);

			if ( ! class_exists( 'wpseo_Video_Sitemap' ) ) {
				$banners[] = array(
					'url' => 'https://yoast.com/wordpress/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=video-seo-banner',
					'img' => 'banner-video-seo.png',
					'alt' => 'Banner WordPress SEO Video SEO extension',
				);
			}

			if ( ! class_exists( 'wpseo_Video_Manual' ) ) {
				$banners[] = array(
					'url' => 'https://yoast.com/wordpress/video-manual-wordpress-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=video-manual-banner',
					'img' => 'banner-video-seo-manual.png',
					'alt' => 'Banner WordPress SEO Video manual',
				);
			}

			if ( class_exists( 'Woocommerce' ) ) {
				$banners[] = array(
					'url' => 'https://yoast.com/wordpress/yoast-woocommerce-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=woocommerce-seo-banner',
					'img' => 'banner-woocommerce-seo.png',
					'alt' => 'Banner WooCommerce SEO plugin',
				);
			}

			if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
				$banners[] = array(
					'url' => 'https://yoast.com/wordpress/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=local-seo-banner',
					'img' => 'banner-local-seo.png',
					'alt' => 'Banner Local SEO plugin',
				);
			}
			shuffle( $banners );
			?>
			<div class="postbox-container" style="width:261px;">
				<div id="sidebar">
			<?php
			$i = 0;
			foreach ( $banners as $banner ) {
				if ( $i == 2 )
					break;
				echo '<a target="_blank" href="' . esc_url( $banner['url'] ) . '"><img src="' . plugins_url( 'images/' . $banner['img'], WPSEO_FILE ) . '" alt="' . esc_attr( $banner['alt'] ) . '"/></a><br/><br/>';
				$i++;
			}
			?>
					<br/><br/><br/>
				</div>
			</div>
		<?php
		}

		/**
		 * Generates the header for admin pages
		 *
		 * @param bool   $form           Whether or not the form start tag should be included.
		 * @param string $option         The long name of the option to use for the current page.
		 * @param string $optionshort    The short name of the option to use for the current page.
		 * @param bool   $contains_files Whether the form should allow for file uploads.
		 */
		function admin_header( $form = true, $option = 'yoast_wpseo_options', $optionshort = 'wpseo', $contains_files = false ) {
			?>
			<div class="wrap wpseo-admin-page page-<?php echo $optionshort; ?>">
			<?php
			/**
			 * Display the updated/error messages
			 * Only needed as our settings page is not under options, otherwise it will automatically be included
			 * @see settings_errors()
			 */
			require_once( ABSPATH . 'wp-admin/options-head.php' );
			?>
			<h2 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h2>
			<div id="wpseo_content_top" class="postbox-container">
			<div class="metabox-holder">
			<div class="meta-box-sortables">
			<?php
			if ( $form === true ) {
				echo '<form action="' . esc_url( admin_url( 'options.php' ) ) . '" method="post" id="wpseo-conf"' . ( $contains_files ? ' enctype="multipart/form-data"' : '' ) . ' accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
				settings_fields( $option );
				$this->currentoption = $optionshort;
			}

		}

		/**
		 * Generates the footer for admin pages
		 *
		 * @param bool $submit       Whether or not a submit button and form end tag should be shown.
		 * @param bool $show_sidebar Whether or not to show the banner sidebar - used by premium plugins to disable it
		 */
		function admin_footer( $submit = true, $show_sidebar = true ) {
			if ( $submit ) {
				submit_button();

				echo '
			</form>';
			}

			echo '
			</div><!-- end of div meta-box-sortables -->
			</div><!-- end of div metabox-holder -->
			</div><!-- end of div wpseo_content_top -->';

			if ( $show_sidebar ) {
				$this->admin_sidebar();
			}


			/* Add the current settings array to the page for debugging purposes,
				but not for a limited set of pages were it wouldn't make sense */
			$excluded = array(
				'wpseo_import',
				'wpseo_files',
				'bulk_title_editor_page',
				'bulk_description_editor_page',
			);

			if ( ( WP_DEBUG === true || ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true ) ) && isset( $_GET['page'] ) && ! in_array( $_GET['page'], $excluded, true ) ) {
				$xdebug = ( extension_loaded( 'xdebug' ) ? true : false );
				echo '
			<div id="poststuff">
			<div id="wpseo-debug-info" class="postbox">

				<h3 class="hndle"><span>' . __( 'Debug Information', 'wordpress-seo' ) . '</span></h3>
				<div class="inside">
					<h4>' . esc_html( __( 'Current option:', 'wordpress-seo' ) ) . ' <span class="wpseo-debug">' . esc_html( $this->currentoption ) . '</span></h4>
					' . ( $xdebug ? '' : '<pre>' );
				var_dump( get_option( $this->currentoption ) );
				echo '
					' . ( $xdebug ? '' : '</pre>' ) . '
				</div>
			</div>
			</div>';
			}

			echo '
			</div><!-- end of wrap -->';
		}

		/**
		 * Deletes all post meta values with a given meta key from the database
		 *
		 * @param string $meta_key Key to delete all meta values for.
		 */
		function delete_meta( $meta_key ) {
			global $wpdb;
			$wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->postmeta WHERE meta_key = %s", $meta_key ) );
		}

		/**
		 * Exports the current site's WP SEO settings.
		 *
		 * @param bool $include_taxonomy Whether to include the taxonomy metadata the plugin creates.
		 * @return bool|string $return False when failed, the URL to the export file when succeeded.
		 */
		function export_settings( $include_taxonomy ) {
			$content = '; ' . __( 'This is a settings export file for the WordPress SEO plugin by Yoast.com', 'wordpress-seo' ) . " - http://yoast.com/wordpress/seo/ \r\n";

			$optarr = WPSEO_Options::get_option_names();

			foreach ( $optarr as $optgroup ) {
				$content .= "\n" . '[' . $optgroup . ']' . "\n";
				$options  = get_option( $optgroup );
				if ( ! is_array( $options ) ) {
					continue;
				}
				foreach ( $options as $key => $elem ) {
					if ( is_array( $elem ) ) {
						for ( $i = 0; $i < count( $elem ); $i++ ) {
							$content .= $key . '[] = "' . $elem[$i] . "\"\n";
						}
					}
					elseif ( is_string( $elem ) && $elem == '' ) {
						$content .= $key . " = \n";
					}
					elseif ( is_bool( $elem ) ) {
						$content .= $key . ' = "' . ( ( $elem === true ) ? 'on' : 'off' ) . "\"\n";
					}
					else {
						$content .= $key . ' = "' . $elem . "\"\n";
					}
				}
			}

			if ( $include_taxonomy ) {
				$content .= "\r\n\r\n[wpseo_taxonomy_meta]\r\n";
				$content .= 'wpseo_taxonomy_meta = "' . urlencode( json_encode( get_option( 'wpseo_taxonomy_meta' ) ) ) . '"';
			}

			$dir = wp_upload_dir();

			if ( ! $handle = fopen( $dir['path'] . '/settings.ini', 'w' ) )
				die();

			if ( ! fwrite( $handle, $content ) )
				die();

			fclose( $handle );

			chdir( $dir['path'] );
			$zip = new PclZip( './settings.zip' );
			if ( $zip->create( './settings.ini' ) == 0 )
				return false;

			return $dir['url'] . '/settings.zip';
		}

		/**
		 * Loads the required styles for the config page.
		 */
		function config_page_styles() {
			global $pagenow;
			if ( $pagenow === 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], $this->adminpages ) ) {
				wp_enqueue_style( 'dashboard' );
				wp_enqueue_style( 'thickbox' );
				wp_enqueue_style( 'global' );
				wp_enqueue_style( 'wp-admin' );
				wp_enqueue_style( 'yoast-admin-css', plugins_url( 'css/yst_plugin_tools' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );

				if ( is_rtl() )
					wp_enqueue_style( 'wpseo-rtl', plugins_url( 'css/wpseo-rtl' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			}

			if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], array( 'wpseo_bulk-title-editor', 'wpseo_bulk-description-editor' ) ) ) {
				wp_enqueue_style( 'yoast-admin-css', plugins_url( 'css/yst_plugin_tools' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			}
		}

		/**
		 * Loads the required scripts for the config page.
		 */
		function config_page_scripts() {
			global $pagenow;

			if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], $this->adminpages ) ) {
				wp_enqueue_script( 'wpseo-admin-script', plugins_url( 'js/wp-seo-admin' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
				wp_enqueue_script( 'postbox' );
				wp_enqueue_script( 'dashboard' );
				wp_enqueue_script( 'thickbox' );
			}

			if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], array( 'wpseo_bulk-title-editor', 'wpseo_bulk-description-editor' ) ) ) {
				wp_enqueue_script( 'wpseo-bulk-editor', plugins_url( 'js/wp-seo-bulk-editor' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
			}
		}

		/**
		 * Retrieve options based on whether we're on multisite or not.
		 *
		 * @since 1.2.4
		 *
		 * @param string $option The option to retrieve.
		 * @return array
		 */
		function get_option( $option ) {
			if ( function_exists( 'is_network_admin' ) && is_network_admin() ) {
				return get_site_option( $option );
			}
			else {
				return get_option( $option );
			}
		}

		/**
		 * Create a Checkbox input field.
		 *
		 * @param string $var        The variable within the option to create the checkbox for.
		 * @param string $label      The label to show for the variable.
		 * @param bool   $label_left Whether the label should be left (true) or right (false).
		 * @param string $option     The option the variable belongs to.
		 * @return string
		 */
		function checkbox( $var, $label, $label_left = false, $option = '' ) {
			if ( empty( $option ) )
				$option = $this->currentoption;

			$options = $this->get_option( $option );

			if ( ! isset( $options[$var] ) ) {
				$options[$var] = false;
			}

			if ( $options[$var] === true ) {
				$options[$var] = 'on';
			}

			if ( $label_left !== false ) {
				if ( ! empty( $label_left ) ) {
					$label_left .= ':';
				}
				$output_label = '<label class="checkbox" for="' . esc_attr( $var ) . '">' . $label_left . '</label>';
				$class        = 'checkbox';
			}
			else {
				$output_label = '<label for="' . esc_attr( $var ) . '">' . $label . '</label>';
				$class        = 'checkbox double';
			}

			$output_input = '<input class="' . esc_attr( $class ) . '" type="checkbox" id="' . esc_attr( $var ) . '" name="' . esc_attr( $option ) . '[' . esc_attr( $var ) . ']" value="on"' . checked( $options[$var], 'on', false ) . '/>';

			if ( $label_left !== false ) {
				$output = $output_label . $output_input . '<label class="checkbox" for="' . esc_attr( $var ) . '">' . $label . '</label>';
			}
			else {
				$output = $output_input . $output_label;
			}
			return $output . '<br class="clear" />';
		}

		/**
		 * Create a Text input field.
		 *
		 * @param string $var    The variable within the option to create the text input field for.
		 * @param string $label  The label to show for the variable.
		 * @param string $option The option the variable belongs to.
		 * @return string
		 */
		function textinput( $var, $label, $option = '' ) {
			if ( empty( $option ) )
				$option = $this->currentoption;

			$options = $this->get_option( $option );
			$val     = ( isset( $options[$var] ) ) ? $options[$var] : '';

			return '<label class="textinput" for="' . esc_attr( $var ) . '">' . $label . ':</label><input class="textinput" type="text" id="' . esc_attr( $var ) . '" name="' . esc_attr( $option ) . '[' . esc_attr( $var ) . ']" value="' . esc_attr( $val ) . '"/>' . '<br class="clear" />';
		}

		/**
		 * Create a textarea.
		 *
		 * @param string $var    The variable within the option to create the textarea for.
		 * @param string $label  The label to show for the variable.
		 * @param string $option The option the variable belongs to.
		 * @param string $class  The CSS class to assign to the textarea.
		 * @return string
		 */
		function textarea( $var, $label, $option = '', $class = '' ) {
			if ( empty( $option ) )
				$option = $this->currentoption;

			$options = $this->get_option( $option );
			$val     = ( isset( $options[$var] ) ) ? $options[$var] : '';

			return '<label class="textinput" for="' . esc_attr( $var ) . '">' . esc_html( $label ) . ':</label><textarea class="textinput ' . esc_attr( $class ) . '" id="' . esc_attr( $var ) . '" name="' . esc_attr( $option ) . '[' . esc_attr( $var ) . ']">' . esc_textarea( $val ) . '</textarea>' . '<br class="clear" />';
		}

		/**
		 * Create a hidden input field.
		 *
		 * @param string $var    The variable within the option to create the hidden input for.
		 * @param string $option The option the variable belongs to.
		 * @return string
		 */
		function hidden( $var, $option = '' ) {
			if ( empty( $option ) )
				$option = $this->currentoption;

			$options = $this->get_option( $option );

			$val = ( isset( $options[$var] ) ) ? $options[$var] : '';
			if ( is_bool( $val ) ) {
				$val = ( $val === true ) ? 'true' : 'false';
			}

			return '<input type="hidden" id="hidden_' . esc_attr( $var ) . '" name="' . esc_attr( $option ) . '[' . esc_attr( $var ) . ']" value="' . esc_attr( $val ) . '"/>';
		}

		/**
		 * Create a Select Box.
		 *
		 * @param string $var    The variable within the option to create the select for.
		 * @param string $label  The label to show for the variable.
		 * @param array  $values The select options to choose from.
		 * @param string $option The option the variable belongs to.
		 * @return string
		 */
		function select( $var, $label, $values, $option = '' ) {
			if ( ! is_array( $values ) || $values === array() ) {
				return '';
			}
			if ( empty( $option ) ) {
				$option = $this->currentoption;
			}

			$options = $this->get_option( $option );

			$output  = '<label class="select" for="' . esc_attr( $var ) . '">' . $label . ':</label>';
			$output .= '<select class="select" name="' . esc_attr( $option ) . '[' . esc_attr( $var ) . ']" id="' . esc_attr( $var ) . '">';

			foreach ( $values as $value => $label ) {
				if ( ! empty( $label ) )
					$output .= '<option value="' . esc_attr( $value ) . '"' . selected( $options[$var], $value, false ) . '>' . $label . '</option>';
			}
			$output .= '</select>';
			return $output . '<br class="clear"/>';
		}

		/**
		 * Create a File upload field.
		 *
		 * @param string $var    The variable within the option to create the file upload field for.
		 * @param string $label  The label to show for the variable.
		 * @param string $option The option the variable belongs to.
		 * @return string
		 */
		function file_upload( $var, $label, $option = '' ) {
			if ( empty( $option ) )
				$option = $this->currentoption;

			$options = $this->get_option( $option );

			$val = '';
			if ( isset( $options[$var] ) && is_array( $options[$var] ) ) {
				$val = $options[$var]['url'];
			}

			$var_esc = esc_attr( $var );
			$output  = '<label class="select" for="' . $var_esc . '">' . esc_html( $label ) . ':</label>';
			$output .= '<input type="file" value="' . esc_attr( $val ) . '" class="textinput" name="' . esc_attr( $option ) . '[' . $var_esc . ']" id="' . $var_esc . '"/>';

			// Need to save separate array items in hidden inputs, because empty file inputs type will be deleted by settings API.
			if ( ! empty( $options[$var] ) ) {
				$output .= '<input class="hidden" type="hidden" id="' . $var_esc . '_file" name="wpseo_local[' . $var_esc . '][file]" value="' . esc_attr( $options[$var]['file'] ) . '"/>';
				$output .= '<input class="hidden" type="hidden" id="' . $var_esc . '_url" name="wpseo_local[' . $var_esc . '][url]" value="' . esc_attr( $options[$var]['url'] ) . '"/>';
				$output .= '<input class="hidden" type="hidden" id="' . $var_esc . '_type" name="wpseo_local[' . $var_esc . '][type]" value="' . esc_attr( $options[$var]['type'] ) . '"/>';
			}
			$output .= '<br class="clear"/>';

			return $output;
		}

		/**
		 * Create a Radio input field.
		 *
		 * @param string $var    The variable within the option to create the file upload field for.
		 * @param array  $values The radio options to choose from.
		 * @param string $label  The label to show for the variable.
		 * @param string $option The option the variable belongs to.
		 * @return string
		 */
		function radio( $var, $values, $label, $option = '' ) {
			if ( ! is_array( $values ) || $values === array() ) {
				return '';
			}
			if ( empty( $option ) ) {
				$option = $this->currentoption;
			}

			$options = $this->get_option( $option );

			if ( ! isset( $options[$var] ) ) {
				$options[$var] = false;
			}

			$var_esc = esc_attr( $var );

			$output = '<br/><label class="select">' . $label . ':</label>';
			foreach ( $values as $key => $value ) {
				$key_esc = esc_attr( $key );
				$output .= '<input type="radio" class="radio" id="' . $var_esc . '-' . $key_esc . '" name="' . esc_attr( $option ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $options[$var], $key_esc, false ) . ' /> <label class="radio" for="' . $var_esc . '-' . $key_esc . '">' . esc_html( $value ) . '</label>';
			}
			$output .= '<br/>';

			return $output;
		}

		/**
		 * Create a postbox widget.
		 *
		 * @param string $id      ID of the postbox.
		 * @param string $title   Title of the postbox.
		 * @param string $content Content of the postbox.
		 */
		function postbox( $id, $title, $content ) {
			?>
			<div id="<?php echo esc_attr( $id ); ?>" class="yoastbox">
				<h2><?php echo $title; ?></h2>
				<?php echo $content; ?>
			</div>
		<?php
		}


		/**
		 * Create a form table from an array of rows.
		 *
		 * @param array $rows Rows to include in the table.
		 * @return string
		 */
		function form_table( $rows ) {
			if ( ! is_array( $rows ) || $rows === array() ) {
				return '';
			}

			$content = '<table class="form-table">';
			foreach ( $rows as $row ) {
				$content .= '<tr><th scope="row">';
				if ( isset( $row['id'] ) && $row['id'] != '' ) {
					$content .= '<label for="' . esc_attr( $row['id'] ) . '">' . esc_html( $row['label'] ) . ':</label>';
				}
				else {
					$content .= esc_html( $row['label'] );
				}
				if ( isset( $row['desc'] ) && $row['desc'] != '' ) {
					$content .= '<br/><small>' . esc_html( $row['desc'] ) . '</small>';
				}
				$content .= '</th><td>';
				$content .= $row['content'];
				$content .= '</td></tr>';
			}
			$content .= '</table>';
			return $content;
		}



		/********************** DEPRECATED METHODS **********************/

		/**
		 * Resets the site to the default WordPress SEO settings and runs a title test to check
		 * whether force rewrite needs to be on.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Options::reset()
		 * @see WPSEO_Options::reset()
		 */
		function reset_defaults() {
			_deprecated_function( __CLASS__ . '::' . __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Options::reset()' );
			WPSEO_Options::reset();
		}


	} /* End of class */

} /* End of class-exists wrapper */
