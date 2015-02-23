<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();

$fbconnect = '
	<p><strong>' . esc_html__( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br>
	' . sprintf( esc_html__( 'To be able to access your %sFacebook Insights%s for your site, you need to specify a Facebook Admin. This can be a user, but if you have an app for your site, you could use that. For most people a user will be "good enough" though.', 'wordpress-seo' ), '<a href="https://www.facebook.com/insights">', '</a>' ) . '</p>';
$fbbuttons = array();

$clearall = false;

$options = get_option( 'wpseo_social' );

if ( isset( $_GET['delfbadmin'] ) ) {
	if ( wp_verify_nonce( $_GET['nonce'], 'delfbadmin' ) != 1 ) {
		die( 'I don\'t think that\'s really nice of you!.' );
	}

	$id = sanitize_text_field( $_GET['delfbadmin'] );
	if ( isset( $options['fb_admins'][ $id ] ) ) {
		$fbadmin = $options['fb_admins'][ $id ]['name'];
		unset( $options['fb_admins'][ $id ] );
		update_option( 'wpseo_social', $options );
		add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ), 'updated' );
		unset( $fbadmin );
	}
	unset( $id );

	// Clean up the referrer url for later use
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array(
			'nonce',
			'delfbadmin',
		), sanitize_text_field( $_SERVER['REQUEST_URI'] ) );
	}
}
elseif ( isset( $_GET['fbclearall'] ) ) {
	if ( wp_verify_nonce( $_GET['nonce'], 'fbclearall' ) != 1 ) {
		die( "I don't think that's really nice of you!." );
	}
	// Reset to defaults, don't unset as otherwise the old values will be retained
	$options['fb_admins']  = WPSEO_Options::get_default( 'wpseo_social', 'fb_admins' );
	$options['fbapps']     = WPSEO_Options::get_default( 'wpseo_social', 'fbapps' );
	$options['fbadminapp'] = WPSEO_Options::get_default( 'wpseo_social', 'fbadminapp' );
	update_option( 'wpseo_social', $options );
	add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully cleared all Facebook Data', 'wordpress-seo' ), 'updated' );

	// Clean up the referrer url for later use
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array(
			'nonce',
			'fbclearall',
		), sanitize_text_field( $_SERVER['REQUEST_URI'] ) );
	}
}
elseif ( isset( $_GET['key'] ) ) {
	if ( $_GET['key'] === $options['fbconnectkey'] ) {
		if ( isset( $_GET['userid'] ) ) {
			$user_id = sanitize_text_field( $_GET['userid'] );
			if ( ! isset( $options['fb_admins'][ $user_id ] ) ) {
				$options['fb_admins'][ $user_id ]['name'] = sanitize_text_field( urldecode( $_GET['userrealname'] ) );
				$options['fb_admins'][ $user_id ]['link'] = sanitize_text_field( urldecode( $_GET['link'] ) );
				update_option( 'wpseo_social', $options );
				add_settings_error( 'yoast_wpseo_social_options', 'success', sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . esc_url( $options['fb_admins'][ $user_id ]['link'] ) . '">' . esc_html( $options['fb_admins'][ $user_id ]['name'] ) . '</a>' ), 'updated' );
			}
			else {
				add_settings_error( 'yoast_wpseo_social_options', 'error', sprintf( __( '%s already exists as a Facebook Admin.', 'wordpress-seo' ), '<a href="' . esc_url( $options['fb_admins'][ $user_id ]['link'] ) . '">' . esc_html( $options['fb_admins'][ $user_id ]['name'] ) . '</a>' ), 'error' );
			}
			unset( $user_id );
		}
		elseif ( isset( $_GET['apps'] ) ) {
			$apps = json_decode( stripslashes( $_GET['apps'] ), true );
			if ( is_array( $apps ) && $apps !== array() ) {
				$options['fbapps'] = array( '0' => __( 'Do not use a Facebook App as Admin', 'wordpress-seo' ) );
				foreach ( $apps as $app ) {
					$options['fbapps'][ $app['app_id'] ] = $app['display_name'];
				}
				update_option( 'wpseo_social', $options );
				add_settings_error( 'yoast_wpseo_social_options', 'success', __( 'Successfully retrieved your apps from Facebook, now select an app to use as admin.', 'wordpress-seo' ), 'updated' );
			}
			else {
				add_settings_error( 'yoast_wpseo_social_options', 'error', __( 'Failed to retrieve your apps from Facebook.', 'wordpress-seo' ), 'error' );
			}
			unset( $apps, $app );
		}
	}

	// Clean up the referrer url for later use
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array(
			'key',
			'userid',
			'userrealname',
			'link',
			'apps',
		), sanitize_text_field( $_SERVER['REQUEST_URI'] ) );
	}
}

// Refresh option after updates
$options = get_option( 'wpseo_social' );

if ( is_array( $options['fb_admins'] ) && $options['fb_admins'] !== array() ) {
	$clearall = true;
}

if ( is_array( $options['fbapps'] ) && $options['fbapps'] !== array() ) {
	$clearall = true;
}

$app_button_text = __( 'Use a Facebook App as Admin', 'wordpress-seo' );
if ( is_array( $options['fbapps'] ) && $options['fbapps'] !== array() ) {
	// @todo [JRF => whomever] use WPSEO_Admin_Pages->select() method ?
	$fbconnect .= '
	<p>' . __( 'Select an app to use as Facebook admin:', 'wordpress-seo' ) . '</p>
	<select name="wpseo_social[fbadminapp]" id="fbadminapp">';

	foreach ( $options['fbapps'] as $id => $app ) {
		$fbconnect .= '
		<option value="' . esc_attr( $id ) . '" ' . selected( $id, $options['fbadminapp'], false ) . '>' . esc_attr( $app ) . '</option>';
	}
	$fbconnect .= '
	</select>
	<div class="clear"></div><br/>';

	$app_button_text = __( 'Update Facebook Apps', 'wordpress-seo' );
}

if ( $options['fbadminapp'] == 0 ) {
	$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
	$primary     = true;
	if ( is_array( $options['fb_admins'] ) && $options['fb_admins'] !== array() ) {
		$fbconnect .= '
	<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>
	<ul>';
		$nonce = wp_create_nonce( 'delfbadmin' );

		foreach ( $options['fb_admins'] as $admin_id => $admin ) {
			$admin_id = esc_attr( $admin_id );
			$fbconnect .= '
		<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a> - <strong><a href="' . esc_url( add_query_arg( array(
					'delfbadmin' => $admin_id,
					'nonce'      => $nonce,
				), admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">X</a></strong></li>';
		}
		$fbconnect .= '
	</ul>';
		$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
		$primary     = false;
	}
	$but_primary = '';
	if ( $primary ) {
		$but_primary = '-primary';
	}
	$fbbuttons[] = '
		<a class="button' . esc_attr( $but_primary ) . '" href="' . esc_url( 'https://yoast.com/fb-connect/?key=' . urlencode( $options['fbconnectkey'] ) . '&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . $button_text . '</a>';
}

$fbbuttons[] = '
		<a class="button" href="' . esc_url( 'https://yoast.com/fb-connect/?key=' . urlencode( $options['fbconnectkey'] ) . '&type=app&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . esc_html( $app_button_text ) . '</a>';

if ( $clearall ) {
	$fbbuttons[] = '
		<a class="button" href="' . esc_url( add_query_arg( array(
			'nonce'      => wp_create_nonce( 'fbclearall' ),
			'fbclearall' => 'true',
		), admin_url( 'admin.php?page=wpseo_social' ) ) ) . '">' . __( 'Clear all Facebook Data', 'wordpress-seo' ) . '</a> ';
}

if ( is_array( $fbbuttons ) && $fbbuttons !== array() ) {
	$fbconnect .= '
	<p class="fb-buttons">' . implode( '', $fbbuttons ) . '</p>';
}

$yform->admin_header( true, 'wpseo_social' );
?>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="accounts-tab" href="#top#accounts"><?php _e( 'Accounts', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="facebook-tab" href="#top#facebook"><span class="dashicons dashicons-facebook-alt"></span> <?php _e( 'Facebook', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="twitterbox-tab" href="#top#twitterbox"><span class="dashicons dashicons-twitter"></span> <?php _e( 'Twitter', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="pinterest-tab" href="#top#pinterest"><?php _e( 'Pinterest', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="google-tab" href="#top#google"><span class="dashicons dashicons-googleplus"></span> <?php _e( 'Google+', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="accounts" class="wpseotab">
		<p>
			<?php _e( 'To inform Google about your social profiles, we need to know their URLs.' ); ?>
			<?php _e( 'For each, pick the main account associated with this site and please enter them below:', 'wordpress-seo' ); ?>
		</p>
		<?php
		$yform->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ) );
		$yform->textinput( 'twitter_site', __( 'Twitter Username', 'wordpress-seo' ) );
		$yform->textinput( 'instagram_url', __( 'Instagram URL', 'wordpress-seo' ) );
		$yform->textinput( 'linkedin_url', __( 'LinkedIn URL', 'wordpress-seo' ) );
		$yform->textinput( 'myspace_url', __( 'MySpace URL', 'wordpress-seo' ) );
		$yform->textinput( 'pinterest_url', __( 'Pinterest URL', 'wordpress-seo' ) );
		$yform->textinput( 'youtube_url', __( 'YouTube URL', 'wordpress-seo' ) );
		$yform->textinput( 'google_plus_url', __( 'Google+ URL', 'wordpress-seo' ) );

		do_action( 'wpseo_admin_other_section' );
		?>
	</div>

	<div id="facebook" class="wpseotab">
		<p>
			<?php $yform->checkbox( 'opengraph', __( 'Add Open Graph meta data', 'wordpress-seo' ) ); ?>
		</p>

		<p class="desc">
			<?php _e( 'Add Open Graph meta data to your site\'s <code>&lt;head&gt;</code> section. You can specify some of the ID\'s that are sometimes needed below:', 'wordpress-seo' ); ?>
		</p>
		<?php
		echo $fbconnect;
		if ( 'posts' == get_option( 'show_on_front' ) ) {
			echo '<h4>' . esc_html__( 'Frontpage settings', 'wordpress-seo' ) . '</h4>';
			$yform->media_input( 'og_frontpage_image', __( 'Image URL', 'wordpress-seo' ) );
			$yform->textinput( 'og_frontpage_title', __( 'Title', 'wordpress-seo' ) );
			$yform->textinput( 'og_frontpage_desc', __( 'Description', 'wordpress-seo' ) );

			// Offer copying of meta description
			$meta_options = get_option( 'wpseo_titles' );
			echo '<input type="hidden" id="meta_description" value="' . $meta_options['metadesc-home-wpseo'] . '" />';
			echo '<p class="label desc" style="border:0;"><a href="javascript:;" onclick="copy_home_meta();" class="button">' . __( 'Copy home meta description', 'wordpress-seo' ) . '</a></p>';

			echo '<p class="desc label">' . esc_html__( 'These are the title, description and image used in the Open Graph meta tags on the front page of your site.', 'wordpress-seo' ) . '</p>';
		} ?>

		<h4><?php esc_html_e( 'Default settings', 'wordpress-seo' ); ?></h4>
		<?php $yform->media_input( 'og_default_image', __( 'Image URL', 'wordpress-seo' ) ); ?>
		<p class="desc label">
			<?php esc_html_e( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ); ?>
		</p>

		<?php do_action( 'wpseo_admin_opengraph_section' ); ?>
	</div>

	<div id="twitterbox" class="wpseotab">
		<p>
			<strong>
				<?php printf( esc_html__( 'Note that for the Twitter Cards to work, you have to check the box below and then validate your Twitter Cards through the %1$sTwitter Card Validator%2$s.', 'wordpress-seo' ), '<a target="_blank" href="https://dev.twitter.com/docs/cards/validation/validator">', '</a>' ); ?>
			</strong>
		</p>

		<p>
			<?php $yform->checkbox( 'twitter', __( 'Add Twitter card meta data', 'wordpress-seo' ) ); ?>
		</p>

		<p class="desc">
			<?php _e( 'Add Twitter card meta data to your site\'s <code>&lt;head&gt;</code> section.', 'wordpress-seo' ); ?>
		</p>
		<?php
		$yform->select( 'twitter_card_type', __( 'The default card type to use', 'wordpress-seo' ), WPSEO_Option_Social::$twitter_card_types );
		do_action( 'wpseo_admin_twitter_section' );
		?>
	</div>

	<div id="pinterest" class="wpseotab">
		<p>
			<?php _e( 'Pinterest uses Open Graph metadata just like Facebook, so be sure to keep the Open Graph checkbox on the Facebook tab checked if you want to optimize your site for Pinterest.', 'wordpress-seo' ); ?>
		</p>

		<?php $yform->textinput( 'pinterestverify', __( 'Pinterest verification', 'wordpress-seo' ) ); ?>
		<p class="desc label">
			<?php printf( __( 'To %1$sverify your site with Pinterest%2$s, add the meta tag here', 'wordpress-seo' ), '<a target="_blank" href="https://help.pinterest.com/en/articles/verify-your-website#meta_tag">', '</a>' ); ?>
		</p>

		<?php
		do_action( 'wpseo_admin_pinterest_section' );
		?>
	</div>

	<div id="google" class="wpseotab">
		<p>
			<?php $yform->checkbox( 'googleplus', __( 'Add Google+ specific post meta data', 'wordpress-seo' ) ); ?>
		</p>

		<?php $yform->textinput( 'plus-publisher', __( 'Google Publisher Page', 'wordpress-seo' ) ); ?>
		<p class="desc label"><?php esc_html_e( 'If you have a Google+ page for your business, add that URL here and link it on your Google+ page\'s about page.', 'wordpress-seo' ); ?></p>

		<?php do_action( 'wpseo_admin_googleplus_section' ); ?>
	</div>

<?php
$yform->admin_footer();
