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
	array(
		'off' => array(
			'text' => __( 'Enabled', 'wordpress-seo' ),
			'screen_reader_text' => sprintf(
				'(%s)',
				__( 'author / user sitemap', 'wordpress-seo' )
			),
		),
		'on' => array(
			'text' => __( 'Disabled', 'wordpress-seo' ),
			'screen_reader_text' => sprintf(
				'(%s)',
				__( 'author / user sitemap', 'wordpress-seo' )
			),
		),
	),
	__( 'Author / user sitemap', 'wordpress-seo' )
);

printf(
	'<p class="expl">%s</p>',
	esc_html__( 'The user sitemap contains the author archive URLs for every user on your site.', 'wordpress-seo' )
);

echo '<div id="xml_user_block">';

$yform->toggle_switch(
	'disable_author_noposts',
	array(
		'off' => array(
			'text' => __( 'In sitemap', 'wordpress-seo' ),
			'screen_reader_text' => sprintf(
				'(%s)',
				__( 'Users without posts', 'wordpress-seo' )
			),
		),
		'on'  => array(
			'text' => __( 'Not in sitemap', 'wordpress-seo' ),
			'screen_reader_text' => sprintf(
				'(%s)',
				__( 'Users without posts', 'wordpress-seo' )
			),
		),
	),
	__( 'Users without posts', 'wordpress-seo' )
);

printf(
	'<p class="expl">%s</p>',
	esc_html__( 'You can choose to not include users without posts.', 'wordpress-seo' )
);

$roles = WPSEO_Utils::get_roles();
unset( $roles['subscriber'] );
if ( is_array( $roles ) && $roles !== array() ) {
	echo '<h2>' . esc_html__( 'Filter specific user roles', 'wordpress-seo' ) . '</h2>';
	foreach ( $roles as $role_key => $role_name ) {
		$yform->toggle_switch(
			'user_role-' . $role_key . '-not_in_sitemap',
			array(
				'off' => array(
					'text' => __( 'In sitemap', 'wordpress-seo' ),
					'screen_reader_text' => sprintf(
						'(%s)',
						$role_name
					),
				),
				'on'  => array(
					'text' => __( 'Not in sitemap', 'wordpress-seo' ),
					'screen_reader_text' => sprintf(
						'(%s)',
						$role_name
					),
				),
			),
			$role_name
		);
	}
}

echo '</div>';
