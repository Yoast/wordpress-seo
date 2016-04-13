<?php
/**
 * @package WPSEO\Admin\Formatter
 */

/**
 * This class provides data for the post metabox by return its values for localization
 */
class WPSEO_Post_Metabox_Formatter implements WPSEO_Metabox_Formatter_Interface {

	/**
	 * @var WP_Post
	 */
	private $post;

	/**
	 * @var array Array with the WPSEO_Titles options.
	 */
	protected $options;

	/**
	 * @var string The permalink to follow.
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
		$this->options   = $options;
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

		if ( is_a( $this->post, 'WP_Post' ) ) {
			$values_to_set = array(
				'keyword_usage'       => $this->get_focus_keyword_usage(),
				'title_template'      => $this->get_title_template(),
				'metadesc_template'   => $this->get_metadesc_template(),
				'metaDescriptionDate' => $this->get_metadesc_date(),
			);

			$values = ( $values_to_set + $values );
		}

		return $values;
	}

	/**
	 * Returns the url to search for keyword for the post
	 *
	 * @return string
	 */
	private function search_url() {
		return admin_url( 'edit.php?seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy
	 *
	 * @return string
	 */
	private function edit_url() {
		return admin_url( 'post.php?post={id}&action=edit' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account
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
	 * Counting the number of given keyword used for other posts than given post_id
	 *
	 * @return array
	 */
	private function get_focus_keyword_usage() {
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
	private function get_title_template() {
		return $this->get_template( 'title' );
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

		if ( isset( $this->options[ $needed_option ] ) && $this->options[ $needed_option ] !== '' ) {
			return $this->options[ $needed_option ];
		}

		return '';
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
