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
	 * @param String           $group_name The name of the group of the tab the helpcenter is on.
	 * @param WPSEO_Option_Tab $tab        The name of the tab the helpcenter is on.
	 */
	public function __construct( $group_name, $tab ) {
		$this->group_name = $group_name;
		$this->tab        = $tab;

		$this->add_video_tutorial_item();
		$this->add_kb_search_item();
		$this->add_contact_support_item();
	}

	/**
	 * Add the knowledge base search help center item to the help center.
	 */
	private function add_kb_search_item() {
		$kb_help_center_item = new WPSEO_Help_Center_Item(
			'knowledge-base',
			__( 'Knowledge base', 'wordpress-seo' ),
			array(
				'content'        => '<div class="wpseo-kb-search"></div>',
				'view_arguments' => array( 'identifier' => $this->tab->get_name() ),
			),
			'dashicons-search'
		);
		array_push( $this->help_center_items, $kb_help_center_item );
	}

	/**
	 * Add the contact support help center item to the help center.
	 */
	private function add_contact_support_item() {
		$popup_title = sprintf( __( 'Email support is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' );
		/* translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
		$popup_content = sprintf( __( 'To be able to contact our support team, you need %1$s. You can buy the plugin, including one year of support, updates and upgrades, on %2$s.', 'wordpress-seo' ),
			'<a href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&utm_medium=popup&utm_campaign=multiple-keywords">Yoast SEO Premium</a>',
			'yoast.com' );

		$premium_popup                    = new WPSEO_Premium_Popup( 'contact-support', 'h2', $popup_title, $popup_content );
		$contact_support_help_center_item = new WPSEO_Help_Center_Item(
			'contact-support',
			__( 'Email support', 'wordpress-seo' ),
			array( 'content' => $premium_popup->get_premium_message( false ) ),
			'dashicons-email-alt'
		);

		array_push( $this->help_center_items, $contact_support_help_center_item );
	}

	/**
	 * Add the video tutorial help center item to the help center.
	 */
	private function add_video_tutorial_item() {
		array_push( $this->help_center_items, $this->get_video_help_center_item() );
	}

	/**
	 * @return mixed (WPSEO_Help_Center_Item | null) Returns a help center item containing a video.
	 */
	private function get_video_help_center_item() {
		$url = $this->tab->get_video_url();
		if ( empty( $url ) ) {
			return null;
		}

		return new WPSEO_Help_Center_Item(
			'video',
			__( 'Video tutorial', 'wordpress-seo' ),
			array(
				'view'           => 'partial-help-center-video',
				'view_arguments' => array(
					'tab_video_url' => $url,
				),
			),
			'dashicons-video-alt3'
		);
	}

	/**
	 * Outputs the help center.
	 */
	public function output_help_center() {
		$help_center_items = apply_filters( 'wpseo_help_center_items', $this->help_center_items );
		$help_center_items = array_filter( $help_center_items, array( $this, 'is_a_help_center_item' ) );
		if ( empty( $help_center_items ) ) {
			return;
		}

		$id = sprintf( 'tab-help-center-%s-%s', $this->group_name, $this->tab->get_name() );
		?>
		<div class="wpseo-tab-video-container">
			<button type="button" class="wpseo-tab-video-container__handle" aria-controls="<?php echo $id ?>"
			        aria-expanded="false">
					<span
						class="dashicons-before dashicons-editor-help"><?php _e( 'Help center', 'wordpress-seo' ) ?></span>
				<span class="dashicons dashicons-arrow-down toggle__arrow"></span>
			</button>
			<div id="<?php echo $id ?>" class="wpseo-tab-video-slideout">
				<div class="yoast-help-center-tabs">
					<ul>
						<?php
						$class = 'active wpseo-help-center-item';

						foreach ( $help_center_items as $help_center_item ) {
							$id = $help_center_item->get_identifier();
							$dashicon = $help_center_item->get_dashicon();
							if ( ! empty( $dashicon ) ) {
								$dashicon = 'dashicons-before ' . $dashicon;
							}
							$link_id  = "tab-link-{$this->group_name}_{$this->tab->get_name()}__{$id}";
							$panel_id = "tab-panel-{$this->group_name}_{$this->tab->get_name()}__{$id}";
							?>

							<li id="<?php echo esc_attr( $link_id ); ?>" class="<?php echo $class; ?>">
								<a href="<?php echo esc_url( "#$panel_id" ); ?>"
								   class="<?php echo $id . ' ' . $dashicon?>"
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

	/**
	 * Checks if the param is a help center item.
	 *
	 * @param object $item The object compare.
	 *
	 * @return bool
	 */
	private function is_a_help_center_item( $item ) {
		return is_a( $item, 'WPSEO_Help_Center_Item' );
	}

	/**
	 * Pass text variables to js for the help center JS module.
	 *
	 * %s is replaced with <code>%s</code> and replaced again in the javascript with the actual variable.
	 *
	 * @return  array Translated text strings for the help center.
	 */
	public static function get_translated_texts() {
		return array(
			/* translators: %s: '%%term_title%%' variable used in titles and meta's template that's not compatible with the given template */
			'variable_warning' => sprintf( __( 'Warning: the variable %s cannot be used in this template.', 'wordpress-seo' ), '<code>%s</code>' ) . ' ' . __( 'See the help tab for more info.', 'wordpress-seo' ),
			'locale' => get_locale(),
			/* translators: %d: number of knowledge base search results found. */
			'kb_found_results' => __( 'Number of search results: %d', 'wordpress-seo' ),
			'kb_no_results' => __( 'No results found.', 'wordpress-seo' ),
			'kb_heading' => __( 'Search the Yoast knowledge base', 'wordpress-seo' ),
			'kb_search_button_text' => __( 'Search', 'wordpress-seo' ),
			'kb_search_results_heading' => __( 'Search results', 'wordpress-seo' ),
			'kb_error_message' => __( 'Something went wrong. Please try again later.', 'wordpress-seo' ),
			'kb_loading_placeholder' => __( 'Loading...', 'wordpress-seo' ),
			'kb_search' => __( 'search', 'wordpress-seo' ),
			'kb_back' => __( 'Back', 'wordpress-seo' ),
			'kb_back_label' => __( 'Back to search results' , 'wordpress-seo' ),
			'kb_open' => __( 'Open', 'wordpress-seo' ),
			'kb_open_label' => __( 'Open the knowledge base article in a new window or read it in the iframe below' , 'wordpress-seo' ),
			'kb_iframe_title' => __( 'Knowledge base article', 'wordpress-seo' ),
		);
	}
}
