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
	$possible_params = [
		'type',
		'paged',
		'post_type_filter',
		'post_status',
		'order',
		'orderby',
	];

	$input_get = [];
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

$yoast_bulk_editor_arguments = [
	'input_fields' => $yoast_free_input_fields,
	'nonce'        => wp_create_nonce( 'bulk-editor-table' ),
];

$wpseo_bulk_titles_table      = new WPSEO_Bulk_Title_Editor_List_Table( $yoast_bulk_editor_arguments );
$wpseo_bulk_description_table = new WPSEO_Bulk_Description_List_Table( $yoast_bulk_editor_arguments );

$yoast_free_screen_reader_content = [
	'heading_views'      => __( 'Filter posts list', 'wordpress-seo' ),
	'heading_pagination' => __( 'Posts list navigation', 'wordpress-seo' ),
	'heading_list'       => __( 'Posts list', 'wordpress-seo' ),
];
get_current_screen()->set_screen_reader_content( $yoast_free_screen_reader_content );

if ( ! empty( $_REQUEST['_wp_http_referer'] ) && isset( $_SERVER['REQUEST_URI'] ) ) {
	$request_uri = sanitize_file_name( wp_unslash( $_SERVER['REQUEST_URI'] ) );

	wp_redirect(
		remove_query_arg(
			[ '_wp_http_referer', '_wpnonce' ],
			$request_uri
		)
	);
	exit;
}

?>
<script>
	// phpcs:ignore WordPress.Security.OutputEscaping -- WPSEO_Utils::format_json_encode is safe.
	var wpseoBulkEditorNonce = <?php echo WPSEO_Utils::format_json_encode( wp_create_nonce( 'wpseo-bulk-editor' ) ); ?>;

	// eslint-disable-next-line
	var wpseo_bulk_editor_nonce = wpseoBulkEditorNonce;
</script>

<div class="wpseo_table_page">

<?php

$tabs = [
	'title'       => [
		'label' => __( 'Title', 'wordpress-seo' ),
	],
	'description' => [
		'label' => __( 'Description', 'wordpress-seo' ),
	],
];

$title_collapsible = new WPSEO_Collapsible_Presenter(
	__( 'Title', 'wordpress-seo' ),
	WPSEO_PATH . 'admin/views/tabs/tool/bulk-editor-table.php',
	[
		'paper_id'  => 'bulk_editor_title',
		'expanded'  => false,
		'class'     => 'yoast-full-width',
		'view_data' => [
			'table'          => $wpseo_bulk_titles_table,
			'collapsible_id' => 'bulk_editor_title',
		],
	]
);
echo $title_collapsible->get_output();

$description_collapsible = new WPSEO_Collapsible_Presenter(
	__( 'Description', 'wordpress-seo' ),
	WPSEO_PATH . 'admin/views/tabs/tool/bulk-editor-table.php',
	[
		'paper_id'  => 'bulk_editor_description',
		'expanded'  => false,
		'class'     => 'yoast-full-width',
		'view_data' => [
			'table'          => $wpseo_bulk_description_table,
			'collapsible_id' => 'bulk_editor_description',
		],
	]
);
echo $description_collapsible->get_output();

echo '</div>';
