<?php

class WPSEO_Option_Tabs_Data_Localizer {
	public function localize( WPSEO_Option_Tabs $option_tabs ) {
		$tabs = $option_tabs->get_tabs();

		$data = $this->format_data( $tabs );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'help-center', 'wpseoOptionTabData', $data );
	}

	protected function format_data( $tabs ) {
		$formatted_tabs = array();

		foreach( $tabs as $tab ) {
			$formatted_tabs[ $tab->get_name() ] = array(
				'label' => $tab->get_label(),
				'video_url' => $tab->get_video_url(),
				'id' => $tab->get_name(),
			);
		}

		return $formatted_tabs;
	}
}