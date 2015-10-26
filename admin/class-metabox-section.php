<?php

class WPSEO_Metabox_Section {

	/**
	 * @var WPSEO_Metabox_Tab[]
	 */
	public $tabs = array();
	public $name;
	private $link_content;
	private $link_alt;
	private $link_title;

	/**
	 * @param $name
	 */
	public function __construct( $name, $link_content, array $tabs = array(), array $options = array() ){
		$this->name = $name;
		foreach ( $tabs as $tab ) {
			$this->add_tab( $tab );
		}
		$this->link_content = $link_content;
		$this->link_alt     = isset( $options['link_alt'] ) ? $options['link_alt'] : '';
		$this->link_title   = isset( $options['link_title'] ) ? $options['link_title'] : '';
	}

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

	public function add_tab( WPSEO_Metabox_Tab $tab ){
		$this->tabs[] = $tab;
	}

	protected function has_tabs() {
		return ! empty ( $this->tabs );
	}

	private function tab_links() {
		$links = '';
		foreach ( $this->tabs as $tab_name => $tab ) {
			$links .= $tab->link();
		}
		return $links;
	}

	private function tab_content() {
		$content = '';
		foreach ( $this->tabs as $tab_name => $tab ) {
			$content .= $tab->content();
		}
		return $content;
	}
}
