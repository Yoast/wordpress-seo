<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the React root element for a metabox section.
 */
class WPSEO_Metabox_Section_React implements WPSEO_Metabox_Section {

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
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, array $options = array() ) {
		$this->name = $name;

		$default_options = array(
			'link_title'      => '',
			'link_class'      => '',
			'link_aria_label' => '',
		);

		$options = array_merge( $default_options, $options );

		$this->link_content    = $link_content;
		$this->link_title      = $options['link_title'];
		$this->link_class      = $options['link_class'];
		$this->link_aria_label = $options['link_aria_label'];
	}

	/**
	 * Outputs the section link.
	 */
	public function display_link() {
		printf(
			'<li><a href="#wpseo-meta-section-%1$s" class="wpseo-meta-section-link %2$s"%3$s%4$s>%5$s</a></li>',
			esc_attr( $this->name ),
			esc_attr( $this->link_class ),
			( '' !== $this->link_title ) ? ' title="' . esc_attr( $this->link_title ) . '"' : '',
			( '' !== $this->link_aria_label ) ? ' aria-label="' . esc_attr( $this->link_aria_label ) . '"' : '',
			$this->link_content
		);
	}

	/**
	 * Outputs the section content.
	 */
	public function display_content() {
		$html  = '<div id="%1$s" class="wpseo-meta-section">';
		$html .= '<div id="wpseosnippet" class="wpseosnippet"></div>';
		$html .= '</div>';

		printf(
			$html,
			esc_attr( 'wpseo-meta-section-' . $this->name )
		);
	}
}
