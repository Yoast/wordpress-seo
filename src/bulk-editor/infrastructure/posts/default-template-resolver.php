<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Resolves a post's SEO/social fields from the post type's default template when the stored value
 * is empty, matching the single-post editor's fallback behaviour.
 */
class Default_Template_Resolver {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the SEO title for a post, falling back to the post type's configured template when empty.
	 *
	 * Priority mirrors the presentation layer: stored value → user-configured post type template
	 * (SEO > Settings, `title-{post_type}`) → installation default.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored title (empty string when never explicitly saved).
	 *
	 * @return string The resolved SEO title.
	 */
	public function resolve_seo_title( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		$template = (string) $this->options_helper->get( 'title-' . $post_type, '' );
		if ( $template === '' ) {
			$template = (string) $this->options_helper->get_title_default( 'title-' . $post_type );
		}
		if ( $template === '' ) {
			return '';
		}

		return (string) \wpseo_replace_vars( $template, \get_post( $post_id ) );
	}

	/**
	 * Returns the meta description for a post, falling back to the post type's configured template when empty.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored description (empty string when never explicitly saved).
	 *
	 * @return string The resolved meta description.
	 */
	public function resolve_meta_description( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		$template = (string) $this->options_helper->get( 'metadesc-' . $post_type, '' );
		if ( $template === '' ) {
			return '';
		}

		return (string) \wpseo_replace_vars( $template, \get_post( $post_id ) );
	}

	/**
	 * Returns the social title for a post, falling back to the post type's configured template when empty.
	 *
	 * Mirrors `Social_Data_Provider::get_social_title_template()`: only resolves a template when
	 * OpenGraph is enabled, and delegates to the `wpseo_social_template_post_type` filter so that
	 * Premium can supply a value while Free — which cannot configure this setting — always gets an
	 * empty string.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored social title (empty string when never explicitly saved).
	 *
	 * @return string The resolved social title.
	 */
	public function resolve_social_title( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		if ( $this->options_helper->get( 'opengraph', false ) !== true ) {
			return '';
		}

		$template = (string) \apply_filters( 'wpseo_social_template_post_type', '', 'title', $post_type );
		if ( $template === '' ) {
			return '';
		}

		return (string) \wpseo_replace_vars( $template, \get_post( $post_id ) );
	}

	/**
	 * Returns the social description for a post, falling back to the post type's configured template when empty.
	 *
	 * Mirrors `Social_Data_Provider::get_social_description_template()`: only resolves a template when
	 * OpenGraph is enabled, and delegates to the `wpseo_social_template_post_type` filter so that
	 * Premium can supply a value while Free always gets an empty string.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored social description (empty string when never explicitly saved).
	 *
	 * @return string The resolved social description.
	 */
	public function resolve_social_description( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		if ( $this->options_helper->get( 'opengraph', false ) !== true ) {
			return '';
		}

		$template = (string) \apply_filters( 'wpseo_social_template_post_type', '', 'description', $post_type );
		if ( $template === '' ) {
			return '';
		}

		return (string) \wpseo_replace_vars( $template, \get_post( $post_id ) );
	}
}
