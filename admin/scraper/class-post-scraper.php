<?php
/**
 * @package WPSEO\Admin|Scraper
 */

/**
 * This class provides data for the js postscraper by return its values for localization
 */
class WPSEO_Post_Scraper extends WPSEO_Scraper {

	/**
	 * @var WP_Post
	 */
	private $post;

	/**
	 * WPSEO_Post_Scraper constructor.
	 *
	 * @param WP_Post $post
	 */
	public function __construct( WP_Post $post ) {
		$this->post    = $post;
		$this->options = WPSEO_Options::get_option( 'wpseo_titles' );
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = parent::get_defaults();

		$values['metaDescriptionDate'] = '';

		if ( is_a( $this->post, 'WP_Post' ) ) {
			$values_to_set = array(
				'keyword_usage'       => $this->get_focus_keyword_usage(),
				'title_template'      => $this->get_title_template(),
				'metadesc_template'   => $this->get_metadesc_template(),
				'metaDescriptionDate' => $this->get_metadesc_date(),
			);

			$values = $values_to_set + $values;
		}

		return $values;
	}

	/**
	 * Returns the url to search for keyword for the post
	 *
	 * @return string
	 */
	protected function search_url(  ) {
		admin_url( 'edit.php?seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy
	 *
	 * @return string
	 */
	protected function edit_url() {
			return admin_url( 'post.php?post={id}&action=edit' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account
	 *
	 * @return string
	 */
	protected function get_base_url_for_js() {
		global $pagenow;

		// The default base is the home_url.
		$base_url = home_url( '/', null );

		if ( 'post-new.php' === $pagenow ) {
			return $base_url;
		}

		$permalink = get_sample_permalink( null );
		$permalink = $permalink[0];

		// If %postname% is the last tag, just strip it and use that as a base.
		if ( 1 === preg_match( '#%postname%/?$#', $permalink ) ) {
			$base_url = preg_replace( '#%postname%/?$#', '', $permalink );
		}

		return $base_url;
	}


	/**
	 * Counting the number of given keyword used for other posts than given post_id
	 *
	 * @return array
	 */
	protected function get_focus_keyword_usage() {
		$keyword = WPSEO_Meta::get_value( 'focuskw', $this->post->ID );

		return array(
			$keyword => WPSEO_Meta::keyword_usage( $keyword, $this->post->ID ),
		);
	}

	/**
	 * Retrieves the title template.
	 *
	 * @return string
	 */
	protected function get_title_template() {
		$needed_option = 'title-' . $this->post->post_type;

		return $this->get_template( $needed_option );
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @return string
	 */
	protected function get_metadesc_template() {
		$needed_option = 'metadesc-' . $this->post->post_type;

		return $this->get_template( $needed_option );
	}

	/**
	 * Determines the date to be displayed in the snippet preview
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
		$post_type = $this->post->post_type;
		$key       = sprintf( 'showdate-%s', $post_type );

		return isset( $this->options[ $key ] ) && true === $this->options[ $key ];
	}

}