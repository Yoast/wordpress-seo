<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox
 */
class WPSEO_Taxonomy_Content_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * Returns array with the fields for the general tab
	 *
	 * @return array
	 */
	public function get() {
		$fields = array(
			'snippet' => $this->get_field_config(
				__( 'Snippet Editor', 'wordpress-seo' ),
				sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results. Read %sthis post%s for more info.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/snippet-preview">', '</a>' ),
				'div',
				array(
					'help-button' => __( 'Snippet Editor Help', 'wordpress-seo' ),
				)
			),
			'focuskw' => $this->get_field_config(
				__( 'Focus Keyword', 'wordpress-seo' ),
				sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about. Read %sthis post%s for more info.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/focus-keyword">', '</a>' ),
				'text',
				array(
					'help-button' => __( 'Focus Keyword Help', 'wordpress-seo' ),
				)
			),
			'analysis' => $this->get_field_config(
				__( 'Content Analysis', 'wordpress-seo' ),
				sprintf( __( 'This is the content analysis, a collection of content checks that analyze the content of your page. Read %sthis post%s for more info.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/content-analysis">', '</a>' ),
				'div',
				array(
					'help-button' => __( 'Content Analysis Help', 'wordpress-seo' ),
				)
			),
			'title' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'desc' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'linkdex' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
		);

		return $this->filter_hidden_fields( $fields );
	}
}
