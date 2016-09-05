<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

	// Admin header.
	Yoast_Form::get_instance()->admin_header( false, 'wpseo-gsc', false, 'yoast_wpseo_gsc_options' );
?>
	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
<?php
if ( defined( 'WP_DEBUG' ) && WP_DEBUG && WPSEO_GSC_Settings::get_profile() !== '' ) {
	?>
		<form action="" method="post">
			<input type='hidden' name='reload-crawl-issues-nonce' value='<?php echo esc_attr( wp_create_nonce( 'reload-crawl-issues' ) ); ?>' />
			<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button button-primary"
				   style="float: right;" value="<?php esc_html_e( 'Reload crawl issues', 'wordpress-seo' ); ?>">
		</form>
<?php } ?>
		<?php echo $platform_tabs = new WPSEO_GSC_Platform_Tabs; ?>
	</h2>

<?php

// Video explains about the options when connected only.
if ( null !== $this->service->get_client()->getAccessToken() ) {
	$tab_video_url = 'https://yoa.st/screencast-search-console';
	include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
}
else {
	$tab_video_url = 'https://yoa.st/screencast-connect-search-console';
	include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
}

switch ( $platform_tabs->current_tab() ) {
	case 'settings' :
		// Check if there is an access token.
		if ( null === $this->service->get_client()->getAccessToken() ) {
			// Print auth screen.
			echo '<p>';
			/* Translators: %1$s: expands to 'Yoast SEO', %2$s expands to Google Search Console. */
			echo sprintf( esc_html__( 'To allow %1$s to fetch your %2$s information, please enter your Google Authorization Code. Clicking the button below will open a new window.', 'wordpress-seo' ), 'Yoast SEO', 'Google Search Console' );
			echo "</p>\n";
			echo '<input type="hidden" id="gsc_auth_url" value="', esc_attr( $this->service->get_client()->createAuthUrl() ) , '" />';
			echo "<button type='button' id='gsc_auth_code' class='button button-secondary'>" , esc_html__( 'Get Google Authorization Code', 'wordpress-seo' ) ,"</button>\n";

			echo '<p id="gsc-enter-code-label">' . esc_html__( 'Enter your Google Authorization Code and press the Authenticate button.', 'wordpress-seo' ) . "</p>\n";
			echo "<form action='" . esc_url( admin_url( 'admin.php?page=wpseo_search_console&tab=settings' ) ) . "' method='post'>\n";
			echo "<input type='text' name='gsc[authorization_code]' value='' class='textinput' aria-labelledby='gsc-enter-code-label' />";
			echo "<input type='hidden' name='gsc[gsc_nonce]' value='" . esc_attr( wp_create_nonce( 'wpseo-gsc_nonce' ) ) . "' />";
			echo "<input type='submit' name='gsc[Submit]' value='" . esc_html__( 'Authenticate', 'wordpress-seo' ) . "' class='button button-primary' />";
			echo "</form>\n";
		}
		else {
			$reset_button = '<a class="button button-secondary" href="' . add_query_arg( 'gsc_reset', 1 ) . '">' . __( 'Reauthenticate with Google ', 'wordpress-seo' ) . '</a>';
			echo '<h3>',  esc_html__( 'Current profile', 'wordpress-seo' ), '</h3>';
			if ( ($profile = WPSEO_GSC_Settings::get_profile() ) !== '' ) {
				echo '<p>';
				echo $profile; // TODO escaping, can this contain HTML? R.
				echo '</p>';

				echo '<p>';
				echo $reset_button; // TODO escaping, HTML reuse? R.
				echo '</p>';

			}
			else {
				echo "<form action='" . esc_url( admin_url( 'options.php' ) ) . "' method='post'>";

				settings_fields( 'yoast_wpseo_gsc_options' );
				Yoast_Form::get_instance()->set_option( 'wpseo-gsc' );

				echo '<p>';
				if ( $profiles = $this->service->get_sites() ) {
					$show_save = true;
					echo Yoast_Form::get_instance()->select( 'profile', esc_html__( 'Profile', 'wordpress-seo' ), $profiles );
				}
				else {
					$show_save = false;
					echo esc_html__( 'There were no profiles found', 'wordpress-seo' );
				}
				echo '</p>';

				echo '<p>';

				if ( $show_save ) {
					echo '<input type="submit" name="submit" id="submit" class="button button-primary wpseo-gsc-save-profile" value="' . esc_attr__( 'Save Profile', 'wordpress-seo' ) . '" /> ' . esc_html__( 'or', 'wordpress-seo' ) , ' ';
				}
				echo $reset_button; // TODO escaping, HTML reuse? R.
				echo '</p>';
				echo '</form>';
			}
		}
		break;

	default :
		$form_action_url = add_query_arg( 'page', esc_attr( filter_input( INPUT_GET, 'page' ) ) );

		get_current_screen()->set_screen_reader_content( array(
			// There are no views links in this screen, so no need for the views heading.
			'heading_views'      => null,
			'heading_pagination' => __( 'Crawl issues list navigation' ),
			'heading_list'       => __( 'Crawl issues list' ),
		) );

		// Open <form>.
		echo "<form id='wpseo-crawl-issues-table-form' action='" . esc_url( $form_action_url ) . "' method='post'>\n";

		// AJAX nonce.
		echo "<input type='hidden' class='wpseo-gsc-ajax-security' value='" . esc_attr( wp_create_nonce( 'wpseo-gsc-ajax-security' ) ) . "' />\n";

		$this->display_table();

		// Close <form>.
		echo "</form>\n";

		break;
}
?>
	<br class="clear" />
<?php

// Admin footer.
Yoast_Form::get_instance()->admin_footer( false );
