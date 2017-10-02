<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Help_Center
 */
class WPSEO_Help_Center {
	/** @var WPSEO_Option_Tab[] $tab */
	private $tabs;

	/** @var string Mount point in the HTML */
	private $identifier = 'yoast-help-center';

	/**
	 * WPSEO_Help_Center constructor.
	 *
	 * @param WPSEO_Option_Tabs $tabs Currently displayed tabs.
	 */
	public function __construct( WPSEO_Option_Tabs $tabs ) {
		$this->tabs = $tabs;
	}

	/**
	 *
	 */
	public function localize_data() {
		$this->enqueue_localized_data( $this->format_data( $this->tabs->get_tabs() ) );
	}

	/**
	 * @param WPSEO_Option_Tab[] $tabs
	 *
	 * @return array
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
		$active_tab = null === $active_tab ? $tabs[0] : $active_tab;

		$formatted_data['mountId']    = $this->identifier;
		$formatted_data['initialTab'] = $active_tab->get_name();

		// Will translate to either empty string or "1" in localised script.
		$formatted_data['isPremium']     = WPSEO_Utils::is_yoast_seo_premium();
		$formatted_data['pluginVersion'] = WPSEO_VERSION;

		$formatted_data['translations'] = $this::get_translated_texts();

		return $formatted_data;
	}

	/**
	 * @param $data
	 */
	protected function enqueue_localized_data( $data ) {
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'help-center', 'wpseoHelpCenterData', $data );
	}

	/**
	 * Outputs the help center div.
	 */
	public function mount() {
		echo '<div id="' . esc_attr( $this->identifier ) . '">Loading help center.</div>';
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
			'locale'        => get_locale(),
			'translationId' => __( 'Translated sentence', 'wordpress-seo' ),
		);
	}
}
