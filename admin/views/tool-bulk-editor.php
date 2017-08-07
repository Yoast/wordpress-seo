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
	'heading_views'      => __( 'Filter posts list', 'wordpress-seo' ),
	'heading_pagination' => __( 'Posts list navigation', 'wordpress-seo' ),
	'heading_list'       => __( 'Posts list', 'wordpress-seo' ),
) );

// If type is empty, fill it with value of first tab (title).
$_GET['type'] = ( ! empty( $_GET['type'] ) ) ? $_GET['type'] : 'title';

if ( ! empty( $_REQUEST['_wp_http_referer'] ) ) {
	wp_redirect( remove_query_arg( array( '_wp_http_referer', '_wpnonce' ), stripslashes( $_SERVER['REQUEST_URI'] ) ) );
	exit;
}

/**
 * Outputs a help center.
 *
 * @param string $id The id for the tab.
 */
function render_help_center( $id ) {
	$helpcenter_tab = new WPSEO_Option_Tab( 'bulk-' . $id, __( 'Bulk editor', 'wordpress-seo' ),
		array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-bulk-editor' ) ) );

	$helpcenter = new WPSEO_Help_Center( 'bulk-editor' . $id, $helpcenter_tab );
	$helpcenter->output_help_center();
}

/**
 * Renders a bulk editor tab.
 *
 * @param WPSEO_Bulk_List_Table $table The table to render.
 * @param string                $id    The id for the tab.
 */
function get_rendered_tab( $table, $id ) {
	?>
	<div id="<?php echo $id ?>" class="wpseotab">
		<?php
		render_help_center( $id );
		$table->show_page();
		?>
	</div>
	<?php
}

?>
<script>
	var wpseoBulkEditorNonce = '<?php echo wp_create_nonce( 'wpseo-bulk-editor' ); ?>';

	// eslint-disable-next-line
	var wpseo_bulk_editor_nonce = wpseoBulkEditorNonce;
</script>

<br/><br/>

<div class="wpseo_table_page">

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="title-tab" href="#top#title"><?php _e( 'Title', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="description-tab"
		   href="#top#description"><?php _e( 'Description', 'wordpress-seo' ); ?></a>
	</h2>

	<div class="tabwrapper">
		<?php get_rendered_tab( $wpseo_bulk_titles_table, 'title' )?>
		<?php get_rendered_tab( $wpseo_bulk_description_table, 'description' )?>
	</div>
</div>
