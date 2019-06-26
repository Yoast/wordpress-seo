<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the React root element for a metabox section.
 */
class WPSEO_Metabox_Collapsibles_Section extends WPSEO_Sectioned_Metabox_Tab {

	/**
	 * @var WPSEO_Metabox_Collapsible[]
	 */
	public $collapsibles = array();

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the section, used as an identifier in the html.
	 *                             Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param array  $collapsibles The metabox tabs (`WPSEO_Metabox_Tabs[]`) to be included in the section.
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

			foreach ( $this->collapsibles as $tab ) {
				$collapsible = new WPSEO_Paper_Presenter(
					$tab->link(),
					null,
					array(
						'content'     => $tab->content(),
						'collapsible' => true,
						'class'       => 'metabox',
					)
				);

				echo $collapsible->get_output();
			}

			echo '</div></div>';
		}
	}

	protected function has_sections() {
		return ! empty( $this->collapsibles );
	}
}
