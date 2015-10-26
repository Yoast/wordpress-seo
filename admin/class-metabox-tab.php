<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generates the HTML for a metabox tab.
 *
 * Class WPSEO_Metabox_Tab
 */
class WPSEO_Metabox_Tab {

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
	private $link_class;

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
	 * @param string $name         The name of the tab, used as an identifier in the html.
	 * @param string $content      The tab content.
	 * @param string $link_content The text content of the tab link.
	 * @param array  $options      Optional link attributes.
	 */
	public function __construct( $name, $content, $link_content, array $options = array() ) {
		$this->name         = $name;
		$this->content      = $content;
		$this->link_content = $link_content;
		$this->link_class	= isset( $options['link_class'] ) ? $options['link_class'] : '';
		$this->link_alt     = isset( $options['link_alt'] ) ? $options['link_alt'] : '';
		$this->link_title   = isset( $options['link_title'] ) ? $options['link_title'] : '';
	}

	/**
	 * Returns the html for the tab link.
	 *
	 * @return string
	 */
	public function link() {
		return sprintf(
			'<li class="%1$s %2$s"><a class="wpseo_tablink" href="#wpseo_%1$s" alt="%3$s" title="%4$s">%5$s</a></li>',
			$this->name,
			$this->link_class,
			$this->link_alt,
			$this->link_title,
			$this->link_content
		);
	}

	/**
	 * Returns the html for the tab content.
	 *
	 * @return string
	 */
	public function content() {
		return sprintf(
			'<div id="wpseo_%1$s" class="wpseotab %1$s"><table class="form-table">%2$s</table></div>',
			$this->name,
			$this->content
		);
	}
}
