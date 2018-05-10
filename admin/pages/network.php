<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

function wpseo_ms_get_site_dropdown_choices( $include_empty = false ) {
	$choices = array();

	if ( $include_empty ) {
		$choices['-'] = __( 'None', 'wordpress-seo' );
	}

	$available_states = array(
		'public'   => __( 'public', 'wordpress-seo' ),
		'archived' => __( 'archived', 'wordpress-seo' ),
		'mature'   => __( 'mature', 'wordpress-seo' ),
		'spam'     => __( 'spam', 'wordpress-seo' ),
	);

	$sites = get_sites( array( 'deleted' => 0 ) );
	foreach ( $sites as $site ) {
		$choices[ $site->blog_id ] = $site->blog_id . ': ' . $site->domain;

		$site_states = array();
		foreach ( $available_states as $state_slug => $state_label ) {
			if ( $site->$state_slug === '1' ) {
				$site_states[] = $state_label;
			}
		}

		if ( ! empty( $site_states ) ) {
			$choices[ $site->blog_id ] .= ' [' . implode( ', ', $site_states ) . ']';
		}
	}

	return $choices;
}

function wpseo_ms_maybe_restore_site() {
	if ( isset( $_POST['wpseo_restore_blog'] ) ) {
		check_admin_referer( 'wpseo-network-restore' );
		if ( isset( $_POST['wpseo_ms']['restoreblog'] ) && is_numeric( $_POST['wpseo_ms']['restoreblog'] ) ) {
			$restoreblog = (int) WPSEO_Utils::validate_int( $_POST['wpseo_ms']['restoreblog'] );
			$blog        = get_blog_details( $restoreblog );

			if ( $blog ) {
				WPSEO_Options::reset_ms_blog( $restoreblog );
				/* translators: %s expands to the name of a blog within a multi-site network. */
				add_settings_error( 'wpseo_ms', 'settings_updated', sprintf( __( '%s restored to default SEO settings.', 'wordpress-seo' ), esc_html( $blog->blogname ) ), 'updated' );
			}
			else {
				/* translators: %s expands to the ID of a blog within a multi-site network. */
				add_settings_error( 'wpseo_ms', 'settings_updated', sprintf( __( 'Blog %s not found.', 'wordpress-seo' ), esc_html( $restoreblog ) ), 'error' );
			}
			unset( $restoreblog, $blog );
		}
	}
}

function wpseo_ms_print_restore_form() {
	$yform = Yoast_Form::get_instance();

	echo '<h2>' . esc_html__( 'Restore site to default settings', 'wordpress-seo' ) . '</h2>';
	echo '<form method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
	wp_nonce_field( 'wpseo-network-restore', '_wpnonce', true, true );
	echo '<p>' . esc_html__( 'Using this form you can reset a site to the default SEO settings.', 'wordpress-seo' ) . '</p>';

	if ( get_blog_count() <= 100 ) {
		$yform->select(
			'restoreblog',
			__( 'Site ID', 'wordpress-seo' ),
			wpseo_ms_get_site_dropdown_choices(),
			'wpseo_ms'
		);
	}
	else {
		$yform->textinput( 'restoreblog', __( 'Blog ID', 'wordpress-seo' ), 'wpseo_ms' );
	}

	echo '<input type="submit" name="wpseo_restore_blog" value="' . esc_attr__( 'Restore site to defaults', 'wordpress-seo' ) . '" class="button"/>';
	echo '</form>';
}

wpseo_ms_maybe_restore_site();
add_action( 'wpseo_admin_footer', 'wpseo_ms_print_restore_form' );

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_ms' );

/* {@internal Important: Make sure the options added to the array here are in line with the options set in the WPSEO_Option_MS::$allowed_access_options property.}} */
$yform->select(
	'access',
	/* translators: %1$s expands to Yoast SEO */
	sprintf( __( 'Who should have access to the %1$s settings', 'wordpress-seo' ), 'Yoast SEO' ),
	array(
		'admin'      => __( 'Site Admins (default)', 'wordpress-seo' ),
		'superadmin' => __( 'Super Admins only', 'wordpress-seo' ),
	),
	'wpseo_ms'
);

if ( get_blog_count() <= 100 ) {
	$yform->select(
		'defaultblog',
		__( 'New sites in the network inherit their SEO settings from this site', 'wordpress-seo' ),
		wpseo_ms_get_site_dropdown_choices( true ),
		'wpseo_ms'
	);
	echo '<p>' . esc_html__( 'Choose the site whose settings you want to use as default for all sites that are added to your network. If you choose \'None\', the normal plugin defaults will be used.', 'wordpress-seo' ) . '</p>';
}
else {
	$yform->textinput( 'defaultblog', __( 'New sites in the network inherit their SEO settings from this site', 'wordpress-seo' ), 'wpseo_ms' );
	echo '<p>';
	printf(
		/* translators: 1: link open tag; 2: link close tag. */
		esc_html__( 'Enter the %1$sSite ID%2$s for the site whose settings you want to use as default for all sites that are added to your network. Leave empty for none (i.e. the normal plugin defaults will be used).', 'wordpress-seo' ),
		'<a href="' . esc_url( network_admin_url( 'sites.php' ) ) . '">',
		'</a>'
	);
	echo '</p>';
}
	echo '<p><strong>' . esc_html__( 'Take note:', 'wordpress-seo' ) . '</strong> ' . esc_html__( 'Privacy sensitive (FB admins and such), theme specific (title rewrite) and a few very site specific settings will not be imported to new blogs.', 'wordpress-seo' ) . '</p>';

$yform->admin_footer( true );
