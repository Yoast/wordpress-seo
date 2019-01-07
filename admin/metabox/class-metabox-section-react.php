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
	 * Name of the section, used as an identifier in the HTML.
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Content to use before the React root node.
	 *
	 * @var string
	 */
	public $content;

	/**
	 * Content to use to display the button to open this content block.
	 *
	 * @var string
	 */
	private $link_content;

	/**
	 * Class to add to the link.
	 *
	 * @var string
	 */
	private $link_class;

	/**
	 * Aria label to use for the link.
	 *
	 * @var string
	 */
	private $link_aria_label;

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the section, used as an identifier in the html. Can only contain URL safe characters.
	 * @param string $link_content The text content of the section link.
	 * @param string $content      Optional. Content to use above the React root element.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $link_content, $content = '', array $options = array() ) {
		$this->name    = $name;
		$this->content = $content;

		$default_options = array(
			'link_class'      => '',
			'link_aria_label' => '',
		);

		$options = wp_parse_args( $options, $default_options );

		$this->link_content    = $link_content;
		$this->link_class      = $options['link_class'];
		$this->link_aria_label = $options['link_aria_label'];
	}

	/**
	 * Outputs the section link.
	 *
	 * @return void
	 */
	public function display_link() {
		printf(
			'<li><a href="#wpseo-meta-section-%1$s" class="wpseo-meta-section-link %2$s"%3$s>%4$s</a></li>',
			esc_attr( $this->name ),
			esc_attr( $this->link_class ),
			( '' !== $this->link_aria_label ) ? ' aria-label="' . esc_attr( $this->link_aria_label ) . '"' : '',
			$this->link_content
		);
	}

	/**
	 * Outputs the section content.
	 *
	 * @return void
	 */
	public function display_content() {
		$html  = sprintf( '<div id="%1$s" class="wpseo-meta-section">', esc_attr( 'wpseo-meta-section-' . $this->name ) );
		$html .= $this->content;
		$html .= '<div id="wpseo-metabox-root" class="wpseo-metabox-root"></div>';
		$html .= '</div>';

		echo $html;
	}
}
