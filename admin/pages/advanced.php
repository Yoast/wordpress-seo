<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$active_tab = filter_input( INPUT_GET, 'tab' );

$tabs = new WPSEO_Option_Tabs( 'advanced', 'breadcrumbs' );
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'breadcrumbs',
		__( 'Breadcrumbs', 'wordpress-seo' ),
		array(
			'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-breadcrumbs' ),
			'opt_group' => 'wpseo_internallinks',
		)
	)
);
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'permalinks',
		__( 'Permalinks', 'wordpress-seo' ),
		array(
			'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-permalinks' ),
			'opt_group' => 'wpseo_permalinks',
		)
	)
);
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'rss',
		__( 'RSS', 'wordpress-seo' ),
		array(
			'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-rss' ),
			'opt_group' => 'wpseo_rss',
		)
	)
);

$active_tab = $tabs->get_active_tab();
Yoast_Form::get_instance()->admin_header( true, $active_tab->get_opt_group() );

echo '<h2 class="nav-tab-wrapper">';
foreach ( $tabs->get_tabs() as $tab ) {
	$active = ( $tabs->is_active_tab( $tab ) ) ? ' nav-tab-active' : '';
	echo '<a class="nav-tab' . $active . '" id="' . $tab->get_name() . '-tab" href="' . esc_url( admin_url( 'admin.php?page=wpseo_advanced&tab=' . $tab->get_name() ) ) . '">' . $tab->get_label() . '</a>';
}
echo '</h2>';

$help_center = new WPSEO_Help_Center( '', $tabs, WPSEO_Utils::is_yoast_seo_premium() );
$help_center->localize_data();
$help_center->mount();

require_once WPSEO_PATH . 'admin/views/tabs/advanced/' . $active_tab->get_name() . '.php';

Yoast_Form::get_instance()->admin_footer();
