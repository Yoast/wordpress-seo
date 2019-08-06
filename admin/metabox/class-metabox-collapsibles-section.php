<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays a metabox tab that consists of collapsible sections.
 */
class WPSEO_Metabox_Collapsibles_Sections extends WPSEO_Abstract_Metabox_Tab_With_Sections {

	/**
	 * Holds the tab's collapsibles.
	 *
	 * @var WPSEO_Metabox_Collapsible[]
	 */
	private $collapsibles = array();

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the section, used as an identifier in the html.
	 *                             Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param array  $collapsibles The metabox collapsibles (`WPSEO_Metabox_Collapsible[]`) to be included in the section.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $collapsibles = array(), array $options = array() ) {
		parent::__construct( $name, $link_content, $options );

		$this->collapsibles = $collapsibles;
	}

	/**
	 * Outputs the section content if any tab has been added.
	 */
	public function display_content() {
		if ( $this->has_sections() ) {
			printf( '<div id="%1$s" class="wpseo-meta-section">', esc_attr( 'wpseo-meta-section-' . $this->name ) );
			echo '<div class="wpseo_content_wrapper">';

			foreach ( $this->collapsibles as $collapsible ) {
				echo $collapsible->content();
			}

			echo '</div></div>';
		}
	}

	/**
	 * Checks whether the tab has any sections.
	 *
	 * @return bool Whether the tab has any sections
	 */
	protected function has_sections() {
		return ! empty( $this->collapsibles );
	}
}
