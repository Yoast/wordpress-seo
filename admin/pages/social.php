<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_social' );

$tabs = array(
	'accounts'   => array(
		'label'                => __( 'Accounts', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-social-accounts',
	),
	'facebook'   => array(
		'label'                => __( 'Facebook', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-social-facebook',
	),
	'twitterbox' => array(
		'label'                => __( 'Twitter', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-social-twitter',
	),
	'pinterest'  => array(
		'label'                => __( 'Pinterest', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-social-pinterest',
	),
	'google'     => array(
		'label'                => __( 'Google+', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-social-google',
	),
);



?>
	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php foreach ( $tabs as $identifier => $tab ) : ?>
		<a class="nav-tab" id="<?php echo $identifier; ?>-tab" href="#top#<?php echo $identifier; ?>"><?php echo $tab['label']; ?></a>
		<?php endforeach; ?>
	</h2>
<?php

foreach ( $tabs as $identifier => $tab ) {

	printf( '<div id="%s" class="wpseotab">', $identifier );

	if ( ! empty( $tab['screencast_video_url'] ) ) {
		$tab_video_url = $tab['screencast_video_url'];
		include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
	}

	require_once WPSEO_PATH . 'admin/views/tabs/social/' . $identifier . '.php';

	echo '</div>';
}

$yform->admin_footer();
