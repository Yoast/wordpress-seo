<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

	// Admin header.
	Yoast_Form::get_instance()->admin_header( false, 'wpseo_webmaster_tools', false, 'yoast_wpseo_redirects_options' );
?>
	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
<?php
if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
	?>
		<form action="" method="post">
			<input type='hidden' name='reload-crawl-issues-nonce' value='<?php echo wp_create_nonce( 'reload-crawl-issues' ); ?>' />
			<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button-primary"
				   style="float: right;" value="<?php _e( 'Reload crawl issues', 'wordpress-seo' ); ?>">
		</form>
<?php } ?>
		<?php echo $platform_tabs = new WPSEO_GSC_Platform_Tabs; ?>
	</h2>

<?php

switch ( $platform_tabs->current_tab() ) {
	case 'settings' :
		// Check if there is an access token.
		if ( null === $this->service->get_client()->getAccessToken() ) {
			// Get the oauth URL.
			$oauth_url = 'wpseo_gsc_open_authorize_code_window("' . $this->service->get_client()->createAuthUrl() . ' ");';

			// Print auth screen.
			echo '<p>';
			/* Translators: %1$s: expands to 'Yoast SEO'. */
			echo sprintf( __( 'To allow %1$s to fetch your Google Webmaster Tools information, please enter your Google Authorization Code.', 'wordpress-seo' ), 'Yoast SEO' );
			echo "</p>\n";
			echo "<input class='button-secondary' type='button' onclick='javascript:{$oauth_url}' value='" , __( 'Get Google Authorization Code', 'wordpress-seo' ) ,"' />\n";

			echo '<p>' . __( 'Please enter the Google Authorization Code in the field below and press the Authenticate button.', 'wordpress-seo' ) . "</p>\n";
			echo "<form action='" . admin_url( 'admin.php?page=wpseo_webmaster_tools&tab=settings' ) . "' method='post'>\n";
			echo "<input type='text' name='gsc[authorization_code]' value='' />";
			echo "<input type='hidden' name='gsc[gsc_nonce]' value='" . wp_create_nonce( 'wpseo-gsc_nonce' ) . "' />";
			echo "<input type='submit' name='gsc[Submit]' value='" . __( 'Authenticate', 'wordpress-seo' ) . "' class='button-primary' />";
			echo "</form>\n";
		}
		else {
			if ( ($profile = WPSEO_GSC_Settings::get_profile() ) !== '' ) {

				echo "<form action='" . admin_url( 'admin.php?page=wpseo_webmaster_tools&tab=settings' ) . "' method='post'>\n";
				echo '<p>';
				echo Yoast_Form::get_instance()->label( __( 'Current profile', 'wordpress-seo' ), array() );
				echo $profile;
				echo '</p>';

				echo '<p class="submit">';
				echo '<input type="submit" name="gsc_reset" id="submit" class="button button-primary" value="' . __( 'Reset the Google data', 'wordpress-seo' ) . '" />';
				echo '</p>';
				echo '</form>';

			}
			else {
				echo "<form action='" . admin_url( 'options.php' ) . "' method='post'>";

				settings_fields( 'yoast_wpseo_gsc_options' );
				Yoast_Form::get_instance()->set_option( 'wpseo-gsc' );

				echo Yoast_Form::get_instance()->select( 'profile', __( 'Profile', 'wordpress-seo' ), $this->service->get_sites() );

				echo '<p class="submit">';
				echo '<input type="submit" name="submit" id="submit" class="button button-primary" value="' . __( 'Save Profile', 'wordpress-seo' ) . '" />';
				echo '</p>';
				echo '</form>';
			}
		}
		break;

	default :
		$category = '';
		if ( $filter_category = filter_input( INPUT_GET, 'category' ) ) {
			$category = "&category={$filter_category}";
		}

		// Open <form>.
		echo "<form id='wpseo-crawl-issues-table-form' action='" . admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . $category . "' method='post'>\n";

		// AJAX nonce.
		echo "<input type='hidden' class='wpseo-gsc-ajax-security' value='" . wp_create_nonce( 'wpseo-gsc-ajax-security' ) . "' />\n";

		$this->display_table( $platform_tabs );

		// Close <form>.
		echo "</form>\n";

		break;
}
?>
	<br class="clear" />
<?php

// Admin footer.
Yoast_Form::get_instance()->admin_footer( false );
