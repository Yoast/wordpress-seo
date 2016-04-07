<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$options = WPSEO_Options::get_options( array( 'wpseo_titles', 'wpseo_permalinks', 'wpseo_internallinks' ) );


$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );

$tabs = array(
	'general'    => array(
		'label'                => __( 'General', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas',
	),
	'home'       => array(
		'label'                => __( 'Homepage', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas-homepage',
	),
	'post-types' => array(
		'label'                => __( 'Post Types', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas-post-types',
	),
	'taxonomies' => array(
		'label'                => __( 'Taxonomies', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas-taxonomies',
	),
	'archives'   => array(
		'label'                => __( 'Archives', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas-archives',
	),
	'other'      => array(
		'label'                => __( 'Other', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-metas-other',
	),
);

?>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php
		foreach ( $tabs as $identifier => $tab ) :
			?>
			<a class="nav-tab" id="<?php echo $identifier; ?>-tab"
			   href="#top#<?php echo $identifier; ?>"><?php echo $tab['label']; ?></a>
			<?php
		endforeach;
		?>
	</h2>

	<div class="tabwrapper">
		<?php

		foreach ( $tabs as $identifier => $tab ) {

			printf( '<div id="%s" class="wpseotab">', $identifier );

			if ( ! empty( $tab['screencast_video_url'] ) ) {
				$tab_video_url = $tab['screencast_video_url'];
				include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
			}

			require_once WPSEO_PATH . 'admin/views/tabs/metas/' . $identifier . '.php';

			echo '</div>';
		}

		?>
	</div>
<?php
$yform->admin_footer();
