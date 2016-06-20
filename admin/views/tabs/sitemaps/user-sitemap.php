<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'User sitemap settings', 'wordpress-seo' ) . '</h2>';

$yform->toggle_switch(
	'disable_author_sitemap',
	array( 'off' => __( 'Enabled', 'wordpress-seo' ), 'on' => __( 'Disabled', 'wordpress-seo' ) ),
	__( 'Author / user sitemap', 'wordpress-seo' )
);

printf( '<p class="expl">%s</p>', __( 'The user sitemap contains the author archive URLs for every user on your site.', 'wordpress-seo' ) );

echo '<div id="xml_user_block">';

$switch_values = array(
	'off' => __( 'In sitemap', 'wordpress-seo' ),
	'on'  => __( 'Not in sitemap', 'wordpress-seo' ),
);
$yform->toggle_switch( 'disable_author_noposts', $switch_values, __( 'Users without posts', 'wordpress-seo' ) );

printf( '<p class="expl">%s</p>', __( 'You can choose to not include users without posts.', 'wordpress-seo' ) );

$roles = WPSEO_Utils::get_roles();
unset( $roles['subscriber'] );
if ( is_array( $roles ) && $roles !== array() ) {
	echo '<h2>' . esc_html__( 'Filter specific user roles', 'wordpress-seo' ) . '</h2>';
	foreach ( $roles as $role_key => $role_name ) {
		$yform->toggle_switch( 'user_role-' . $role_key . '-not_in_sitemap', $switch_values, $role_name );
	}
}

echo '</div>';
