<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates the HTML for a metabox tab.
 */
class WPSEO_Metabox_Collapsible implements WPSEO_Metabox_Tab {

	/**
	 * The collapsible's unique identifier.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The content to be displayed inside the collapsible.
	 *
	 * @var string
	 */
	private $content;

	/**
	 * The label.
	 *
	 * @var string
	 */
	private $link_content;

	/**
	 * Constructor.
	 *
	 * @param string $name         The name of the tab, used as an identifier in the html.
	 * @param string $content      The tab content.
	 * @param string $link_content The text content of the tab link.
	 */
	public function __construct( $name, $content, $link_content ) {
		$this->name         = $name;
		$this->content      = $content;
		$this->link_content = $link_content;
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

	/**
	 * Returns the collapsible's unique identifier.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}
}
