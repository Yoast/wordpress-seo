<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays a section containing metabox tabs that have been added by other plugins through the
 * `wpseo_tab_header` and `wpseo_tab_content` actions.
 *
 * @deprecated 11.9
 */
class WPSEO_Metabox_Addon_Tab_Section extends WPSEO_Metabox_Tab_Section {

	/**
	 * WPSEO_Metabox_Addon_Tab_Section constructor.
	 *
	 * @deprecated 11.9
	 *
	 * @param string $name         The name of the section, used as an identifier in the html.
	 *                             Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param array  $tabs         The metabox tabs (`WPSEO_Metabox_Tabs[]`) to be included in the section.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $tabs = array(), array $options = array() ) {
		_deprecated_constructor( 'WPSEO_Metabox_Addon_Tab_Section', '11.9' );
		parent::__construct( $name, $link_content, $tabs, $options );
	}

	/**
	 * Applies the actions for adding a tab to the metabox.
	 *
	 * @deprecated 11.9
	 */
	public function display_content() {
		_deprecated_function( __METHOD__, '11.9' );
		?>
		<div role="tabpanel" id="wpseo-meta-section-addons" aria-labelledby="wpseo-meta-tab-addons" tabindex="0" class="wpseo-meta-section">
			<div class="wpseo-metabox-tabs-div">
				<ul class="wpseo-metabox-tabs">
					<?php
					// @deprecated 11.9 This functionality has been replaced by the filter: `yoast_free_additional_metabox_sections`.
					do_action_deprecated( 'wpseo_tab_header', array(), '11.9' );
					?>
				</ul>
				<?php
				// @deprecated 11.9 This functionality has been replaced by the filter: `yoast_free_additional_metabox_sections`.
				do_action_deprecated( 'wpseo_tab_content', array(), '11.9' );
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * `WPSEO_Metabox_Addon_Section` always has "sections", represented by registered actions. If this is not the case,
	 * it should not be instantiated.
	 *
	 * @deprecated 11.9
	 *
	 * @return bool
	 */
	protected function has_sections() {
		_deprecated_function( __METHOD__, '11.9' );
		return true;
	}
}
