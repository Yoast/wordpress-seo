<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Help_Center
 */
class WPSEO_Help_Center {
	/**
	 * @var array Help_Center_Item list of helpcenter tabs to be shown in the helpcenter
	 */
	private $help_center_items = array();

	/**
	 * @var String $group_name
	 */
	private $group_name;

	/**
	 * @var WPSEO_Option_Tab $tab
	 */
	private $tab;

	/**
	 * WPSEO_Help_Center constructor.
	 *
	 * @param String $group_name The name of the group of the tab the helpcenter is on.
	 * @param String $tab        The name of the tab the helpcenter is on.
	 */
	function __construct( $group_name, $tab ) {
		$this->group_name = $group_name;
		$this->tab        = $tab;

		$kb_help_center_item = new WPSEO_Help_Center_Item(
			'knowledge-base', 'Knowledge base', array(
				'content'        => '<div class="wpseo-kb-search"></div>',
				'view_arguments' => array( 'identifier' => $tab->get_name() ),
			)
		);
		array_push( $this->help_center_items, $kb_help_center_item );

		$popup_title = sprintf( __( 'Email support is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' );
		/* Translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
		$popup_content                    = sprintf( __( 'To be able to contact our support team, you need %1$s. You can buy the plugin, including one year of support, updates and upgrades, on %2$s.', 'wordpress-seo' ),
			'<a href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&utm_medium=popup&utm_campaign=multiple-keywords">Yoast SEO Premium</a>',
			'yoast.com' );
		$premium_popup                    = new WPSEO_Premium_Popup( 'contact-support', $popup_title, $popup_content );
		$contact_support_help_center_item = new WPSEO_Help_Center_Item( 'contact-support', 'Email support', array( 'content' => $premium_popup->get_premium_popup() ) );
		array_push( $this->help_center_items, $contact_support_help_center_item );
	}

	/**
	 * @return mixed (WPSEO_Help_Center_Item | null) Returns a help center item containing a video.
	 */
	private function get_video_help_center_item() {
		$url = $this->tab->get_video_url();
		if ( ! empty( $url ) ) {
			return new WPSEO_Help_Center_Item(
				'video',
				'Video tutorial',
				array(
					'view'           => 'partial-help-center-video',
					'view_arguments' => array(
						'tab_video_url' => $url,
					),
				)
			);
		}

		return null;
	}

	/**
	 * Outputes the help center.
	 */
	public function draw_help_center() {
		array_unshift( $this->help_center_items, $this->get_video_help_center_item() );
		$help_center_items = apply_filters( 'wpseo_help_center_items', $this->help_center_items );
		$help_center_items = array_filter( $help_center_items, array( $this, 'is_a_help_center_item' ) );

		if ( ! empty( $help_center_items ) ) {
			$id = sprintf( 'tab-help-center-%s-%s', $this->group_name, $this->tab->get_name() );
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

							foreach ( $help_center_items as $help_center_item ) {
								$id = $help_center_item->get_identifier();

								$link_id  = "tab-link-{$this->group_name}_{$this->tab->get_name()}__{$id}";
								$panel_id = "tab-panel-{$this->group_name}_{$this->tab->get_name()}__{$id}";
								?>

								<li id="<?php echo esc_attr( $link_id ); ?>" class="<?php echo $class; ?>">
									<a href="<?php echo esc_url( "#$panel_id" ); ?>"
									   class="<?php echo $id ?>"
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
							$id = $help_center_item->get_identifier();

							$panel_id = "tab-panel-{$this->group_name}_{$this->tab->get_name()}__{$id}";
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

	/**
	 * Checks if the param is a help center item.
	 *
	 * @param object $item The object compare.
	 * @return bool
	 */
	private function is_a_help_center_item( $item ) {
		return is_a( $item, 'WPSEO_Help_Center_Item' );
	}
}
