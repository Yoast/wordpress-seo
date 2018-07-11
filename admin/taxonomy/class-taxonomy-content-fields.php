<?php
/**
 * WPSEO plugin file.
 *
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
				__( 'Snippet editor', 'wordpress-seo' ),
				'',
				'snippetpreview'
			),
			'focuskw' => $this->get_field_config(
				__( 'Focus keyword', 'wordpress-seo' ),
				'',
				'focuskeyword',
				array(
					'help-button' => __( 'Show information about the focus keyword', 'wordpress-seo' ),
					/* translators: 1: link open tag; 2: link close tag. */
					'help'        => sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about. %1$sLearn more about the Focus Keyword%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/focus-keyword' ) . '">', '</a>' ),
				)
			),
			'analysis' => $this->get_field_config(
				__( 'Analysis', 'wordpress-seo' ),
				'',
				'pageanalysis',
				array(
					'help-button' => __( 'Show information about the content analysis', 'wordpress-seo' ),
					/* translators: 1: link open tag; 2: link close tag. */
					'help'        => sprintf( __( 'This is the content analysis, a collection of content checks that analyze the content of your page. %1$sLearn more about the Content Analysis Tool%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/content-analysis' ) . '">', '</a>' ),
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
			'content_score' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
		);

		return $this->filter_hidden_fields( $fields );
	}
}
