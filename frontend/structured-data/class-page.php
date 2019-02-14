<?php
/**
 * @package WPSEO\Structured_Data
 */

class WPSEO_Structured_Data_Page {

	private $type = array( 'WebPage' );
	private $website_id = false;
	private $main_entity = array();
	private $post_description = '';

	public function add_type( $type ) {
		$this->type[] = $type;
	}

	public function set_website_id( $website_id ) {
		$this->website_id = $website_id;
	}

	public function set_post_description( $post_description ) {
		$this->post_description = $post_description;
	}

	/**
	 * Adds something to the list of main entities for this page.
	 *
	 * @param array $main_entity The main entity to add.
	 */
	public function add_main_entity( $main_entity ) {
		$this->main_entity[] = $main_entity;
	}

	public function render_type() {
		if ( count( $this->type ) === 1 ) {
			return $this->type[ 0 ];
		}

		return $this->type;
	}

	public function render_main_entity() {
		if ( count( $this->main_entity ) === 1 ) {
			return $this->main_entity[ 0 ];
		}

		return $this->main_entity;
	}

	public function render_json( $context ) {
		$json = array(
			"@type" => $this->render_type(),
			"@id" => $context['current_url'],
			"url" => $context['current_url'],
			"name" => $context['post_title'],
			"description" => $this->post_description,
			'mainEntity' => $this->render_main_entity(),
		);

		if ( $this->website_id ) {
			$json['isPartOf'] = array( "@id" => $this->website_id );
		}

		return $json;
	}
}


/*
 *
 *
 *
 *  {
  "@type"       : "WebPage",
  "@id"         : "https://www.example.com/example-page/",
  "url"         : "https://www.example.com/example-page/",
  "inLanguage"  : "{{Language Code}}",
  "name"        : "{{Page Title}}",
  "description" : "{{Page Description}}",
  "isPartOf"    : { "@id" : "https://www.example.com/#website" },
  "mainEntity" : { "@id" : "https://www.example.com/example-page/#howto-123abc" }
 },
 *
 *
 *
 *
 *
 *
 * {
  "@type"       : ["WebPage", "FAQPage"],
  "@id"         : "https://www.example.com/example-page/",
  "url"         : "https://www.example.com/example-page/",
  "inLanguage"  : "{{Language Code}}",
  "name"        : "{{Page Title}}",
  "description" : "{{Page Description}}",
  "isPartOf"    : { "@id" : "https://www.example.com/#website" },
"mainEntity" : [
{ "@id" : "https://www.example.com/example-page/#question-123abc" },
{ "@id" : "https://www.example.com/example-page/#question-456def" }
]
 }
 */
