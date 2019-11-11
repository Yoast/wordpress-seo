<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the HTML for a metabox section.
 */
class WPSEO_Metabox_Tab_Section extends WPSEO_Abstract_Metabox_Tab_With_Sections {

	/**
	 * An instance of the Metabox Tab class.
	 *
	 * @var WPSEO_Metabox_Tab[]
	 */
	public $tabs = array();

	/**
	 * Constructor.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @param string $name         The name of the section, used as an identifier in the html.
	 *                             Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param array  $tabs         The metabox tabs (`WPSEO_Metabox_Tabs[]`) to be included in the section.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $tabs = array(), array $options = array() ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		parent::__construct( $name, $link_content, $options );

		// Filter out invalid tab instances.
		$valid_tabs = array_filter( $tabs, array( $this, 'is_valid_tab' ) );

		foreach ( $valid_tabs as $tab ) {
			$this->add_tab( $tab );
		}
	}

	/**
	 * Determines whether the passed tab is considered valid.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @param mixed $tab The potential tab that needs to be validated.
	 *
	 * @return bool Whether or not the tab is valid.
	 */
	protected function is_valid_tab( $tab ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		if ( $tab instanceof WPSEO_Metabox_Tab && ! $tab instanceof WPSEO_Metabox_Null_Tab ) {
			return true;
		}

		return false;
	}

	/**
	 * Outputs the section content if any tab has been added.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 */
	public function display_content() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		if ( $this->has_sections() ) {
			$html  = '<div role="tabpanel" id="wpseo-meta-section-%1$s" aria-labelledby="wpseo-meta-tab-%1$s" tabindex="0" class="wpseo-meta-section">';
			$html .= '<div class="wpseo-metabox-tabs-div">';
			$html .= '<ul class="wpseo-metabox-tabs %2$s">%3$s</ul>%4$s';
			$html .= '</div></div>';

			printf(
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: This is deprecated.
				$html,
				esc_attr( $this->name ),
				esc_attr( 'wpseo-metabox-tab-' . $this->name ),
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: This is deprecated.
				$this->tab_links(),
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: This is deprecated.
				$this->tab_content()
			);
		}
	}

	/**
	 * Add a `WPSEO_Metabox_Tab` object to the tabs.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @param WPSEO_Metabox_Tab $tab Tab to add.
	 */
	public function add_tab( WPSEO_Metabox_Tab $tab ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		$this->tabs[] = $tab;
	}

	/**
	 * Checks if any tabs have been added to the section.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	protected function has_sections() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		return ! empty( $this->tabs );
	}

	/**
	 * Concatenates all tabs' links into one html string.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	private function tab_links() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		$links = '';
		foreach ( $this->tabs as $tab ) {
			$links .= $tab->link();
		}
		return $links;
	}

	/**
	 * Concatenates all tabs' content into one html string.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	private function tab_content() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		$content = '';
		foreach ( $this->tabs as $tab ) {
			$content .= $tab->content();
		}
		return $content;
	}

	/**
	 * Gets the name of the tab section.
	 *
	 * @deprecated         12.3
	 * @codeCoverageIgnore
	 *
	 * @return string The name of the tab section.
	 */
	public function get_name() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );

		return $this->name;
	}
}
