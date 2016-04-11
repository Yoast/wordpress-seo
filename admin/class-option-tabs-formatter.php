<?php
/**
 * @package WPSEO\Admin\Options\Tabs
 */

/**
 * Class WPSEO_Option_Tabs_Formatter
 */
class WPSEO_Option_Tabs_Formatter {

	/**
	 * @param WPSEO_Option_Tabs $option_tabs Option Tabs to get base from.
	 * @param WPSEO_Option_Tab  $tab         Tab to get name from.
	 *
	 * @return string
	 */
	public function get_tab_view( WPSEO_Option_Tabs $option_tabs, WPSEO_Option_Tab $tab ) {
		return WPSEO_PATH . 'admin/views/tabs/' . $option_tabs->get_base() . '/' . $tab->get_name() . '.php';
	}

	/**
	 * @param WPSEO_Option_Tabs $option_tabs Option Tabs to get tabs from.
	 * @param Yoast_Form        $yform       Yoast Form which is being used in the views.
	 * @param array             $options     Options which are being used in the views.
	 */
	public function run( WPSEO_Option_Tabs $option_tabs, Yoast_Form $yform, $options = array() ) {

		echo '<h2 class="nav-tab-wrapper" id="wpseo-tabs">';
		foreach ( $option_tabs->get_tabs() as $tab ) {
			printf( '<a class="nav-tab" id="%1$s-tab" href="#top#%1$s">%2$s</a>', $tab->get_name(), $tab->get_label() );
		}
		echo '</h2>';

		foreach ( $option_tabs->get_tabs() as $tab ) {

			$identifier = $tab->get_name();
			$video      = $tab->get_video_url();

			printf( '<div id="%s" class="wpseotab">', $identifier );

			if ( ! empty( $video ) ) {
				$tab_video_url = $video;
				include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
			}

			$tab_view = $this->get_tab_view( $option_tabs, $tab );
			if ( is_file( $tab_view ) ) {
				require_once $tab_view;
			}

			echo '</div>';
		}
	}
}
