<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! function_exists( 'wpseo_get_rendered_tab' ) ) {
	/**
	 * Renders a bulk editor tab.
	 *
	 * @param WPSEO_Bulk_List_Table $table The table to render.
	 * @param string                $id    The id for the tab.
	 */
	function wpseo_get_rendered_tab( $table, $id ) {
		?>
		<div id="<?php echo esc_attr( $id ); ?>">
			<?php
			$table->show_page();
			?>
		</div>
		<?php
	}
}

wpseo_get_rendered_tab( $table, $collapsible_id );
