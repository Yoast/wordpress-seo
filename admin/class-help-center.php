<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Help_Center
 */
class WPSEO_Help_Center {

	/**
	 * The tabs in the help center.
	 *
	 * @var WPSEO_Option_Tab[] $tab
	 */
	private $tabs;

	/**
	 * Mount point in the HTML.
	 *
	 * @var string
	 */
	private $identifier = 'yoast-help-center-container';

	/**
	 * Additional help center items.
	 *
	 * @var array
	 */
	protected $help_center_items = array();

	/**
	 * Show premium support tab.
	 *
	 * @var bool
	 */
	protected $premium_support;

	/**
	 * WPSEO_Help_Center constructor.
	 *
	 * @param string                             $unused          Backwards compatible argument.
	 * @param WPSEO_Option_Tabs|WPSEO_Option_Tab $option_tabs     Currently displayed tabs.
	 * @param boolean                            $premium_support Show premium support tab.
	 */
	public function __construct( $unused, $option_tabs, $premium_support = false ) {
		$this->premium_support = $premium_support;

		$tabs = new WPSEO_Option_Tabs( '' );

		if ( $option_tabs instanceof WPSEO_Option_Tabs ) {
			$tabs = $option_tabs;
		}

		if ( $option_tabs instanceof WPSEO_Option_Tab ) {
			$tabs = new WPSEO_Option_Tabs( '', $option_tabs->get_name() );
			$tabs->add_tab( $option_tabs );
		}

		$this->tabs = $tabs;
	}

	/**
	 * Localize data required by the help center component.
	 */
	public function localize_data() {
		$this->add_contact_support_item();
		$this->enqueue_localized_data( $this->format_data( $this->tabs->get_tabs() ) );
	}

	/**
	 * Format the required data for localized script.
	 *
	 * @param WPSEO_Option_Tab[] $tabs Yoast admin pages navigational tabs.
	 *
	 * @return array Associative array containing data for help center component.
	 */
	protected function format_data( array $tabs ) {
		$formatted_data = array( 'tabs' => array() );

		foreach ( $tabs as $tab ) {
			$formatted_data['tabs'][ $tab->get_name() ] = array(
				'label'    => $tab->get_label(),
				'videoUrl' => $tab->get_video_url(),
				'id'       => $tab->get_name(),
			);
		}

		$active_tab = $this->tabs->get_active_tab();
		$active_tab = ( null === $active_tab ) ? $tabs[0] : $active_tab;

		$formatted_data['mountId']    = $this->identifier;
		$formatted_data['initialTab'] = $active_tab->get_name();

		$is_premium = WPSEO_Utils::is_yoast_seo_premium();

		// Will translate to either empty string or "1" in localised script.
		$formatted_data['isPremium']     = $is_premium;
		$formatted_data['pluginVersion'] = WPSEO_VERSION;

		// Open HelpScout on activating this tab ID.
		$formatted_data['shouldDisplayContactForm'] = $this->premium_support;

		$formatted_data['videoDescriptions'] = array();

		if ( $is_premium === false ) {
			$formatted_data['videoDescriptions'][] = array(
				'title'       => __( 'Need help?', 'wordpress-seo' ),
				'description' => __( 'Go Premium and our experts will be there for you to answer any questions you might have about the setup and use of the plugin.', 'wordpress-seo' ),
				'link'        => WPSEO_Shortlinker::get( 'https://yoa.st/seo-premium-vt' ),
				/* translators: %s expands to Yoast SEO Premium */
				'linkText'    => sprintf( __( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			);

			$formatted_data['videoDescriptions'][] = array(
				/* translators: %s expands to Yoast SEO */
				'title'       => sprintf( __( 'Want to be a %s Expert?', 'wordpress-seo' ), 'Yoast SEO' ),
				/* translators: %1$s expands to Yoast SEO */
				'description' => sprintf( __( 'Follow our %1$s for WordPress training and become a certified %1$s Expert!', 'wordpress-seo' ), 'Yoast SEO' ),
				'link'        => WPSEO_Shortlinker::get( 'https://yoa.st/wordpress-training-vt' ),
				/* translators: %s expands to Yoast SEO */
				'linkText'    => sprintf( __( 'Enroll in the %s for WordPress training', 'wordpress-seo' ), 'Yoast SEO' ),
			);
		}

		$formatted_data['contactSupportParagraphs'] = array(
			array(
				'image'   => array(
					'src'    => esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/support-team.svg' ),
					'width'  => 100,
					'height' => 100,
					'alt'    => '',
				),
				'content' => null,
			),
			array(
				'image'   => null,
				'content' => __( 'If you have a problem that you can\'t solve with our video tutorials or knowledge base, you can send a message to our support team. They can be reached 24/7.', 'wordpress-seo' ),
			),
			array(
				'image'   => null,
				'content' => __( 'Support requests you create here are sent directly into our support system, which is secured with 256 bit SSL, so communication is 100% secure.', 'wordpress-seo' ),
			),
		);

		$formatted_data['extraTabs'] = $this->get_extra_tabs();

		return $formatted_data;
	}

	/**
	 * Get additional tabs for the help center component.
	 *
	 * @return array Additional help center tabs.
	 */
	protected function get_extra_tabs() {
		$help_center_items = apply_filters( 'wpseo_help_center_items', $this->help_center_items );

		return array_map( array( $this, 'format_helpcenter_tab' ), $help_center_items );
	}

	/**
	 * Convert WPSEO_Help_Center_Item into help center format.
	 *
	 * @param WPSEO_Help_Center_Item $item The item to convert.
	 *
	 * @return array Formatted item.
	 */
	protected function format_helpcenter_tab( WPSEO_Help_Center_Item $item ) {
		return array(
			'identifier' => $item->get_identifier(),
			'label'      => $item->get_label(),
			'content'    => $item->get_content(),
		);
	}

	/**
	 * Enqueue localized script for help center component.
	 *
	 * @param array $data Data to localize.
	 */
	protected function enqueue_localized_data( $data ) {
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'help-center', 'wpseoHelpCenterData', $data );

		$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
		$yoast_components_l10n->localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'help-center' );
	}

	/**
	 * Outputs the help center div.
	 */
	public function mount() {
		echo '<div id="' . esc_attr( $this->identifier ) . '">' . esc_html__( 'Loading help center.', 'wordpress-seo' ) . '</div>';
	}

	/**
	 * Add the contact support help center item to the help center.
	 */
	private function add_contact_support_item() {
		/* translators: %s: expands to 'Yoast SEO Premium'. */
		$popup_title   = sprintf( __( 'Email support is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' );
		$popup_content = '<p class="yoast-measure">' . __( 'Go Premium and our experts will be there for you to answer any questions you might have about the setup and use of the plugin.', 'wordpress-seo' ) . '</p>';
		/* translators: %s: expands to 'Yoast SEO Premium'. */
		$popup_content .= '<p>' . sprintf( __( 'Other benefits of %s for you:', 'wordpress-seo' ), 'Yoast SEO Premium' ) . '</p>';
		$popup_content .= '<ul class="wpseo-premium-advantages-list">';
		$popup_content .= '<li>' . sprintf(
			// We don't use strong text here, but we do use it in the "Add keyword" popup, this is just to have the same translatable strings.
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( '%1$sNo more dead links%2$s: easy redirect manager', 'wordpress-seo' ),
			'',
			''
		) . '</li>';
		$popup_content .= '<li>' . __( 'Superfast internal linking suggestions', 'wordpress-seo' ) . '</li>';
		$popup_content .= '<li>' . sprintf(
			// We don't use strong text here, but we do use it in the "Add keyword" popup, this is just to have the same translatable strings.
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( '%1$sSocial media preview%2$s: Facebook & Twitter', 'wordpress-seo' ),
			'',
			''
		) . '</li>';
		$popup_content .= '<li>' . __( '24/7 email support', 'wordpress-seo' ) . '</li>';
		$popup_content .= '<li>' . __( 'No ads!', 'wordpress-seo' ) . '</li>';
		$popup_content .= '</ul>';

		$premium_popup                    = new WPSEO_Premium_Popup( 'contact-support', 'h2', $popup_title, $popup_content, WPSEO_Shortlinker::get( 'https://yoa.st/contact-support' ) );
		$contact_support_help_center_item = new WPSEO_Help_Center_Item(
			'contact-support',
			__( 'Get support', 'wordpress-seo' ),
			array( 'content' => $premium_popup->get_premium_message( false ) ),
			'dashicons-email-alt'
		);

		$this->help_center_items[] = $contact_support_help_center_item;
	}
}
