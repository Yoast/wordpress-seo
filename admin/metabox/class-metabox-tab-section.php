<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the HTML for a metabox section.
 */
class WPSEO_Metabox_Tab_Section implements WPSEO_Metabox_Section {

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
	private $link_title;

	/**
	 * @var string
	 */
	private $link_class;

	/**
	 * @var string
	 */
	private $link_aria_label;

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the section, used as an identifier in the html. Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param array  $tabs         The metabox tabs (`WPSEO_Metabox_Tabs[]`) to be included in the section.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $tabs = array(), array $options = array() ) {
		$default_options = array(
			'link_title'      => '',
			'link_class'      => '',
			'link_aria_label' => '',
		);

		$options = array_merge( $default_options, $options );

		$this->name = $name;
		foreach ( $tabs as $tab ) {
			$this->add_tab( $tab );
		}
		$this->link_content    = $link_content;
		$this->link_title      = $options['link_title'];
		$this->link_class      = $options['link_class'];
		$this->link_aria_label = $options['link_aria_label'];
	}

	/**
	 * Outputs the section link if any tab has been added.
	 */
	public function display_link() {
		if ( $this->has_tabs() ) {
			printf(
				'<li><a href="#wpseo-meta-section-%1$s" class="wpseo-meta-section-link %2$s"%3$s%4$s>%5$s</a></li>',
				esc_attr( $this->name ),
				esc_attr( $this->link_class ),
				( '' !== $this->link_title ) ? ' title="' . esc_attr( $this->link_title ) . '"' : '',
				( '' !== $this->link_aria_label ) ? ' aria-label="' . esc_attr( $this->link_aria_label ) . '"' : '',
				$this->link_content
			);
		}
	}

	/**
	 * Outputs the section content if any tab has been added.
	 */
	public function display_content() {
		if ( $this->has_tabs() ) {
			$html  = '<div id="wpseo-meta-section-%1$s" class="wpseo-meta-section">';
			$html .= '<div class="wpseo-metabox-tabs-div">';
			$html .= '<ul class="wpseo-metabox-tabs wpseo-metabox-tab-%1$s">%2$s</ul>%3$s';
			$html .= '</div></div>';

			printf( $html, esc_attr( $this->name ), $this->tab_links(), $this->tab_content() );
		}
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
	 * Concatenates all tabs' links into one html string.
	 *
	 * @return string
	 */
	private function tab_links() {
		$links = '';
		foreach ( $this->tabs as $tab ) {
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
		foreach ( $this->tabs as $tab ) {
			$content .= $tab->content();
		}
		return $content;
	}
}
