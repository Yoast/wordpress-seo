<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Rss
 *
 * @uses Yoast_Form $yform Form object.
 */

$textarea_atts = [
	'cols' => '50',
	'rows' => '5',
];
$yform->textarea( 'rssbefore', __( 'Content to put before each post in the feed', 'wordpress-seo' ), $textarea_atts );
$yform->textarea( 'rssafter', __( 'Content to put after each post in the feed', 'wordpress-seo' ), $textarea_atts );

// @todo Replace the URL below once the article is written.
$rss_variables_help = new WPSEO_Admin_Help_Button(
	'search-appearance-rss-variables',
	__( 'Learn more about the available variables', 'wordpress-seo' )
);

echo '<h2 class="help-button-inline">' . esc_html__( 'Available variables', 'wordpress-seo' ) . $rss_variables_help . '</h2>';
?>
<table class="wpseo yoast_help yoast-table-scrollable">
	<thead>
	<tr>
		<th scope="col"><?php esc_html_e( 'Variable', 'wordpress-seo' ); ?></th>
		<th scope="col"><?php esc_html_e( 'Description', 'wordpress-seo' ); ?></th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td class="yoast-variable-name">%%AUTHORLINK%%</td>
		<td class="yoast-variable-desc"><?php esc_html_e( 'A link to the archive for the post author, with the authors name as anchor text.', 'wordpress-seo' ); ?></td>
	</tr>
	<tr>
		<td class="yoast-variable-name">%%POSTLINK%%</td>
		<td class="yoast-variable-desc"><?php esc_html_e( 'A link to the post, with the title as anchor text.', 'wordpress-seo' ); ?></td>
	</tr>
	<tr>
		<td class="yoast-variable-name">%%BLOGLINK%%</td>
		<td class="yoast-variable-desc"><?php esc_html_e( "A link to your site, with your site's name as anchor text.", 'wordpress-seo' ); ?></td>
	</tr>
	<tr>
		<td class="yoast-variable-name">%%BLOGDESCLINK%%</td>
		<td class="yoast-variable-desc"><?php esc_html_e( "A link to your site, with your site's name and description as anchor text.", 'wordpress-seo' ); ?></td>
	</tr>
	</tbody>
</table>
