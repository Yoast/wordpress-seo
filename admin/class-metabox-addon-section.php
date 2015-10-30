<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generates and displays a section containing metabox tabs that have been added by other plugins through the
 * `wpseo_tab_header` and `wpseo_tab_content` actions.
 */
class WPSEO_Metabox_Addon_Section extends WPSEO_Metabox_Section {

	/**
	 * Applies the actions for adding a tab to the metabox.
	 */
	public function display_content() {
		?>
		<div id="wpseo-meta-section-addons" class="wpseo-meta-section">
			<div class="wpseo-metabox-tabs-div" >
				<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs">
					<?php do_action( 'wpseo_tab_header' ); ?>
				</ul>
			</div>
			<?php do_action( 'wpseo_tab_content' ); ?>
		</div>
	<?php
	}

	/**
	 * `WPSEO_Metabox_Addon_Section` always has "tabs", represented by registered actions. If this is not the case,
	 * it should not be instantiated.
	 *
	 * @return bool
	 */
	protected function has_tabs() {
		return true;
	}
}
