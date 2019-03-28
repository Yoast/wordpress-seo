<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   1.5.0
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Sanitizes the parameters that have been sent.
 *
 * @return array The sanitized fields.
 */
function yoast_free_bulk_sanitize_input_fields() {
	$possible_params = array(
		'type',
		'paged',
		'post_type_filter',
		'post_status',
		'order',
		'orderby',
	);

	$input_get = array();
	foreach ( $possible_params as $param_name ) {
		if ( isset( $_GET[ $param_name ] ) ) {
			$input_get[ $param_name ] = sanitize_text_field( wp_unslash( $_GET[ $param_name ] ) );
		}
	}

	return $input_get;
}

$yoast_free_input_fields = yoast_free_bulk_sanitize_input_fields();

// Verifies the nonce.
if ( ! empty( $yoast_free_input_fields ) ) {
	check_admin_referer( 'bulk-editor-table', 'nonce' );
}

// If type is empty, fill it with value of first tab (title).
if ( ! isset( $yoast_free_input_fields['type'] ) ) {
	$yoast_free_input_fields['type'] = 'title';
}

$yoast_bulk_editor_arguments = array(
	'input_fields' => $yoast_free_input_fields,
	'nonce'        => wp_create_nonce( 'bulk-editor-table' ),
);

$wpseo_bulk_titles_table      = new WPSEO_Bulk_Title_Editor_List_Table( $yoast_bulk_editor_arguments );
$wpseo_bulk_description_table = new WPSEO_Bulk_Description_List_Table( $yoast_bulk_editor_arguments );

$yoast_free_screen_reader_content = array(
	'heading_views'      => __( 'Filter posts list', 'wordpress-seo' ),
	'heading_pagination' => __( 'Posts list navigation', 'wordpress-seo' ),
	'heading_list'       => __( 'Posts list', 'wordpress-seo' ),
);
get_current_screen()->set_screen_reader_content( $yoast_free_screen_reader_content );

if ( ! empty( $_REQUEST['_wp_http_referer'] ) && isset( $_SERVER['REQUEST_URI'] ) ) {
	$request_uri = sanitize_file_name( wp_unslash( $_SERVER['REQUEST_URI'] ) );

	wp_redirect(
		remove_query_arg(
			array( '_wp_http_referer', '_wpnonce' ),
			$request_uri
		)
	);
	exit;
}

/**
 * Outputs a help center.
 */
function wpseo_render_help_center() {
	$tabs = new WPSEO_Option_Tabs( '', '' );

	$bulk_editor_tab_title = new WPSEO_Option_Tab(
		'title',
		__( 'Bulk editor', 'wordpress-seo' ),
		array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-bulk-editor' ) )
	);
	$tabs->add_tab( $bulk_editor_tab_title );

	$bulk_editor_tab_description = new WPSEO_Option_Tab(
		'description',
		__( 'Bulk editor', 'wordpress-seo' ),
		array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-bulk-editor' ) )
	);
	$tabs->add_tab( $bulk_editor_tab_description );

	$helpcenter = new WPSEO_Help_Center( '', $tabs, WPSEO_Utils::is_yoast_seo_premium() );
	$helpcenter->localize_data();
	$helpcenter->mount();
}

/**
 * Renders a bulk editor tab.
 *
 * @param WPSEO_Bulk_List_Table $table The table to render.
 * @param string                $id    The id for the tab.
 */
function wpseo_get_rendered_tab( $table, $id ) {
	?>
	<div id="<?php echo esc_attr( $id ); ?>" class="wpseotab">
		<?php
		$table->show_page();
		?>
	</div>
	<?php
}

?>
<script>
	var wpseoBulkEditorNonce = <?php echo WPSEO_Utils::format_json_encode( wp_create_nonce( 'wpseo-bulk-editor' ) ); ?>;

	// eslint-disable-next-line
	var wpseo_bulk_editor_nonce = wpseoBulkEditorNonce;
</script>

<br/><br/>

<div class="wpseo_table_page">

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="title-tab" href="#top#title"><?php esc_html_e( 'Title', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="description-tab"
			href="#top#description"><?php esc_html_e( 'Description', 'wordpress-seo' ); ?></a>
	</h2>

	<?php wpseo_render_help_center(); ?>

	<div class="tabwrapper">
		<?php wpseo_get_rendered_tab( $wpseo_bulk_titles_table, 'title' ); ?>
		<?php wpseo_get_rendered_tab( $wpseo_bulk_description_table, 'description' ); ?>
	</div>
</div>
