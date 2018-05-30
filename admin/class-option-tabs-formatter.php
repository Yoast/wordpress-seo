<?php
/**
 * WPSEO plugin file.
 *
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
	 */
	public function run( WPSEO_Option_Tabs $option_tabs ) {

		echo '<h2 class="nav-tab-wrapper" id="wpseo-tabs">';
		foreach ( $option_tabs->get_tabs() as $tab ) {
			printf(
				'<a class="nav-tab" id="%1$s" href="%2$s">%3$s</a>',
				esc_attr( $tab->get_name() . '-tab' ),
				esc_url( '#top#' . $tab->get_name() ),
				esc_html( $tab->get_label() )
			);
		}
		echo '</h2>';

		$help_center = new WPSEO_Help_Center( '', $option_tabs, WPSEO_Utils::is_yoast_seo_premium() );
		$help_center->localize_data();
		$help_center->mount();

		foreach ( $option_tabs->get_tabs() as $tab ) {
			$identifier = $tab->get_name();

			$class = 'wpseotab ' . ( $tab->has_save_button() ? 'save' : 'nosave' );
			printf( '<div id="%1$s" class="%2$s">', esc_attr( $identifier ), esc_attr( $class ) );

			$tab_filter_name = sprintf( '%s_%s', $option_tabs->get_base(), $tab->get_name() );

			/**
			 * Allows to override the content that is display on the specific option tab.
			 *
			 * @internal For internal Yoast SEO use only.
			 *
			 * @api      string|null The content that should be displayed for this tab. Leave empty for default behaviour.
			 *
			 * @param WPSEO_Option_Tabs $option_tabs The registered option tabs.
			 * @param WPSEO_Option_Tab  $tab         The tab that is being displayed.
			 */
			$option_tab_content = apply_filters( 'wpseo_option_tab-' . $tab_filter_name, null, $option_tabs, $tab );
			if ( ! empty( $option_tab_content ) ) {
				echo $option_tab_content;
			}

			if ( empty( $option_tab_content ) ) {
				// Output the settings view for all tabs.
				$tab_view = $this->get_tab_view( $option_tabs, $tab );
				if ( is_file( $tab_view ) ) {
					$yform = Yoast_Form::get_instance();
					require_once $tab_view;
				}
			}

			echo '</div>';
		}
	}
}
