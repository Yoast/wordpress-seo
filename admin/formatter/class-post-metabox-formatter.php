<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

use Yoast\WP\SEO\Editors\Application\Seo\Post_Seo_Information_Repository;

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
	 * Determines whether the social templates should be used.
	 *
	 * @deprecated 21.1
	 * @codeCoverageIgnore
	 */
	public function use_social_templates() {
		_deprecated_function( __METHOD__, 'Yoast SEO 21.1' );
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

			/** @var Post_Seo_Information_Repository $repo */
			$repo = YoastSEO()->classes->get( Post_Seo_Information_Repository::class );
			$repo->set_post( $this->post );

			$values_to_set = [
				'isInsightsEnabled' => $this->is_insights_enabled(),
			];

			$values = ( $values_to_set + $values );
			$values = ( $repo->get_seo_data() + $values );
		}

		/**
		 * Filter: 'wpseo_post_edit_values' - Allows changing the values Yoast SEO uses inside the post editor.
		 *
		 * @param array   $values The key-value map Yoast SEO uses inside the post editor.
		 * @param WP_Post $post   The post opened in the editor.
		 */
		return apply_filters( 'wpseo_post_edit_values', $values, $this->post );
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
	 * Determines whether the insights feature is enabled for this post.
	 *
	 * @return bool
	 */
	protected function is_insights_enabled() {
		return WPSEO_Options::get( 'enable_metabox_insights', false );
	}
}
