<?php
/**
 * @package Admin
 */

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
		if ( isset( $_GET['wpseo_reset_defaults'] ) ) {
			$this->reset_defaults();
			wp_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		}

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

		wpseo_title_test();
	}

	/**
	 * Generates the sidebar for admin pages.
	 */
	function admin_sidebar() {
		?>
	<div class="postbox-container" style="width:25%;min-width:200px;max-width:350px;">
		<div id="sidebar">
			<?php
			$this->postbox( 'sitereview', '<span class="promo">' . __( 'Improve your Site!', 'wordpress-seo' ) . '</span>', '<p>' . sprintf( __( 'Don\'t know where to start? Order a %1$swebsite review%2$s from Yoast!', 'wordpress-seo' ), '<a href="http://yoast.com/hire-me/website-review/#utm_source=wpadmin&utm_medium=sidebanner&utm_term=link&utm_campaign=wpseoplugin">', '</a>' ) . '</p>' . '<p><a class="button-primary" href="http://yoast.com/hire-me/website-review/#utm_source=wpadmin&utm_medium=sidebanner&utm_term=button&utm_campaign=wpseoplugin">' . __( 'Read more &raquo;', 'wordpress-seo' ) . '</a></p>' );
			$this->plugin_support();
			$this->postbox( 'donate', '<span class="promo">' . __( 'Spread the Word!', 'wordpress-seo' ) . '</span>', '<p>' . __( 'Want to help make this plugin even better? All donations are used to improve this plugin, so donate $10, $20 or $50 now!', 'wordpress-seo' ) . '</p><form action="https://www.paypal.com/cgi-bin/webscr" method="post">
						<input type="hidden" name="cmd" value="_s-xclick">
						<input type="hidden" name="hosted_button_id" value="83KQ269Q2SR82">
						<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit">
						</form>'
				. '<p>' . __( 'Or you could:', 'wordpress-seo' ) . '</p>'
				. '<ul>'
				. '<li><a href="http://wordpress.org/extend/plugins/wordpress-seo/">' . __( 'Rate the plugin 5★ on WordPress.org', 'wordpress-seo' ) . '</a></li>'
				. '<li><a href="http://yoast.com/wordpress/seo/#utm_source=wpadmin&utm_medium=sidebanner&utm_term=link&utm_campaign=wpseoplugin">' . __( 'Blog about it & link to the plugin page', 'wordpress-seo' ) . '</a></li>'
				. '<li><a href="http://amzn.com/w/CBV7CEOJJH98">' . __( 'Buy me something from my wishlist', 'wordpress-seo' ) . '</a></li>'
			. '</ul>' );
			$this->news();
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

			if ( function_exists( 'w3tc_pgcache_flush' ) ) {
				w3tc_pgcache_flush();
				$msg .= __( ' &amp; W3 Total Cache Page Cache flushed', 'wordpress-seo' );
			} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
				wp_cache_clear_cache();
				$msg .= __( ' &amp; WP Super Cache flushed', 'wordpress-seo' );
			}

			// flush rewrite rules if XML sitemap settings have been updated.
			if ( isset( $_GET['page'] ) && 'wpseo_xml' == $_GET['page'] )
				flush_rewrite_rules();

			echo '<div id="message" style="width:94%;" class="message updated"><p><strong>' . $msg . '.</strong></p></div>';
		}
		?>
		<a href="http://yoast.com/">
			<div id="yoast-icon"
				 style="background: url('<?php echo WPSEO_URL; ?>images/wordpress-SEO-32x32.png') no-repeat;"
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
		$wpdb->query( "DELETE FROM $wpdb->postmeta WHERE meta_key = '$metakey'" );
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
			wp_enqueue_style( 'yoast-admin-css', WPSEO_URL . 'css/yst_plugin_tools.css', WPSEO_VERSION );
		}
	}

	/**
	 * Loads the required scripts for the config page.
	 */
	function config_page_scripts() {
		global $pagenow;
		if ( $pagenow == 'admin.php' && isset( $_GET['page'] ) && in_array( $_GET['page'], $this->adminpages ) ) {
			wp_enqueue_script( 'wpseo-admin-script', WPSEO_URL . 'js/wp-seo-admin.js', array( 'jquery' ), WPSEO_VERSION, true );
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

		if ( $label_left !== false ) {
			if ( !empty( $label_left ) )
				$label_left .= ':';
			$output_label = '<label class="checkbox" for="' . $var . '">' . $label_left . '</label>';
			$class        = 'checkbox';
		} else {
			$output_label = '<label for="' . $var . '">' . $label . '</label>';
			$class        = 'checkbox double';
		}

		$output_input = "<input class='$class' type='checkbox' id='${var}' name='${option}[${var}]' " . checked( $options[$var], 'on', false ) . '/>';

		if ( $label_left !== false ) {
			$output = $output_label . $output_input . '<label class="checkbox" for="' . $var . '">' . $label . '</label>';
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

		return '<label class="textinput" for="' . $var . '">' . $label . ':</label><input class="textinput" type="text" id="' . $var . '" name="' . $option . '[' . $var . ']" value="' . $val . '"/>' . '<br class="clear" />';
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

		return '<label class="textinput" for="' . $var . '">' . $label . ':</label><textarea class="textinput ' . $class . '" id="' . $var . '" name="' . $option . '[' . $var . ']">' . $val . '</textarea>' . '<br class="clear" />';
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

		return '<input type="hidden" id="hidden_' . $var . '" name="' . $option . '[' . $var . ']" value="' . $val . '"/>';
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

		$output = '<label class="select" for="' . $var . '">' . $label . ':</label>';
		$output .= '<select class="select" name="' . $option . '[' . $var . ']" id="' . $var . '">';

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
		$output = '<label class="select" for="' . $var . '">' . $label . ':</label>';
		$output .= '<input type="file" value="' . $val . '" class="textinput" name="' . $option . '[' . $var . ']" id="' . $var . '"/>';

		// Need to save separate array items in hidden inputs, because empty file inputs type will be deleted by settings API.
		if ( !empty( $options[$var] ) ) {
			$output .= '<input class="hidden" type="hidden" id="' . $var . '_file" name="wpseo_local[' . $var . '][file]" value="' . esc_attr( $options[$var]['file'] ) . '"/>';
			$output .= '<input class="hidden" type="hidden" id="' . $var . '_url" name="wpseo_local[' . $var . '][url]" value="' . esc_attr( $options[$var]['url'] ) . '"/>';
			$output .= '<input class="hidden" type="hidden" id="' . $var . '_type" name="wpseo_local[' . $var . '][type]" value="' . esc_attr( $options[$var]['type'] ) . '"/>';
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

		$output = '<br/><label class="select">' . $label . ':</label>';
		foreach ( $values as $key => $value ) {
			$output .= '<input type="radio" class="radio" id="' . $var . '-' . $key . '" name="' . $option . '[' . $var . ']" value="' . $key . '" ' . ( $options[$var] == $key ? ' checked="checked"' : '' ) . ' /> <label class="radio" for="' . $var . '-' . $key . '">' . $value . '</label>';
		}
		$output .= '<br/>';

		return $output;
	}

	/**
	 * Create a potbox widget.
	 *
	 * @param string $id      ID of the postbox.
	 * @param string $title   Title of the postbox.
	 * @param string $content Content of the postbox.
	 */
	function postbox( $id, $title, $content ) {
		?>
	<div id="<?php echo $id; ?>" class="yoastbox">
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
				$content .= '<label for="' . $row['id'] . '">' . $row['label'] . ':</label>';
			else
				$content .= $row['label'];
			if ( isset( $row['desc'] ) && $row['desc'] != '' )
				$content .= '<br/><small>' . $row['desc'] . '</small>';
			$content .= '</th><td valign="top">';
			$content .= $row['content'];
			$content .= '</td></tr>';
		}
		$content .= '</table>';
		return $content;
	}

	/**
	 * Info box with link to the support forums.
	 */
	function plugin_support() {
		$content = '<p>' . __( 'If you are having problems with this plugin, please talk about them in the', 'wordpress-seo' ) . ' <a href="http://wordpress.org/support/plugin/wordpress-seo/">' . __( "Support forums", 'wordpress-seo' ) . '</a>.</p>';
		$this->postbox( 'support', __( 'Need support?', 'wordpress-seo' ), $content );
	}

	/**
	 * Fetch RSS items from the feed.
	 *
	 * @param int    $num  Number of items to fetch.
	 * @param string $feed The feed to fetch.
	 * @return array|bool False on error, array of RSS items on success.
	 */
	function fetch_rss_items( $num, $feed ) {
		include_once( ABSPATH . WPINC . '/feed.php' );
		$rss = fetch_feed( $feed );

		// Bail if feed doesn't work
		if ( !$rss || is_wp_error( $rss ) )
			return false;

		$rss_items = $rss->get_items( 0, $rss->get_item_quantity( $num ) );

		// If the feed was erroneous 
		if ( !$rss_items ) {
			$md5 = md5( $feed );
			delete_transient( 'feed_' . $md5 );
			delete_transient( 'feed_mod_' . $md5 );
			$rss       = fetch_feed( $feed );
			$rss_items = $rss->get_items( 0, $rss->get_item_quantity( $num ) );
		}

		return $rss_items;
	}

	/**
	 * Box with latest news from Yoast.com for sidebar
	 */
	function news() {
		$rss_items = $this->fetch_rss_items( 3, 'http://yoast.com/feed/' );

		$content = '<ul>';
		if ( !$rss_items ) {
			$content .= '<li class="yoast">' . __( 'No news items, feed might be broken...', 'wordpress-seo' ) . '</li>';
		} else {
			foreach ( $rss_items as $item ) {
				$url = preg_replace( '/#.*/', '', esc_url( $item->get_permalink(), null, 'display' ) );
				$content .= '<li class="yoast">';
				$content .= '<a class="rsswidget" href="' . $url . '#utm_source=wpadmin&utm_medium=sidebarwidget&utm_term=newsitem&utm_campaign=wpseoplugin">' . esc_html( $item->get_title() ) . '</a> ';
				$content .= '</li>';
			}
		}
		$content .= '<li class="facebook"><a href="https://www.facebook.com/yoast">' . __( 'Like Yoast on Facebook', 'wordpress-seo' ) . '</a></li>';
		$content .= '<li class="twitter"><a href="http://twitter.com/yoast">' . __( 'Follow Yoast on Twitter', 'wordpress-seo' ) . '</a></li>';
		$content .= '<li class="googleplus"><a href="https://plus.google.com/115369062315673853712/posts">' . __( 'Circle Yoast on Google+', 'wordpress-seo' ) . '</a></li>';
		$content .= '<li class="email"><a href="http://yoast.com/wordpress-newsletter/">' . __( 'Subscribe by email', 'wordpress-seo' ) . '</a></li>';
		$content .= '</ul>';
		$this->postbox( 'yoastlatest', __( 'Latest news from Yoast', 'wordpress-seo' ), $content );
	}

} // end class WPSEO_Admin
global $wpseo_admin_pages;
$wpseo_admin_pages = new WPSEO_Admin_Pages();
