<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

// Admin header.
Yoast_Form::get_instance()->admin_header( false, 'wpseo-gsc', false, 'yoast_wpseo_gsc_options' );

// GSC Error notification.
$gsc_profile = WPSEO_GSC_Settings::get_profile();
$gsc_url     = 'https://search.google.com/search-console/index';
if ( $gsc_profile !== '' ) {
	$gsc_url .= '?resource_id=' . rawurlencode( $gsc_profile );
}
$gsc_post_url            = 'https://yoa.st/google-search-console-deprecated';
$gsc_style_alert         = '
	display: flex;
	align-items: baseline;
	position: relative;
	padding: 16px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	font-size: 14px;
	font-weight: 400;
	line-height: 1.5;
	margin: 16px 0;
	color: #450c11;
	background: #f8d7da;
';
$gsc_style_alert_icon    = 'display: block; margin-right: 8px;';
$gsc_style_alert_content = 'max-width: 600px;';
$gsc_style_alert_link    = 'color: #004973;';
$gsc_notification        = sprintf(
	/* Translators: %1$s: expands to opening anchor tag, %2$s expands to closing anchor tag. */
	__( 'Google has discontinued its Crawl Errors API. Therefore, any possible crawl errors you might have cannot be displayed here anymore. %1$sRead our statement on this for further information%2$s.', 'wordpress-seo' ),
	'<a style="' . $gsc_style_alert_link . '" href="' . WPSEO_Shortlinker::get( $gsc_post_url ) . '" target="_blank" rel="noopener">',
	'</a>'
);
$gsc_notification .= '<br/><br/>';
$gsc_notification .= sprintf(
	/* Translators: %1$s: expands to opening anchor tag, %2$s expands to closing anchor tag. */
	__( 'To view your current crawl errors, %1$splease visit Google Search Console%2$s.', 'wordpress-seo' ),
	'<a style="' . $gsc_style_alert_link . '" href="' . $gsc_url . '" target="_blank" rel="noopener noreferrer">',
	'</a>'
);
?>
	<div style="<?php echo $gsc_style_alert; ?>">
	<span style="<?php echo $gsc_style_alert_icon; ?>">
		<svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" role="img" aria-hidden="true"
			focusable="false" fill="#450c11">
			<path
				d="M6 1q1.6 0 3 .8T11.2 4t.8 3-.8 3T9 12.2 6 13t-3-.8T.8 10 0 7t.8-3T3 1.8 6 1zm1 9.7V9.3 9L6.7 9H5l-.1.3V10.9l.3.1h1.6l.1-.3zm0-2.6L7 3.2v-.1L6.8 3H5 5l-.1.2.1 4.9.3.2h1.4l.2-.1Q7 8 6.9 8z"></path>
		</svg>
	</span>
		<span style="<?php echo $gsc_style_alert_content; ?>"><?php echo $gsc_notification; ?></span>
	</div>
<?php

$platform_tabs = new WPSEO_GSC_Platform_Tabs();

if ( defined( 'WP_DEBUG' ) && WP_DEBUG && WPSEO_GSC_Settings::get_profile() !== '' ) {
	?>
	<form action="" method="post" class="wpseo-gsc-reload-crawl-issues-form">
		<input type='hidden' name='reload-crawl-issues-nonce' value='<?php echo esc_attr( wp_create_nonce( 'reload-crawl-issues' ) ); ?>' />
		<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button button-primary alignright"
			value="<?php esc_attr_e( 'Reload crawl issues', 'wordpress-seo' ); ?>">
	</form>
<?php } ?>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php echo $platform_tabs; ?>
	</h2>

<?php

// Video explains about the options when connected only.
if ( null !== $this->service->get_client()->getAccessToken() ) {
	$video_url = WPSEO_Shortlinker::get( 'https://yoa.st/screencast-search-console' );
}
else {
	$video_url = WPSEO_Shortlinker::get( 'https://yoa.st/screencast-connect-search-console' );
}

$tab             = new WPSEO_Option_Tab( 'GSC', __( 'Google Search Console', 'wordpress-seo' ), array( 'video_url' => $video_url ) );
$gsc_help_center = new WPSEO_Help_Center( 'google-search-console', $tab, WPSEO_Utils::is_yoast_seo_premium() );
$gsc_help_center->localize_data();
$gsc_help_center->mount();

switch ( $platform_tabs->current_tab() ) {
	case 'settings':
		// Check if there is an access token.
		if ( null === $this->service->get_client()->getAccessToken() ) {
			// Print auth screen.
			echo '<p>';
			printf(
				/* Translators: %s: expands to Yoast SEO. */
				esc_html__( 'To allow %s to fetch your Google Search Console information, please enter your Google Authorization Code. Clicking the button below will open a new window.', 'wordpress-seo' ),
				'Yoast SEO'
			);
			echo "</p>\n";
			echo '<input type="hidden" id="gsc_auth_url" value="', esc_url( $this->service->get_client()->createAuthUrl() ) , '" />';
			echo "<button type='button' id='gsc_auth_code' class='button'>" , esc_html__( 'Get Google Authorization Code', 'wordpress-seo' ) ,"</button>\n";

			echo '<p id="gsc-enter-code-label">' . esc_html__( 'Enter your Google Authorization Code and press the Authenticate button.', 'wordpress-seo' ) . "</p>\n";
			echo "<form action='" . esc_url( admin_url( 'admin.php?page=wpseo_search_console&tab=settings' ) ) . "' method='post'>\n";
			echo "<input type='text' name='gsc[authorization_code]' value='' class='textinput' aria-labelledby='gsc-enter-code-label' />";
			echo "<input type='hidden' name='gsc[gsc_nonce]' value='" . esc_attr( wp_create_nonce( 'wpseo-gsc_nonce' ) ) . "' />";
			echo "<input type='submit' name='gsc[Submit]' value='" . esc_attr__( 'Authenticate', 'wordpress-seo' ) . "' class='button button-primary' />";
			echo "</form>\n";
		}
		else {
			$reset_button = '<a class="button" href="' . esc_url( add_query_arg( 'gsc_reset', 1 ) ) . '">' . esc_html__( 'Reauthenticate with Google', 'wordpress-seo' ) . '</a>';
			echo '<h3>', esc_html__( 'Current profile', 'wordpress-seo' ), '</h3>';
			$profile = WPSEO_GSC_Settings::get_profile();
			if ( $profile !== '' ) {
				echo '<p>';
				echo $profile;
				echo '</p>';

				echo '<p>';
				echo $reset_button;
				echo '</p>';

			}
			else {
				echo "<form action='" . esc_url( admin_url( 'options.php' ) ) . "' method='post'>";

				settings_fields( 'yoast_wpseo_gsc_options' );
				Yoast_Form::get_instance()->set_option( 'wpseo-gsc' );

				echo '<p>';
				$profiles = $this->service->get_sites();
				if ( ! empty( $profiles ) ) {
					$show_save = true;
					Yoast_Form::get_instance()->select( 'profile', esc_html__( 'Profile', 'wordpress-seo' ), $profiles );
				}
				else {
					$show_save = false;
					esc_html_e( 'There were no profiles found', 'wordpress-seo' );
				}
				echo '</p>';

				echo '<p>';

				if ( $show_save ) {
					echo '<input type="submit" name="submit" id="submit" class="button button-primary wpseo-gsc-save-profile" value="' . esc_attr__( 'Save Profile', 'wordpress-seo' ) . '" /> ' . esc_html__( 'or', 'wordpress-seo' ) . ' ';
				}
				echo $reset_button;
				echo '</p>';
				echo '</form>';
			}
		}
		break;

	default:
		$form_action_url = add_query_arg( 'page', esc_attr( filter_input( INPUT_GET, 'page' ) ) );

		$screen_reader_content = array(
			// There are no views links in this screen, so no need for the views heading.
			'heading_views'      => null,
			'heading_pagination' => __( 'Crawl issues list navigation', 'wordpress-seo' ),
			'heading_list'       => __( 'Crawl issues list', 'wordpress-seo' ),
		);
		get_current_screen()->set_screen_reader_content( $screen_reader_content );

		// Open <form>.
		echo "<form id='wpseo-crawl-issues-table-form' action='" . esc_url( $form_action_url ) . "' method='post'>\n";

		// AJAX nonce.
		echo "<input type='hidden' class='wpseo-gsc-ajax-security' value='" . esc_attr( wp_create_nonce( 'wpseo-gsc-ajax-security' ) ) . "' />\n";

		$this->display_table();

		// Close <form>.
		echo "</form>\n";

		if ( ! WPSEO_Utils::is_yoast_seo_premium() ) {
			echo '<div id="yoast-google-search-console-modal"></div>';
		}

		break;
}
?>
<?php
	// Add link to Knowledge Base article about crawl issues.
	echo '<p>';

	printf(
		/* translators: %1$s expands anchor to knowledge base article, %2$s expands to </a> */
		esc_html__( 'Please refer to %1$sour article about how to connect your website to Google Search Console%2$s if you need assistance.', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1zy' ) ) . '" target="_blank" rel="noopener noreferrer">',
		'</a>'
	);

	echo '</p>';
	?>

	<br class="clear" />
<?php

// Admin footer.
Yoast_Form::get_instance()->admin_footer( false );
