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
				__( 'Snippet', 'wordpress-seo' ),
				sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results.<br/><br/>Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/snippet-preview/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=snippet-preview">', '</a>' ),
				'div'
			),
			'focuskw' => $this->get_field_config(
				__( 'Focus Keyword', 'wordpress-seo' ),
				sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about.<br/><br/>Read %sthis post%s for more info.', 'wordpress-seo' ), '<a href="https://yoast.com/focus-keyword/#utm_source=wordpress-seo-metabox&amp;utm_medium=inline-help&amp;utm_campaign=focus-keyword">', '</a>' )
			),
			'analysis' => $this->get_field_config(
				__( 'Analysis', 'wordpress-seo' ),
				esc_html__( 'analyzer text', 'wordpress-seo' ),
				'div'
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
