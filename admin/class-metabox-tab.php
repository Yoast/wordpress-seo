<?php

class WPSEO_Metabox_Tab {

	private $name;
	private $content;
	private $link_content;
	private $link_class;
	private $link_alt;
	private $link_title;

	/**
	 * @param string $name
	 * @param string $content
	 * @param string $link_content
	 * @param array  $options
	 */
	public function __construct( $name, $content, $link_content, array $options = array() ) {
		$this->name         = $name;
		$this->content      = $content;
		$this->link_content = $link_content;
		$this->link_class	= isset( $options['link_class'] ) ? $options['link_class'] : '';
		$this->link_alt     = isset( $options['link_alt'] ) ? $options['link_alt'] : '';
		$this->link_title   = isset( $options['link_title'] ) ? $options['link_title'] : '';
	}

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

	public function content() {
		return sprintf(
			'<div id="wpseo_%1$s" class="wpseotab %1$s"><table class="form-table">%2$s</table></div>',
			$this->name,
			$this->content
		);
	}
}
