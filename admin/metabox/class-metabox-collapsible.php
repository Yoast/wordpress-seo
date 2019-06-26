<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates the HTML for a metabox tab.
 */
class WPSEO_Metabox_Collapsible {

	/**
	 * @var string
	 */
	private $name;

	/**
	 * @var string
	 */
	private $content;

	/**
	 * @var string
	 */
	private $link_content;

	/**
	 * @var string
	 */
	private $tab_class;

	/**
	 * @var string
	 */
	private $link_class;

	/**
	 * @var string
	 */
	private $link_title;

	/**
	 * @var string
	 */
	private $link_aria_label;

	/**
	 * @var boolean
	 */
	private $single;

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the tab, used as an identifier in the html.
	 * @param string $content      The tab content.
	 * @param string $link_content The text content of the tab link.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $content, $link_content, array $options = array() ) {
		$default_options = array(
			'tab_class'       => '',
			'link_class'      => '',
			'link_title'      => '',
			'link_aria_label' => '',
			'single'          => false,
		);

		$options = array_merge( $default_options, $options );

		$this->name            = $name;
		$this->content         = $content;
		$this->link_content    = $link_content;
		$this->tab_class       = $options['tab_class'];
		$this->link_class      = $options['link_class'];
		$this->link_title      = $options['link_title'];
		$this->link_aria_label = $options['link_aria_label'];
		$this->single          = $options['single'];
	}

	/**
	 * Returns the html for the tab link.
	 *
	 * @return string
	 */
	public function link() {
		return $this->link_content;
	}

	/**
	 * Returns the html for the tab content.
	 *
	 * @return string
	 */
	public function content() {
		return $this->content;
	}
}
