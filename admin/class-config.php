<?php
/**
 * @package Admin
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

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
	var $adminpages = array( 'wpseo_dashboard', 'wpseo_rss', 'wpseo_files', 'wpseo_permalinks', 'wpseo_internal-links', 'wpseo_import', 'wpseo_titles', 'wpseo_xml', 'wpseo_social' );

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
			$this->reset_defaults();
			wp_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		}

		$this->adminpages = apply_filters( 'wpseo_admin_pages', $this->adminpages );

		global $wpseo_admin;

		if ( $wpseo_admin->grant_access() ) {
			add_action( 'admin_print_scripts', array( $this, 'config_page_scripts' ) );
			add_action( 'admin_print_styles', array( $this, 'config_page_styles' ) );
		}
	}

	/**
	 * Resets the site to the default WordPress SEO settings and runs a title test to check whether force rewrite needs to be on.
	 */
	function reset_defaults() {
		foreach ( get_wpseo_options_arr() as $opt ) {
			delete_option( $opt );
		}
		wpseo_defaults();

		//wpseo_title_test(); // is already run in wpseo_defaults
		//wpseo_description_test(); // is already run in wpseo_defaults
	}

	/**
	 * Generates the sidebar for admin pages.
	 */
	function admin_sidebar() {
		$banners = array(
			array(
				'url' => 'https://yoast.com/hire-us/website-review/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=website-review-banner',
				'img' => 'banner-website-review.png',
				'alt' => 'Website Review banner',
			)
		);
		if ( 'nl_NL' == get_locale() ) {
			$rand = rand( 1, 2 );
			switch ( $rand ) {
				case 1:
					$banners[] = array(
						'url' => 'http://yoast.nl/seo-trainingen/wordpress-seo-training//#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=wpseo-training-banner&utm_content=prijs',
						'img' => 'banner-wpseo-training.png',
						'alt' => 'WordPress SEO Training banner',
					);
					break;
				case 2:
					$banners[] = array(
						'url' => 'http://yoast.nl/seo-trainingen/wordpress-seo-training//#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=wpseo-training-banner&utm_content=klik-hier',
						'img' => 'banner-wpseo-training-2.png',
						'alt' => 'WordPress SEO Training banner',
					);
					break;
			}
		}
		if ( !class_exists( 'wpseo_Video_Sitemap' ) ) {
			$banners[] = array(
				'url' => 'http://yoast.com/wordpress/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=video-seo-banner',
				'img' => 'banner-video-seo.png',
				'alt' => 'Banner WordPress SEO Video SEO extension',
			);
		}
		if ( !class_exists( 'wpseo_Video_Manual' ) ) {
			$banners[] = array(
				'url' => 'http://yoast.com/wordpress/video-manual-wordpress-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=video-manual-banner',
				'img' => 'banner-video-seo-manual.png',
				'alt' => 'Banner WordPress SEO Video manual',
			);
		}
		if ( !defined( 'WPSEO_LOCAL_VERSION' ) ) {
			$banners[] = array(
				'url' => 'http://yoast.com/wordpress/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=local-seo-banner',
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
					if ( $i == 3 )
						break;
					if ( $i != 0 )
						echo '<hr style="border:none;border-top:dotted 1px #f48500;margin: 30px 0;">';
					echo '<a target="_blank" href="' . $banner['url'] . '"><img src="' . plugins_url( 'images/' . $banner['img'], dirname( __FILE__ ) ) . '" alt="' . $banner['alt'] . '"/></a>';
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
	 * @param string $title          The title to show in the main heading.
	 * @param bool   $form           Whether or not the form should be included.
	 * @param string $option         The long name of the option to use for the current page.
	 * @param string $optionshort    The short name of the option to use for the current page.
	 * @param bool   $contains_files Whether the form should allow for file uploads.
	 */
	function admin_header( $title, $form = true, $option = 'yoast_wpseo_options', $optionshort = 'wpseo', $contains_files = false ) {
		?>
		<div class="wrap">
		<?php
		if ( ( isset( $_GET['updated'] ) && $_GET['updated'] == 'true' ) || ( isset( $_GET['settings-updated'] ) && $_GET['settings-updated'] == 'true' ) ) {
			$msg = __( 'Settings updated', 'wordpress-seo' );

			echo '<div id="message" style="width:94%;" class="message updated"><p><strong>' . esc_html( $msg ) . '.</strong></p></div>';
		}
		?>
		<a href="http://yoast.com/">
			<div id="yoast-icon"
				 style="background: url('<?php echo plugins_url( 'images/wordpress-SEO-32x32.png', dirname( __FILE__ ) ); ?>') no-repeat;"
				 class="icon32">
				<br/>
			</div>
		</a>
		<h2 id="wpseo-title"><?php _e( "Yoast WordPress SEO: ", 'wordpress-seo' ); echo $title; ?></h2>
		<div id="wpseo_content_top" class="postbox-container" style="min-width:400px; max-width:600px; padding: 0 20px 0 0;">
		<div class="metabox-holder">
		<div class="meta-box-sortables">
		<?php
		if ( $form ) {
			echo '<form action="' . admin_url( 'options.php' ) . '" method="post" id="wpseo-conf"' . ( $contains_files ? ' enctype="multipart/form-data"' : '' ) . '>';
			settings_fields( $option );
			$this->currentoption = $optionshort;
		}

	}

	/**
	 * Generates the footer for admin pages
	 *
	 * @param bool $submit Whether or not a submit button should be shown.
	 */
	function admin_footer( $submit = true ) {
		if ( $submit ) {
			?>
			<div class="submit"><input type="submit" class="button-primary" name="submit"
									   value="<?php _e( "Save Settings", 'wordpress-seo' ); ?>"/></div>
		<?php } ?>
		</form>
		</div>
		</div>
		</div>
		<?php $this->admin_sidebar(); ?>
		</div>
	<?php
	}

	/**
	 * Deletes all post meta values with a given meta key from the database
	 *
	 * @param string $metakey Key to delete all meta values for.
	 */
	function delete_meta( $metakey ) {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->postmeta WHERE meta_key = %s", $metakey ) );
	}

	/**
	 * Exports the current site's WP SEO settings.
	 *
	 * @param bool $include_taxonomy Whether to include the taxonomy metadata the plugin creates.
	 * @return bool|string $return False when failed, the URL to the export file when succeeded.
	 */
	function export_settings( $include_taxonomy ) {
		$content = "; " . __( "This is a settings export file for the WordPress SEO plugin by Yoast.com", 'wordpress-seo' ) . " - http://yoast.com/wordpress/seo/ \r\n";

		$optarr = get_wpseo_options_arr();

		foreach ( $optarr as $optgroup ) {
			$content .= "\n" . '[' . $optgroup . ']' . "\n";
			$options = get_option( $optgroup );
			if ( !is_array( $options ) )
				continue;
			foreach ( $options as $key => $elem ) {
				if ( is_array( $elem ) ) {
					for ( $i = 0; $i < count( $elem ); $i++ ) {
						$content .= $key . "[] = \"" . $elem[$i] . "\"\n";
					}
				} else if ( $elem == "" )
					$content .= $key . " = \n";
				else
					$content .= $key . " = \"" . $elem . "\"\n";
			}
		}

		if ( $include_taxonomy ) {
			$content .= "\r\n\r\n[wpseo_taxonomy_meta]\r\n";
			$content .= "wpseo_taxonomy_meta = \"" . urlencode( json_encode( get_option( 'wpseo_taxonomy_meta' ) ) ) . "\"";
		}

		$dir = wp_upload_dir();

		if ( !$handle = fopen( $dir['path'] . '/settings.ini', 'w' ) )
			die();

		if ( !fwrite( $handle, $content ) )
			die();

		fclose( $handle );

		require_once ( ABSPATH . 'wp-admin/includes/class-pclzip.php' );

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
		if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], $this->adminpages ) ) {
			wp_enqueue_style( 'dashboard' );
			wp_enqueue_style( 'thickbox' );
			wp_enqueue_style( 'global' );
			wp_enqueue_style( 'wp-admin' );
			wp_enqueue_style( 'yoast-admin-css', plugins_url( 'css/yst_plugin_tools.css', dirname( __FILE__ ) ), array(), WPSEO_VERSION );

			if ( is_rtl() )
				wp_enqueue_style( 'wpseo-rtl', plugins_url( 'css/wpseo-rtl.css', dirname( __FILE__ ) ), array(), WPSEO_VERSION );
		}
	}

	/**
	 * Loads the required scripts for the config page.
	 */
	function config_page_scripts() {
		global $pagenow;
		
		if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], $this->adminpages ) ) {
			wp_enqueue_script( 'wpseo-admin-script', plugins_url( 'js/wp-seo-admin.js', dirname( __FILE__ ) ), array( 'jquery' ), WPSEO_VERSION, true );
			wp_enqueue_script( 'postbox' );
			wp_enqueue_script( 'dashboard' );
			wp_enqueue_script( 'thickbox' );
		}
	}

	/**
	 * Retrieve options based on the option or the class currentoption.
	 *
	 * @since 1.2.4
	 *
	 * @param string $option The option to retrieve.
	 * @return array
	 */
	function get_option( $option ) {
		if ( function_exists( 'is_network_admin' ) && is_network_admin() )
			return get_site_option( $option );
		else
			return get_option( $option );
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

		if ( !isset( $options[$var] ) )
			$options[$var] = false;

		if ( $options[$var] === true )
			$options[$var] = 'on';

		if ( $label_left !== false ) {
			if ( !empty( $label_left ) )
				$label_left .= ':';
			$output_label = '<label class="checkbox" for="' . esc_attr( $var ) . '">' . $label_left . '</label>';
			$class        = 'checkbox';
		} else {
			$output_label = '<label for="' . esc_attr( $var ) . '">' . $label . '</label>';
			$class        = 'checkbox double';
		}

		$output_input = "<input class='$class' type='checkbox' id='" . esc_attr( $var ) . "' name='" . esc_attr( $option ) . "[" . esc_attr( $var ) . "]' " . checked( $options[$var], 'on', false ) . '/>';

		if ( $label_left !== false ) {
			$output = $output_label . $output_input . '<label class="checkbox" for="' . esc_attr( $var ) . '">' . $label . '</label>';
		} else {
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

		$val = '';
		if ( isset( $options[$var] ) )
			$val = esc_attr( $options[$var] );

		return '<label class="textinput" for="' . esc_attr( $var ) . '">' . $label . ':</label><input class="textinput" type="text" id="' . esc_attr( $var ) . '" name="' . $option . '[' . esc_attr( $var ) . ']" value="' . $val . '"/>' . '<br class="clear" />';
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

		$val = '';
		if ( isset( $options[$var] ) )
			$val = esc_attr( $options[$var] );


		return '<label class="textinput" for="' . esc_attr( $var ) . '">' . esc_html( $label ) . ':</label><textarea class="textinput ' . $class . '" id="' . esc_attr( $var ) . '" name="' . $option . '[' . esc_attr( $var ) . ']">' . $val . '</textarea>' . '<br class="clear" />';
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

		$val = '';
		if ( isset( $options[$var] ) )
			$val = esc_attr( $options[$var] );

		return '<input type="hidden" id="hidden_' . esc_attr( $var ) . '" name="' . $option . '[' . esc_attr( $var ) . ']" value="' . $val . '"/>';
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
		if ( empty( $option ) )
			$option = $this->currentoption;

		$options = $this->get_option( $option );

		$var_esc = esc_attr( $var );
		$output  = '<label class="select" for="' . $var_esc . '">' . $label . ':</label>';
		$output .= '<select class="select" name="' . $option . '[' . $var_esc . ']" id="' . $var_esc . '">';

		foreach ( $values as $value => $label ) {
			$sel = '';
			if ( isset( $options[$var] ) && $options[$var] == $value )
				$sel = 'selected="selected" ';

			if ( !empty( $label ) )
				$output .= '<option ' . $sel . 'value="' . esc_attr( $value ) . '">' . $label . '</option>';
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
		if ( isset( $options[$var] ) && strtolower( gettype( $options[$var] ) ) == 'array' ) {
			$val = $options[$var]['url'];
		}

		$var_esc = esc_attr( $var );
		$output  = '<label class="select" for="' . $var_esc . '">' . esc_html( $label ) . ':</label>';
		$output .= '<input type="file" value="' . $val . '" class="textinput" name="' . esc_attr( $option ) . '[' . $var_esc . ']" id="' . $var_esc . '"/>';

		// Need to save separate array items in hidden inputs, because empty file inputs type will be deleted by settings API.
		if ( !empty( $options[$var] ) ) {
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
		if ( empty( $option ) )
			$option = $this->currentoption;

		$options = $this->get_option( $option );

		if ( !isset( $options[$var] ) )
			$options[$var] = false;

		$var_esc = esc_attr( $var );

		$output = '<br/><label class="select">' . $label . ':</label>';
		foreach ( $values as $key => $value ) {
			$key = esc_attr( $key );
			$output .= '<input type="radio" class="radio" id="' . $var_esc . '-' . $key . '" name="' . esc_attr( $option ) . '[' . $var_esc . ']" value="' . $key . '" ' . ( $options[$var] == $key ? ' checked="checked"' : '' ) . ' /> <label class="radio" for="' . $var_esc . '-' . $key . '">' . esc_attr( $value ) . '</label>';
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
		$content = '<table class="form-table">';
		foreach ( $rows as $row ) {
			$content .= '<tr><th valign="top" scrope="row">';
			if ( isset( $row['id'] ) && $row['id'] != '' )
				$content .= '<label for="' . esc_attr( $row['id'] ) . '">' . esc_html( $row['label'] ) . ':</label>';
			else
				$content .= esc_html( $row['label'] );
			if ( isset( $row['desc'] ) && $row['desc'] != '' )
				$content .= '<br/><small>' . esc_html( $row['desc'] ) . '</small>';
			$content .= '</th><td valign="top">';
			$content .= $row['content'];
			$content .= '</td></tr>';
		}
		$content .= '</table>';
		return $content;
	}

} // end class WPSEO_Admin
global $wpseo_admin_pages;
$wpseo_admin_pages = new WPSEO_Admin_Pages();
