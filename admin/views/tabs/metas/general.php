<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! current_theme_supports( 'title-tag' ) ) {
	$yform->light_switch( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
	echo '<p class="description">', sprintf( __( '%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ), 'Yoast SEO' ) . '</p>';
}

?>
<table class="form-table">
	<tr>
		<th>
			<?php _e( 'Title Separator', 'wordpress-seo' ); ?>
		</th>
		<td>
			<?php
			$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options(), '' );
			echo '<p class="description">', __( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name.', 'wordpress-seo' ), ' ', __( 'Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ), '</p>';
			?>
		</td>
	</tr>
</table>

<?php
echo '<h2>' . __( 'Enabled analysis', 'wordpress-seo' ) . '</h2>';

$yform->light_switch( 'content-analysis-active', __( 'Content analysis', 'wordpress-seo' ) );
echo '<p class="description">', __( 'Removes the content tab from the metabox and disables all content-related suggestions.', 'wordpress-seo' ) . '</p>';
