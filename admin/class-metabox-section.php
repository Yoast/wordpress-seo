<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the HTML for a metabox section.
 *
 * Class WPSEO_Metabox_Section
 */
class WPSEO_Metabox_Section {

	/**
	 * @var WPSEO_Metabox_Tab[]
	 */
	public $tabs = array();

	/**
	 * @var string
	 */
	public $name;

	/**
	 * @var string
	 */
	private $link_content;

	/**
	 * @var string
	 */
	private $link_alt;

	/**
	 * @var string
	 */
	private $link_title;

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the section, used as an identifier in the html.
	 * @param string $link_content The text content of the section link.
	 * @param array  $tabs         The metabox tabs (`WPSEO_Metabox_Tabs[]`) to be included in the section.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $tabs = array(), array $options = array() ) {
		$this->name = $name;
		foreach ( $tabs as $tab ) {
			$this->add_tab( $tab );
		}
		$this->link_content = $link_content;
		$this->link_alt     = isset( $options['link_alt'] ) ? $options['link_alt'] : '';
		$this->link_title   = isset( $options['link_title'] ) ? $options['link_title'] : '';
	}

	/**
	 * Outputs the section link if any tab has been added.
	 */
	public function display_link() {
		if ( $this->has_tabs() ) {
			printf(
				'<li><a href="#wpseo-meta-section-%1$s" class="wpseo-meta-section-link" alt="%2$s" title="%3$s">%4$s</a></li>',
				$this->name,
				$this->link_alt,
				$this->link_title,
				$this->link_content
			);
		}
		echo '';
	}

	/**
	 * Outputs the section content if any tab has been added.
	 */
	public function display_content() {
		if ( $this->has_tabs() ) {
			$html = '<div id="wpseo-meta-section-%1$s" class="wpseo-meta-section">';
			$html .= '<div class="wpseo-metabox-tabs-div" >';
			$html .= '<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs">%2$s</ul>%3$s';
			$html .= '</div></div>';

			printf( $html, $this->name, $this->tab_links(), $this->tab_content() );
		}
		echo '';
	}

	/**
	 * Add a `WPSEO_Metabox_Tab` object to the tabs.
	 *
	 * @param WPSEO_Metabox_Tab $tab Tab to add.
	 */
	public function add_tab( WPSEO_Metabox_Tab $tab ) {
		$this->tabs[] = $tab;
	}

	/**
	 * Checks if any tabs have been added to the section.
	 *
	 * @return bool
	 */
	protected function has_tabs() {
		return ! empty( $this->tabs );
	}

	/**
	 * * Concatenates all tabs' links into one html string.
	 *
	 * @return string
	 */
	private function tab_links() {
		$links = '';
		foreach ( $this->tabs as $tab_name => $tab ) {
			$links .= $tab->link();
		}
		return $links;
	}

	/**
	 * Concatenates all tabs' content into one html string.
	 *
	 * @return string
	 */
	private function tab_content() {
		$content = '';
		foreach ( $this->tabs as $tab_name => $tab ) {
			$content .= $tab->content();
		}
		return $content;
	}
}
