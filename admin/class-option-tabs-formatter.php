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

		$filter_name            = sprintf( 'yoast_option_tab_help_center_%s', $option_tabs->get_base() );
		$base_help_center_items = apply_filters( $filter_name, array() );

		foreach ( $option_tabs->get_tabs() as $tab ) {

			$identifier = $tab->get_name();

			printf( '<div id="%s" class="wpseotab">', $identifier );

			$filter_name       = sprintf( 'yoast_option_tab_help_center_%s_%s', $option_tabs->get_base(), $tab->get_name() );
			$help_center_items = apply_filters( $filter_name, $base_help_center_items );

			if ( ! empty( $help_center_items ) ) {
				$this->create_help_center( $option_tabs->get_base(), $tab->get_name(), $help_center_items );
			}
			else {
				$video = $tab->get_video_url();
				if ( ! empty( $video ) ) {
					$tab_video_url = $video;
					include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
				}
			}

			$tab_view = $this->get_tab_view( $option_tabs, $tab );
			if ( is_file( $tab_view ) ) {
				require_once $tab_view;
			}

			echo '</div>';
		}
	}

	private function create_help_center( $base, $tab, $help_center_items ) {

		$id = sprintf( 'tab-help-center-%s-%s', $base, $tab );

		?>
		<div class="wpseo-tab-video-container">
			<button type="button" class="wpseo-tab-video-container__handle" aria-controls="<?php echo $id ?>"
			        aria-expanded="false">
			<span
				class="dashicons-before dashicons-editor-help"><?php _e( 'Help center', 'wordpress-seo' ) ?></span>
				<span class="dashicons dashicons-arrow-down toggle__arrow"></span>
			</button>
			<div id="<?php echo $id ?>" class="wpseo-tab-video-slideout" aria-hidden="true">
				<div class="yoast-help-center-tabs">
					<ul>
						<?php
						$class = 'active wpseo-help-center-item';

						/** @var WPSEO_Help_Center_Item $help_center_item */
						foreach ( $help_center_items as $help_center_item ) {
							if ( ! is_a( $help_center_item, 'WPSEO_Help_Center_Item' ) ) {
								continue;
							}

							$id = $help_center_item->get_identifier();

							$link_id  = "tab-link-{$base}_{$tab}__{$id}";
							$panel_id = "tab-panel-{$base}_{$tab}__{$id}";
							?>

							<li id="<?php echo esc_attr( $link_id ); ?>" class="<?php echo $class; ?>">
								<a href="<?php echo esc_url( "#$panel_id" ); ?>"
								   aria-controls="<?php echo esc_attr( $panel_id ); ?>"><?php echo esc_html( $help_center_item->get_label() ); ?></a>
							</li>
							<?php
							$class = 'wpseo-help-center-item';
						}
						?>
					</ul>
				</div>
				<div class="contextual-help-tabs-wrap">
					<?php
					$classes = 'help-tab-content active';
					foreach ( $help_center_items as $help_center_item ) {
						if ( ! is_a( $help_center_item, 'WPSEO_Help_Center_Item' ) ) {
							continue;
						}

						$id = $help_center_item->get_identifier();

						$panel_id = "tab-panel-{$base}_{$tab}__{$id}";
						?>

						<div id="<?php echo esc_attr( $panel_id ); ?>" class="<?php echo $classes; ?>">
							<?php echo $help_center_item->get_content(); ?>
						</div>
						<?php
						$classes = 'help-tab-content';
					}
					?>
				</div>
			</div>
		</div>
		<?php

	}
}
