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
	 * Constructor.
	 *
	 * @param WP_Post|array $post      Post object.
	 * @param array         $options   Title options to use.
	 * @param string        $structure The permalink to follow.
	 */
	public function __construct( $post, array $options, $structure ) {
		$this->post      = $post;
		$this->permalink = $structure;
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = array(
			'search_url'          => $this->search_url(),
			'post_edit_url'       => $this->edit_url(),
			'base_url'            => $this->base_url_for_js(),
			'metaDescriptionDate' => '',

		);

		if ( $this->post instanceof WP_Post ) {
			$values_to_set = array(
				'keyword_usage'            => $this->get_focus_keyword_usage(),
				'title_template'           => $this->get_title_template(),
				'metadesc_template'        => $this->get_metadesc_template(),
				'metaDescriptionDate'      => $this->get_metadesc_date(),
				'social_preview_image_url' => $this->get_image_url(),
			);

			$values = ( $values_to_set + $values );
		}

		return $values;
	}

	/**
	 * Gets the image URL for the post's social preview.
	 *
	 * @return string|null The image URL for the social preview.
	 */
	protected function get_image_url() {
		$post_id = $this->post->ID;

		if ( has_post_thumbnail( $post_id ) ) {
			$featured_image_info = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'thumbnail' );
			return $featured_image_info[0];
		}

		return WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );
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

		if ( 'post-new.php' === $pagenow ) {
			return $base_url;
		}

		// If %postname% is the last tag, just strip it and use that as a base.
		if ( 1 === preg_match( '#%postname%/?$#', $this->permalink ) ) {
			$base_url = preg_replace( '#%postname%/?$#', '', $this->permalink );
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
		$usage   = array( $keyword => $this->get_keyword_usage_for_current_post( $keyword ) );

		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return $this->get_premium_keywords( $usage );
		}

		return $usage;
	}

	/**
	 * Retrieves the additional keywords from Premium, that are associated with the post.
	 *
	 * @param array $usage The original keyword usage for the main keyword.
	 *
	 * @return array The keyword usage, including the additional keywords.
	 */
	protected function get_premium_keywords( $usage ) {
		$additional_keywords = json_decode( WPSEO_Meta::get_value( 'focuskeywords', $this->post->ID ), true );

		if ( empty( $additional_keywords ) ) {
			return $usage;
		}

		foreach ( $additional_keywords as $additional_keyword ) {
			$keyword = $additional_keyword['keyword'];

			$usage[ $keyword ] = $this->get_keyword_usage_for_current_post( $keyword );
		}

		return $usage;
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
	 * @return string The title template.
	 */
	private function get_title_template() {
		$title = $this->get_template( 'title' );

		if ( $title === '' ) {
			return '%%title%% %%sep%% %%sitename%%';
		}

		return $title;
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string
	 */
	private function get_metadesc_template() {
		return $this->get_template( 'metadesc' );
	}

	/**
	 * Retrieves a template.
	 *
	 * @param String $template_option_name The name of the option in which the template you want to get is saved.
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
	 * Determines the date to be displayed in the snippet preview.
	 *
	 * @return string
	 */
	private function get_metadesc_date() {
		$date = '';

		if ( $this->is_show_date_enabled() ) {
			$date = date_i18n( 'M j, Y', mysql2date( 'U', $this->post->post_date ) );
		}

		return $date;
	}

	/**
	 * Returns whether or not showing the date in the snippet preview is enabled.
	 *
	 * @return bool
	 */
	private function is_show_date_enabled() {
		$key = sprintf( 'showdate-%s', $this->post->post_type );

		return WPSEO_Options::get( $key, true );
	}
}
