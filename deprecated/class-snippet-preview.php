<?php
/**
 * @package WPSEO\Admin
 * @since      1.6.2
 *
 * @deprecated 3.0 Class inside file is removed.
 */

/**
 * Class WPSEO_Snippet_Preview
 *
 * Generates a Google Search snippet preview.
 *
 * Takes a $post, $title and $description
 *
 * @deprecated 3.0 Removed, use javascript instead.
 */
class WPSEO_Snippet_Preview {
	protected $content;

	/**
	 * @var array The WPSEO options.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $options;

	/**
	 * @var object The post for which we want to generate the snippet preview.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $post;

	/**
	 * @var string The title that is shown in the snippet.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $title;

	/**
	 * @var string The description that is shown in the snippet.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $description;

	/**
	 * @var string The date that is shown at the beginning of the description in the snippet.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $date = '';

	/**
	 * @var string The url that is shown in the snippet.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $url = '';

	/**
	 * @var string The slug of the url that is shown in the snippet.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected $slug = '';

	/**
	 * Generates the html for the snippet preview containing dynamically generated text components.
	 * Those components are included as properties which are set in the constructor.
	 *
	 * @param WP_Post $post        Post instance.
	 * @param string  $title       Title string.
	 * @param string  $description Description string.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	public function __construct( $post, $title, $description ) {
		_deprecated_constructor( 'WPSEO_Snippet_Preview', 'WPSEO 3.0' );
	}

	/**
	 * Getter for $this->content
	 * @return string html for snippet preview
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	public function get_content() {
		_deprecated_function( 'WPSEO_Snippet_Preview::get_content', 'WPSEO 3.0', 'javascript' );
		return $this->content;
	}

	/**
	 * Sets date if available
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function set_date() {
		_deprecated_function( 'WPSEO_Snippet_Preview::set_date', 'WPSEO 3.0', 'javascript' );
	}

	/**
	 * Retrieves a post date when post is published, or return current date when it's not.
	 *
	 * @return string
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function get_post_date() {
		_deprecated_function( 'WPSEO_Snippet_Preview::get_post_date', 'WPSEO 3.0', 'javascript' );
		return '';
	}

	/**
	 * Generates the url that is displayed in the snippet preview.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function set_url() {
		_deprecated_function( 'WPSEO_Snippet_Preview::set_url', 'WPSEO 3.0', 'javascript' );
	}

	/**
	 * Sets the slug and adds it to the url if the post has been published and the post name exists.
	 *
	 * If the post is set to be the homepage the slug is also not included.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function set_slug() {
		_deprecated_function( 'WPSEO_Snippet_Preview::set_slug', 'WPSEO 3.0', 'javascript' );
	}

	/**
	 * Generates the html for the snippet preview and assign it to $this->content.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function set_content() {
		_deprecated_function( 'WPSEO_Snippet_Preview::set_content', 'WPSEO 3.0', 'javascript' );
	}

	/**
	 * Sets the html for the snippet preview through a filter
	 *
	 * @param string $content Content string.
	 *
	 * @deprecated 3.0 Removed, use javascript instead.
	 */
	protected function set_content_through_filter( $content ) {
		_deprecated_function( 'WPSEO_Snippet_Preview::set_content_through_filter', 'WPSEO 3.0', 'javascript' );
	}
}
