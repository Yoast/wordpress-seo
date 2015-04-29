<?php
/**
 * @package	WPSEO
 * @subpackage	Premium
 */

	// Admin header
	Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
?>
	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<form action="" method="post">
			<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button-primary"
				   style="float: right;" value="<?php _e( 'Reload crawl issues', 'wordpress-seo-premium' ); ?>">
		</form>
		<?php echo $platform_tabs = new WPSEO_GWT_Platform_Tabs; ?>
	</h2>

<?php

switch ( $platform_tabs->current_tab() ) {
	case 'settings' :
		?>
		<h2>Google Webmaster Tools Settings</h2>

		<form action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
			<?php
			settings_fields( 'yoast_wpseo_gwt_options' );
			Yoast_Form::get_instance()->set_option( 'wpseo-premium-gwt' );

			echo Yoast_Form::get_instance()->select( 'profile', __( 'Profile', 'wordpress-seo-premium' ), $this->service->get_sites() );

			?>
			<p class="submit">
				<input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'wordpress-seo-premium' ); ?>">
			</p>
		</form>
		<?php
		break;

	default :
		// Check if there is an access token
		if ( null !== $this->service->get_client()->getAccessToken() ) {
			$category = '';
			if ( $filter_category = filter_input( INPUT_GET, 'category' ) ) {
				$category = "&category={$filter_category}";
			}

			// Open <form>
			echo "<form id='wpseo-crawl-issues-table-form' action='" . admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . $category . "' method='post'>\n";

			// AJAX nonce
			echo "<input type='hidden' class='wpseo-gwt-ajax-security' value='" . wp_create_nonce( 'wpseo-gwt-ajax-security' ) . "' />\n";

			$this->display_table();

			// Close <form>
			echo "</form>\n";
		}
		else {
			// Get the oauth URL
			$oauth_url = $this->service->get_client()->createAuthUrl();

			// Print auth screen
			echo '<p>' . __( 'To allow WordPress SEO Premium to fetch your Google Webmaster Tools information, please enter your Google Authorization Code.', 'wordpress-seo-premium' ) . "</p>\n";
			echo "<a href='javascript:wpseo_gwt_open_authorize_code_window(\"{$oauth_url}\");'>" . __( 'Click here to get a Google Authorization Code', 'wordpress-seo-premium' ) . "</a>\n";

			echo '<p>' . __( 'Please enter the Authorization Code in the field below and press the Authenticate button.', 'wordpress-seo-premium' ) . "</p>\n";
			echo "<form action='' method='post'>\n";
			echo "<input type='text' name='gwt[authorization_code]' value='' />";
			echo "<input type='hidden' name='gwt[gwt_nonce]' value='" . wp_create_nonce( 'wpseo-gwt_nonce' ) . "' />";
			echo "<input type='submit' name='gwt[Submit]' value='" . __( 'Authenticate', 'wordpress-seo-premium' ) . "' class='button-primary' />";
			echo "</form>\n";
		}

		break;
}
?>
	<br class="clear" />
<?php

// Admin footer
Yoast_Form::get_instance()->admin_footer( false );