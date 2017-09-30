<?php

class WPSEO_Help_Center_Data_Localizer {
	public function localize( WPSEO_Option_Tabs $option_tabs ) {
		$tabs = $option_tabs->get_tabs();

		$data = $this->format_data( $tabs, $option_tabs->get_base() );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'help-center', 'wpseoHelpCenterData', $data );
	}

	protected function format_data( $tabs, $initial_tab ) {
		$formatted_tabs = array();

		$formatted_tabs[ 'tabs' ] = array();

		foreach( $tabs as $tab ) {
			$formatted_tabs[ 'tabs' ][ $tab->get_name() ] = array(
				'label' => $tab->get_label(),
				'videoUrl' => $tab->get_video_url(),
				'id' => $tab->get_name(),
			);
		}

		$formatted_tabs[ 'initialTab' ] = $initial_tab;

		// Will translate to either empty string or "1" in localised script.
		$formatted_tabs[ 'isPremium' ] = WPSEO_Utils::is_yoast_seo_premium();
		$formatted_tabs[ 'pluginVersion' ] = WPSEO_VERSION;

		return $formatted_tabs;
	}
}