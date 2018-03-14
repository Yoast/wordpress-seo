<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Options\Tabs
 */

/**
 * Class WPSEO_Option_Tabs
 */
class WPSEO_Option_Tabs {

	/** @var string Tabs base */
	private $base;

	/** @var array The tabs in this group */
	private $tabs = array();

	/** @var string Name of the active tab */
	private $active_tab = '';

	/**
	 * WPSEO_Option_Tabs constructor.
	 *
	 * @param string $base       Base of the tabs.
	 * @param string $active_tab Currently active tab.
	 */
	public function __construct( $base, $active_tab = '' ) {
		$this->base = sanitize_title( $base );

		$tab              = filter_input( INPUT_GET, 'tab' );
		$this->active_tab = empty( $tab ) ? $active_tab : $tab;
	}

	/**
	 * Get the base
	 *
	 * @return string
	 */
	public function get_base() {
		return $this->base;
	}

	/**
	 * Add a tab
	 *
	 * @param WPSEO_Option_Tab $tab Tab to add.
	 *
	 * @return $this
	 */
	public function add_tab( WPSEO_Option_Tab $tab ) {
		$this->tabs[] = $tab;

		return $this;
	}

	/**
	 * Get active tab
	 *
	 * @return null|WPSEO_Option_Tab Get the active tab.
	 */
	public function get_active_tab() {
		if ( empty( $this->active_tab ) ) {
			return null;
		}

		$active_tabs = array_filter( $this->tabs, array( $this, 'is_active_tab' ) );
		if ( ! empty( $active_tabs ) ) {
			$active_tabs = array_values( $active_tabs );
			if ( count( $active_tabs ) === 1 ) {
				return $active_tabs[0];
			}
		}

		return null;
	}

	/**
	 * Is the tab the active tab
	 *
	 * @param WPSEO_Option_Tab $tab Tab to check for active tab.
	 *
	 * @return bool
	 */
	public function is_active_tab( WPSEO_Option_Tab $tab ) {
		return ( $tab->get_name() === $this->active_tab );
	}

	/**
	 * Get all tabs
	 *
	 * @return WPSEO_Option_Tab[]
	 */
	public function get_tabs() {
		return $this->tabs;
	}

	/**
	 * Display the tabs
	 *
	 * @param Yoast_Form $yform   Yoast Form needed in the views.
	 */
	public function display( Yoast_Form $yform ) {
		$formatter = new WPSEO_Option_Tabs_Formatter();
		$formatter->run( $this, $yform );
	}
}
