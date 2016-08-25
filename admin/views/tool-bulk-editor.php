<?php
/**
 * @package WPSEO\Admin
 * @since      1.5.0
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$options = get_option( 'wpseo' );

$wpseo_bulk_titles_table      = new WPSEO_Bulk_Title_Editor_List_Table();
$wpseo_bulk_description_table = new WPSEO_Bulk_Description_List_Table();

get_current_screen()->set_screen_reader_content( array(
	'heading_views'      => __( 'Filter posts list' ),
	'heading_pagination' => __( 'Posts list navigation' ),
	'heading_list'       => __( 'Posts list' ),
) );

// If type is empty, fill it with value of first tab (title).
$_GET['type'] = ( ! empty( $_GET['type'] ) ) ? $_GET['type'] : 'title';

if ( ! empty( $_REQUEST['_wp_http_referer'] ) ) {
	wp_redirect( remove_query_arg( array( '_wp_http_referer', '_wpnonce' ), stripslashes( $_SERVER['REQUEST_URI'] ) ) );
	exit;
}
?>
<script>
	var wpseo_bulk_editor_nonce = '<?php echo wp_create_nonce( 'wpseo-bulk-editor' ); ?>';
</script>

<div class="wrap wpseo_table_page">

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="title-tab" href="#top#title"><?php _e( 'Title', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="description-tab"
		   href="#top#description"><?php _e( 'Description', 'wordpress-seo' ); ?></a>
	</h2>

	<div class="tabwrapper">
		<div id="title" class="wpseotab">
			<?php

			$tab_video_url = 'https://yoa.st/screencast-tools-bulk-editor';
			include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';

			$wpseo_bulk_titles_table->show_page();

			?>
		</div>
		<div id="description" class="wpseotab">
			<?php

			$tab_video_url = 'https://yoa.st/screencast-tools-bulk-editor';
			include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';

			$wpseo_bulk_description_table->show_page();

			?>
		</div>

	</div>
</div>
