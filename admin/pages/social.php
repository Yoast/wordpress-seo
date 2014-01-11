<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

global $wpseo_admin_pages;

$fbconnect  = '<p><strong>' . __( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br>';
$fbconnect .= sprintf( __( 'To be able to access your %sFacebook Insights%s for your site, you need to specify a Facebook Admin. This can be a user, but if you have an app for your site, you could use that. For most people a user will be "good enough" though.', 'wordpress-seo' ), '<a href="https://www.facebook.com/insights">', '</a>' ) . '</p>';

$error    = false;
$clearall = false;

$options = get_option( 'wpseo_social' );

if ( isset( $_GET['delfbadmin'] ) ) {
	if ( wp_verify_nonce( $_GET['nonce'], 'delfbadmin' ) != 1 )
		die( "I don't think that's really nice of you!." );
		
	$options = get_option( 'wpseo_social' );
	$id      = $_GET['delfbadmin'];
	if ( isset( $options['fb_admins'][$id] ) ) {
		$fbadmin = $options['fb_admins'][$id]['name'];
		unset( $options['fb_admins'][$id] );
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ), 'updated' );
		$error = true;
	}
}

if ( isset( $_GET['fbclearall'] ) ) {
	if ( wp_verify_nonce( $_GET['nonce'], 'fbclearall' ) != 1 )
		die( "I don't think that's really nice of you!." );

	$options = get_option( 'wpseo_social' );
	$options['fb_admins']  = WPSEO_Options::$defaults['wpseo_social']['fb_admins'];
	$options['fbapps']     = WPSEO_Options::$defaults['wpseo_social']['fbapps'];
	$options['fbadminapp'] = WPSEO_Options::$defaults['wpseo_social']['fbadminapp'];
	update_option( 'wpseo_social', $options );
	add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully cleared all Facebook Data', 'wordpress-seo' ), 'updated' );
}

if ( isset( $_GET['key'] ) && $_GET['key'] == $options['fbconnectkey'] ) {
	if ( isset( $_GET['userid'] ) ) {
		$options 								= get_option( 'wpseo_social' );
		$user_id                                = sanitize_text_field( $_GET['userid'] );
		$options['fb_admins'][$user_id]['name'] = sanitize_text_field( urldecode( $_GET['userrealname'] ) );
		$options['fb_admins'][$user_id]['link'] = sanitize_text_field( urldecode( $_GET['link'] ) );
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . esc_url( $options['fb_admins'][$user_id]['link'] ) . '">' . esc_html( $options['fb_admins'][$user_id]['name'] ) . '</a>' ), 'updated' );
	} else if ( isset( $_GET['apps'] ) ) {
		$options 		   = get_option( 'wpseo_social' );
		$apps              = json_decode( stripslashes( $_GET['apps'] ) );
		$options['fbapps'] = array( '0' => __( 'Do not use a Facebook App as Admin', 'wordpress-seo' ) );
		foreach ( $apps as $app ) {
			$options['fbapps'][$app->app_id] = $app->display_name;
		}
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully retrieved your apps from Facebook, now select an app to use as admin.', 'wordpress-seo' ), 'updated' );
	}
	$error = true;
}

$options = get_option( 'wpseo_social' );


if ( is_array( $options['fb_admins'] ) && $options['fb_admins'] !== array() ) {
	foreach ( $options['fb_admins'] as $id => $admin ) {
		$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . esc_attr( $id ) . '][name]" value="' . esc_attr( $admin['name'] ) . '"/>';
		$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . esc_attr( $id ) . '][link]" value="' . esc_attr( $admin['link'] ) . '"/>';
	}
	$clearall = true;
}

if ( is_array( $options['fbapps'] ) && $options['fbapps'] !== array() ) {
	foreach ( $options['fbapps'] as $id => $page ) {
		$fbconnect .= '<input type="hidden" name="wpseo_social[fbapps][' . esc_attr( $id ) . ']" value="' . esc_attr( $page ) . '"/>';
	}
	$clearall = true;
}

$app_button_text = __( 'Use a Facebook App as Admin', 'wordpress-seo' );
if ( is_array( $options['fbapps'] ) && $options['fbapps'] !== array() ) {
	// @todo - use select() method ?
	$fbconnect .= '<p>' . __( 'Select an app to use as Facebook admin:', 'wordpress-seo' ) . '</p>';
	$fbconnect .= '<select name="wpseo_social[fbadminapp]" id="fbadminapp">';

	foreach ( $options['fbapps'] as $id => $app ) {
		$fbconnect .= '<option value="' . esc_attr( $id ) . '" ' . selected( $id, $options['fbadminapp'], false ) . '>' . esc_attr( $app ) . '</option>';
	}
	$fbconnect .= '</select><div class="clear"></div><br/>';
	$app_button_text = __( 'Update Facebook Apps', 'wordpress-seo' );
}

if ( $options['fbadminapp'] == 0 ) {
	$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
	$primary     = true;
	if ( is_array( $options['fb_admins'] ) && count( $options['fb_admins'] ) > 0 ) {
		$fbconnect .= '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
		$fbconnect .= '<ul>';
		$nonce = wp_create_nonce( 'delfbadmin' );

		foreach ( $options['fb_admins'] as $admin_id => $admin ) {
			$admin_id   = esc_attr( $admin_id );
			$fbconnect .= '<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a> - <strong><a href="' . esc_url( add_query_arg( array( 'delfbadmin' => $admin_id, 'nonce' => $nonce ), admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">X</a></strong></li>';
			// @todo: check if these hidden fields really need setting - also added on line 79-84
//			$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . esc_attr( $admin_id ) . '][link]" value="' . esc_attr( $admin['link'] ) . '"/>';
//			$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . esc_attr( $admin_id ) . '][name]" value="' . esc_attr( $admin['name'] ) . '"/>';
		}
		$fbconnect  .= '</ul>';
		$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
		$primary     = false;
	}
	$but_primary = '';
	if ( $primary ) {
		$but_primary = '-primary';
	}
	$fbconnect .= '<p><a class="button' . esc_attr( $but_primary ) . '" href="' . esc_url( 'https://yoast.com/fb-connect/?key=' . urlencode( $options['fbconnectkey'] ) . '&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . $button_text . '</a></p>';
}

$fbconnect .= '<a class="button" href="' . esc_url( 'https://yoast.com/fb-connect/?key=' . urlencode( $options['fbconnectkey'] ) . '&type=app&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . esc_html( $app_button_text ) . '</a> ';
if ( $clearall ) {
	$fbconnect .= '<a class="button" href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'fbclearall' ), 'fbclearall' => 'true' ), admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . __( 'Clear all Facebook Data', 'wordpress-seo' ) . '</a> ';
}
$fbconnect .= '</p>';

$wpseo_admin_pages->admin_header( true, WPSEO_Options::$options['wpseo_social']['group'], 'wpseo_social' );

if ( $error )
	settings_errors();
?>

<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<a class="nav-tab nav-tab-active" id="facebook-tab" href="#top#facebook"><?php _e( 'Facebook', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="twitterbox-tab" href="#top#twitterbox"><?php _e( 'Twitter', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="google-tab" href="#top#google"><?php _e( 'Google+', 'wordpress-seo' );?></a>
</h2>

<div id="facebook" class="wpseotab">
	<?php
		echo '<p>';
		echo $wpseo_admin_pages->checkbox( 'opengraph', '<label for="opengraph">' . __( 'Add Open Graph meta data', 'wordpress-seo' ) . '</label>' );
		echo '</p>';
		echo'<p class="desc">' . __( 'Add Open Graph meta data to your site\'s <code>&lt;head&gt;</code> section. You can specify some of the ID\'s that are sometimes needed below:', 'wordpress-seo' ) . '</p>';
		echo $fbconnect;
		echo $wpseo_admin_pages->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ) );
		echo '<h4>' . __( 'Frontpage settings', 'wordpress-seo' ) . '</h4>';
		echo $wpseo_admin_pages->textinput( 'og_frontpage_image', __( 'Image URL', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->textinput( 'og_frontpage_desc', __( 'Description', 'wordpress-seo' ) );
		echo '<p class="desc label">' . __( 'These are the image and description used in the Open Graph meta tags on the frontpage of your site.', 'wordpress-seo' ) . '</p>';
		echo '<h4>' . __( 'Default settings', 'wordpress-seo' ) . '</h4>';
		echo $wpseo_admin_pages->textinput( 'og_default_image', __( 'Image URL', 'wordpress-seo' ) );
		echo '<p class="desc label">' . __( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ) . '</p>';
		do_action( 'wpseo_admin_opengraph_section' );
	?>
</div>

<div id="twitterbox" class="wpseotab">
	<?php
		echo '<p>';
		echo $wpseo_admin_pages->checkbox( 'twitter', '<label for="twitter">' . __( 'Add Twitter card meta data', 'wordpress-seo' ) . '</label>' );
		echo '</p>';
		echo'<p class="desc">' . __( 'Add Twitter card meta data to your site\'s <code>&lt;head&gt;</code> section.', 'wordpress-seo' ) . '</p>';
		echo $wpseo_admin_pages->textinput( 'twitter_site', __( 'Site Twitter Username', 'wordpress-seo' ) );
		do_action( 'wpseo_admin_twitter_section' );
	?>
</div>

<div id="google" class="wpseotab">
	<?php
		// echo '<h2>' . __( 'Author metadata', 'wordpress-seo' ) . '</h2>';
		echo '<label class="select" for="">' . __( 'Author for homepage', 'wordpress-seo' ) . ':</label>';
		wp_dropdown_users(
			array(
				'show_option_none' => __( "Don't show", 'wordpress-seo' ),
				'name' => 'wpseo_social[plus-author]',
				'class' => 'select',
				'selected' => $options['plus-author'],
				'include_selected' => true,
				'who' => 'authors',
			)
		);
		echo '<p class="desc label">' . __( 'Choose the user that should be used for the <code>rel="author"</code> on the blog homepage. Make sure the user has filled out his/her Google+ profile link on their profile page.', 'wordpress-seo' ) . '</p>';
		echo $wpseo_admin_pages->textinput( 'plus-publisher', __( 'Google Publisher Page', 'wordpress-seo' ) );
		echo '<p class="desc label">' . __( 'If you have a Google+ page for your business, add that URL here and link it on your Google+ page\'s about page.', 'wordpress-seo' ) . '</p>';
		do_action( 'wpseo_admin_googleplus_section' );
	?>
</div>

<?php
$wpseo_admin_pages->admin_footer();