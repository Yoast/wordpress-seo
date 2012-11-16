<?php
/**
 * @package Admin
 */

global $wpseo_admin_pages;

$options = get_option( 'wpseo_social' );

$fbconnect = '<p><strong>' . __( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br>';
$fbconnect .= sprintf( __( 'To be able to access your <a href="%s">Facebook Insights</a> for your site, you need to specify a Facebook Admin. This can be a user, but if you have an app for your site, you could use that. For most people a user will be "good enough" though.', 'wordpress-seo' ), 'https://www.facebook.com/insights' ) . '</p>';

$error    = false;
$clearall = false;

if ( isset( $_GET[ 'delfbadmin' ] ) ) {
	if ( wp_verify_nonce( $_GET[ 'nonce' ], 'delfbadmin' ) != 1 )
		die( "I don't think that's really nice of you!." );
	$id = $_GET[ 'delfbadmin' ];
	if ( isset( $options[ 'fb_admins' ][ $id ] ) ) {
		$fbadmin = $options[ 'fb_admins' ][ $id ][ 'name' ];
		unset( $options[ 'fb_admins' ][ $id ] );
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ), 'updated' );
		$error = true;
	}
}

if ( isset( $_GET[ 'fbclearall' ] ) ) {
	if ( wp_verify_nonce( $_GET[ 'nonce' ], 'fbclearall' ) != 1 )
		die( "I don't think that's really nice of you!." );
	unset( $options[ 'fb_admins' ], $options[ 'fbapps' ], $options[ 'fbadminapp' ], $options[ 'fbadminpage' ] );
	update_option( 'wpseo_social', $options );
	add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully cleared all Facebook Data', 'wordpress-seo' ), 'updated' );
}

if ( !isset( $options[ 'fbconnectkey' ] ) || empty( $options[ 'fbconnectkey' ] ) ) {
	$options[ 'fbconnectkey' ] = md5( get_bloginfo( 'url' ) . rand() );
	update_option( 'wpseo_social', $options );
}

if ( isset( $_GET[ 'key' ] ) && $_GET[ 'key' ] == $options[ 'fbconnectkey' ] ) {
	if ( isset( $_GET[ 'userid' ] ) ) {
		if ( !is_array( $options[ 'fb_admins' ] ) )
			$options[ 'fb_admins' ] = array();
		$id                                      = $_GET[ 'userid' ];
		$options[ 'fb_admins' ][ $id ][ 'name' ] = urldecode( $_GET[ 'userrealname' ] );
		$options[ 'fb_admins' ][ $id ][ 'link' ] = urldecode( $_GET[ 'link' ] );
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . $options[ 'fb_admins' ][ $id ][ 'link' ] . '">' . $options[ 'fb_admins' ][ $id ][ 'name' ] . '</a>' ), 'updated' );
	} else if ( isset( $_GET[ 'apps' ] ) ) {
		$apps                = json_decode( stripslashes( $_GET[ 'apps' ] ) );
		$options[ 'fbapps' ] = array( '0' => __( 'Do not use a Facebook App as Admin', 'wordpress-seo' ) );
		foreach ( $apps as $app ) {
			$options[ 'fbapps' ][ $app->app_id ] = $app->display_name;
		}
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully retrieved your apps from Facebook, now select an app to use as admin.', 'wordpress-seo' ), 'updated' );
	}
	$error = true;
}

$options = get_option( 'wpseo_social' );

if ( isset( $options[ 'fb_admins' ] ) && is_array( $options[ 'fb_admins' ] ) ) {
	foreach ( $options[ 'fb_admins' ] as $id => $admin ) {
		$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . $id . ']" value="' . $admin . '"/>';
	}
	$clearall = true;
}

if ( isset( $options[ 'fbapps' ] ) && is_array( $options[ 'fbapps' ] ) ) {
	foreach ( $options[ 'fbapps' ] as $id => $page ) {
		$fbconnect .= '<input type="hidden" name="wpseo_social[fbapps][' . $id . ']" value="' . $page . '"/>';
	}
	$clearall = true;
}

$app_button_text = __( 'Use a Facebook App as Admin', 'wordpress-seo' );
if ( isset( $options[ 'fbapps' ] ) && is_array( $options[ 'fbapps' ] ) ) {
	$fbconnect .= '<p>' . __( 'Select an app to use as Facebook admin:', 'wordpress-seo' ) . '</p>';
	$fbconnect .= '<select name="wpseo_social[fbadminapp]" id="fbadminapp">';

	if ( !isset( $options[ 'fbadminapp' ] ) )
		$options[ 'fbadminapp' ] = 0;

	foreach ( $options[ 'fbapps' ] as $id => $app ) {
		$sel = '';

		if ( $id == $options[ 'fbadminapp' ] )
			$sel = 'selected="selected"';
		$fbconnect .= '<option ' . $sel . ' value="' . $id . '">' . $app . '</option>';
	}
	$fbconnect .= '</select><div class="clear"></div><br/>';
	$app_button_text = __( 'Update Facebook Apps', 'wordpress-seo' );
}

if ( !isset( $options[ 'fbadminapp' ] ) || $options[ 'fbadminapp' ] == 0 ) {
	$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
	$primary     = true;
	if ( isset( $options[ 'fb_admins' ] ) && is_array( $options[ 'fb_admins' ] ) && count( $options[ 'fb_admins' ] ) > 0 ) {
		$fbconnect .= '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
		$fbconnect .= '<ul>';
		$nonce = wp_create_nonce( 'delfbadmin' );

		foreach ( $options[ 'fb_admins' ] as $admin_id => $admin ) {
			$fbconnect .= '<li><a href="' . $admin[ 'link' ] . '">' . $admin[ 'name' ] . '</a> - <strong><a  href="' . admin_url( 'admin.php?page=wpseo_social&delfbadmin=' . $admin_id . '&nonce=' . $nonce ) . '">X</a></strong></li>';
			$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . $admin_id . '][link]" value="' . $admin[ 'link' ] . '"/>';
			$fbconnect .= '<input type="hidden" name="wpseo_social[fb_admins][' . $admin_id . '][name]" value="' . $admin[ 'name' ] . '"/>';
		}
		$fbconnect .= '</ul>';
		$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
		$primary     = false;
	}
	$but_primary = '';
	if ( $primary )
		$but_primary = '-primary';
	$fbconnect .= '<p><a class="button' . $but_primary . '" href="https://yoast.com/fb-connect/?key=' . $options[ 'fbconnectkey' ] . '&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) . '">' . $button_text . '</a></p>';
}

$fbconnect .= '<a class="button" href="https://yoast.com/fb-connect/?key=' . $options[ 'fbconnectkey' ] . '&type=app&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) . '">' . $app_button_text . '</a> ';
if ( $clearall ) {
	$fbconnect .= '<a class="button" href="' . admin_url( 'admin.php?page=wpseo_social&nonce=' . wp_create_nonce( 'fbclearall' ) . '&fbclearall=true' ) . '">' . __( 'Clear all Facebook Data', 'wordpress-seo' ) . '</a> ';
}
$fbconnect .= '</p>';

$wpseo_admin_pages->admin_header( __( 'Social', 'wordpress-seo' ), true, 'yoast_wpseo_social_options', 'wpseo_social' );

if ( $error )
	settings_errors();

echo '<h2>' . __( 'Facebook OpenGraph', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'opengraph', '<label for="opengraph">' . __( 'Add OpenGraph meta data', 'wordpress-seo' ) . '</label>' );
echo'<p class="desc">' . __( 'Add OpenGraph meta data to your site\'s <code>&lt;head&gt;</code> section. You can specify some of the ID\'s that are sometimes needed below:', 'wordpress-seo' ) . '</p>';
echo $fbconnect;
echo '<h4>' . __( 'Frontpage settings', 'wordpress-seo' ) . '</h4>';
echo $wpseo_admin_pages->textinput( 'og_frontpage_image', __( 'Image URL', 'wordpress-seo' ) );
echo $wpseo_admin_pages->textinput( 'og_frontpage_desc', __( 'Description', 'wordpress-seo' ) );
echo '<p class="desc label">' . __( 'These are the image and description used in the OpenGraph meta tags on the frontpage of your site.', 'wordpress-seo' ) . '</p>';
echo '<h4>' . __( 'Default settings', 'wordpress-seo' ) . '</h4>';
echo $wpseo_admin_pages->textinput( 'og_default_image', __( 'Image URL', 'wordpress-seo' ) );
echo '<p class="desc label">' . __( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Twitter', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'twitter', '<label for="twitter">' . __( 'Add Twitter card meta data', 'wordpress-seo' ) . '</label>' );
echo'<p class="desc">' . __( 'Add Twitter card meta data to your site\'s <code>&lt;head&gt;</code> section.', 'wordpress-seo' ) . '</p>';
echo $wpseo_admin_pages->textinput( 'twitter_site', __( 'Site Twitter Username', 'wordpress-seo' ) );

$wpseo_admin_pages->admin_footer();