<?php
/**
 * @package WPSEO\Admin
 */

/**
 * @todo - [JRF => whomever] check for other sitemap plugins which may conflict ?
 * @todo - [JRF => whomever] check for existance of .xls rewrite rule in .htaccess from
 * google-sitemaps-plugin/generator and remove as it will cause errors for our sitemaps
 * (or inform the user and disallow enabling of sitemaps )
 * @todo - [JRF => whomever] check if anything along these lines is already being done
 */


if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_xml' );

$options = get_option( 'wpseo_xml' );

echo '<br/>';

$yform->light_switch( 'enablexmlsitemap', __( 'XML sitemap functionality', 'wordpress-seo' ) );

$tabs = array(
	'general'      => array(
		'label'                => __( 'General', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-sitemaps',
	),
	'user-sitemap' => array(
		'label'                => __( 'User sitemap', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-sitemaps-user-sitemap',
	),
	'post-types'   => array(
		'label'                => __( 'Post Types', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-sitemaps-post-types',
	),
	'exclude-post' => array(
		'label'                => __( 'Excluded Posts', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-sitemaps-exclude-post',
	),
	'taxonomies'   => array(
		'label'                => __( 'Taxonomies', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-sitemaps-taxonomies',
	),
);

?>
	<div id="sitemapinfo">
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<?php foreach ( $tabs as $identifer => $tab ) : ?>
				<a class="nav-tab" id="<?php echo $identifer; ?>-tab"
				   href="#top#<?php echo $identifer; ?>"><?php echo $tab['label']; ?></a>
			<?php endforeach; ?>
		</h2>

		<?php

		foreach ( $tabs as $identifier => $tab ) {

			printf( '<div id="%s" class="wpseotab">', $identifier );

			if ( ! empty( $tab['screencast_video_url'] ) ) {
				$tab_video_url = $tab['screencast_video_url'];
				include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
			}

			require_once WPSEO_PATH . 'admin/views/tabs/sitemaps/' . $identifier . '.php';

			echo '</div>';
		}

		?>
	</div>
<?php

/**
 * Fires at the end of XML Sitemaps configuration form.
 */
do_action( 'wpseo_xmlsitemaps_config' );

$yform->admin_footer();
