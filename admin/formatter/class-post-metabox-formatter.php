<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

/**
 * This class provides data for the post metabox by return its values for localization.
 */
class WPSEO_Post_Metabox_Formatter implements WPSEO_Metabox_Formatter_Interface {

	/**
	 * Holds the WordPress Post.
	 *
	 * @var WP_Post
	 */
	private $post;

	/**
	 * The permalink to follow.
	 *
	 * @var string
	 */
	private $permalink;

	/**
	 * Whether we must return social templates values.
	 *
	 * @var bool
	 */
	private $use_social_templates = false;

	/**
	 * Constructor.
	 *
	 * @param WP_Post|array $post      Post object.
	 * @param array         $options   Title options to use.
	 * @param string        $structure The permalink to follow.
	 */
	public function __construct( $post, array $options, $structure ) {
		$this->post      = $post;
		$this->permalink = $structure;

		$this->use_social_templates = $this->use_social_templates();
	}

	/**
	 * Determines whether the social templates should be used.
	 *
	 * @return bool Whether the social templates should be used.
	 */
	public function use_social_templates() {
		return WPSEO_Options::get( 'opengraph', false ) === true;
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = [
			'search_url'          => $this->search_url(),
			'post_edit_url'       => $this->edit_url(),
			'base_url'            => $this->base_url_for_js(),
			'metaDescriptionDate' => '',
		];

		if ( $this->post instanceof WP_Post ) {
			$values_to_set = [
				'keyword_usage'               => $this->get_focus_keyword_usage(),
				'title_template'              => $this->get_title_template(),
				'title_template_no_fallback'  => $this->get_title_template( false ),
				'metadesc_template'           => $this->get_metadesc_template(),
				'metaDescriptionDate'         => $this->get_metadesc_date(),
				'first_content_image'         => $this->get_image_url(),
				'social_title_template'       => $this->get_social_title_template(),
				'social_description_template' => $this->get_social_description_template(),
				'social_image_template'       => $this->get_social_image_template(),
				'isInsightsEnabled'           => $this->is_insights_enabled(),
			];

			$values = ( $values_to_set + $values );
		}

		/**
		 * Filter: 'wpseo_post_edit_values' - Allows changing the values Yoast SEO uses inside the post editor.
		 *
		 * @api array $values The key-value map Yoast SEO uses inside the post editor.
		 *
		 * @param WP_Post $post The post opened in the editor.
		 */
		return \apply_filters( 'wpseo_post_edit_values', $values, $this->post );
	}

	/**
	 * Gets the image URL for the post's social preview.
	 *
	 * @return string|null The image URL for the social preview.
	 */
	protected function get_image_url() {
		return WPSEO_Image_Utils::get_first_usable_content_image_for_post( $this->post->ID );
	}

	/**
	 * Returns the url to search for keyword for the post.
	 *
	 * @return string
	 */
	private function search_url() {
		return admin_url( 'edit.php?seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url() {
		return admin_url( 'post.php?post={id}&action=edit' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js() {
		global $pagenow;

		// The default base is the home_url.
		$base_url = home_url( '/', null );

		if ( $pagenow === 'post-new.php' ) {
			return $base_url;
		}

		// If %postname% is the last tag, just strip it and use that as a base.
		if ( preg_match( '#%postname%/?$#', $this->permalink ) === 1 ) {
			$base_url = preg_replace( '#%postname%/?$#', '', $this->permalink );
		}

		// If %pagename% is the last tag, just strip it and use that as a base.
		if ( preg_match( '#%pagename%/?$#', $this->permalink ) === 1 ) {
			$base_url = preg_replace( '#%pagename%/?$#', '', $this->permalink );
		}

		return $base_url;
	}

	/**
	 * Counts the number of given keywords used for other posts other than the given post_id.
	 *
	 * @return array The keyword and the associated posts that use it.
	 */
	private function get_focus_keyword_usage() {
		$keyword = WPSEO_Meta::get_value( 'focuskw', $this->post->ID );
		$usage   = [ $keyword => $this->get_keyword_usage_for_current_post( $keyword ) ];

		/**
		* Allows enhancing the array of posts' that share their focus keywords with the post's related keywords.
		*
		* @param array $usage   The array of posts' ids that share their focus keywords with the post.
		* @param int   $post_id The id of the post we're finding the usage of related keywords for.
		*/
		return apply_filters( 'wpseo_posts_for_related_keywords', $usage, $this->post->ID );
	}

	/**
	 * Gets the keyword usage for the current post and the specified keyword.
	 *
	 * @param string $keyword The keyword to check the usage of.
	 *
	 * @return array The post IDs which use the passed keyword.
	 */
	protected function get_keyword_usage_for_current_post( $keyword ) {
		return WPSEO_Meta::keyword_usage( $keyword, $this->post->ID );
	}

	/**
	 * Retrieves the title template.
	 *
	 * @param bool $fallback Whether to return the hardcoded fallback if the template value is empty.
	 *
	 * @return string The title template.
	 */
	private function get_title_template( $fallback = true ) {
		$title = $this->get_template( 'title' );

		if ( $title === '' && $fallback === true ) {
			return '%%title%% %%page%% %%sep%% %%sitename%%';
		}

		return $title;
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string The metadesc template.
	 */
	private function get_metadesc_template() {
		return $this->get_template( 'metadesc' );
	}

	/**
	 * Retrieves the social title template.
	 *
	 * @return string The social title template.
	 */
	private function get_social_title_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'title' );
		}

		return '';
	}

	/**
	 * Retrieves the social description template.
	 *
	 * @return string The social description template.
	 */
	private function get_social_description_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'description' );
		}

		return '';
	}

	/**
	 * Retrieves the social image template.
	 *
	 * @return string The social description template.
	 */
	private function get_social_image_template() {
		if ( $this->use_social_templates ) {
			return $this->get_social_template( 'image-url' );
		}

		return '';
	}

	/**
	 * Retrieves a template.
	 *
	 * @param string $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private function get_template( $template_option_name ) {
		$needed_option = $template_option_name . '-' . $this->post->post_type;

		if ( WPSEO_Options::get( $needed_option, '' ) !== '' ) {
			return WPSEO_Options::get( $needed_option );
		}

		return '';
	}

	/**
	 * Retrieves a social template.
	 *
	 * @param string $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private function get_social_template( $template_option_name ) {
		/**
		 * Filters the social template value for a given post type.
		 *
		 * @param string $template             The social template value, defaults to empty string.
		 * @param string $template_option_name The subname of the option in which the template you want to get is saved.
		 * @param string $post_type            The name of the post type.
		 */
		return \apply_filters( 'wpseo_social_template_post_type', '', $template_option_name, $this->post->post_type );
	}

	/**
	 * Determines the date to be displayed in the snippet preview.
	 *
	 * @return string
	 */
	private function get_metadesc_date() {
		return YoastSEO()->helpers->date->format_translated( $this->post->post_date, 'M j, Y' );
	}

	/**
	 * Determines whether the insights feature is enabled for this post.
	 *
	 * @return bool
	 */
	protected function is_insights_enabled() {
		return WPSEO_Options::get( 'enable_metabox_insights', false );
	}
}
