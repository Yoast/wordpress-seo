<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Resolves a post's SEO/social fields to the raw template string for display in a replacement-variable editor.
 *
 * When a post has no stored value, falls back to the post type's configured template from options.
 * Only the first level of fallback is applied; deeper rendering-chain fallbacks (e.g. social description
 * falling back to meta description or excerpt) are intentionally omitted — those produce dynamic values
 * that cannot be represented as a raw template.
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
	 * Returns the raw SEO title template for a post, falling back to the post type's configured template when empty.
	 *
	 * Returns the unresolved template string (e.g. `%%title%% %%sep%% %%sitename%%`) so the caller
	 * can display it in a replacement-variable editor rather than showing the expanded value.
	 * Priority: stored value → user-configured post type template (`title-{post_type}`) → installation default.
	 *
	 * @param int    $post_id      The post ID (unused; kept for a consistent method signature).
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored title (empty string when never explicitly saved).
	 *
	 * @return string The raw template string, or an empty string when no template is configured.
	 */
	public function resolve_seo_title( int $post_id, string $post_type, string $stored_value ): string {
		return $this->resolve( $post_type, $stored_value, 'title-', true );
	}

	/**
	 * Returns the raw meta description template for a post, falling back to the post type's configured template when empty.
	 *
	 * Returns the unresolved template string so the caller can display it in a replacement-variable
	 * editor. Unlike SEO title there is no installation-level default, so an empty stored value
	 * returns an empty string when the user has not configured a post type template.
	 *
	 * @param int    $post_id      The post ID (unused; kept for a consistent method signature).
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored description (empty string when never explicitly saved).
	 *
	 * @return string The raw template string, or an empty string when no template is configured.
	 */
	public function resolve_meta_description( int $post_id, string $post_type, string $stored_value ): string {
		return $this->resolve( $post_type, $stored_value, 'metadesc-', false );
	}

	/**
	 * Returns the raw social title template for a post, falling back to the post type's configured template when empty.
	 *
	 * Returns the unresolved template string so the caller can display it in a replacement-variable editor.
	 * Only resolves a template when OpenGraph is enabled.
	 * Priority: stored value → user-configured post type template (`social-title-{post_type}`) → installation default.
	 *
	 * @param int    $post_id      The post ID (unused; kept for a consistent method signature).
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored social title (empty string when never explicitly saved).
	 *
	 * @return string The raw template string, or an empty string when no template is configured.
	 */
	public function resolve_social_title( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		if ( $this->options_helper->get( 'opengraph', false ) !== true ) {
			return '';
		}

		return $this->resolve( $post_type, '', 'social-title-', true );
	}

	/**
	 * Returns the raw social description template for a post, falling back to the post type's configured template when empty.
	 *
	 * Returns the unresolved template string so the caller can display it in a replacement-variable editor.
	 * Only resolves a template when OpenGraph is enabled. Unlike social title there is no installation-level default.
	 *
	 * @param int    $post_id      The post ID (unused; kept for a consistent method signature).
	 * @param string $post_type    The post type slug.
	 * @param string $stored_value The raw stored social description (empty string when never explicitly saved).
	 *
	 * @return string The raw template string, or an empty string when no template is configured.
	 */
	public function resolve_social_description( int $post_id, string $post_type, string $stored_value ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		if ( $this->options_helper->get( 'opengraph', false ) !== true ) {
			return '';
		}

		return $this->resolve( $post_type, '', 'social-description-', false );
	}

	/**
	 * Resolves a raw template string for a given post type, stored value, and option key prefix.
	 *
	 * @param string $post_type                The post type slug.
	 * @param string $stored_value             The raw stored value (empty string when never explicitly saved).
	 * @param string $option_key_prefix        The option key prefix (e.g. `title-`, `metadesc-`).
	 * @param bool   $use_installation_default Whether to fall back to the installation default when the configured template is empty.
	 *
	 * @return string The raw template string, or an empty string when no template is configured.
	 */
	private function resolve( string $post_type, string $stored_value, string $option_key_prefix, bool $use_installation_default ): string {
		if ( $stored_value !== '' ) {
			return $stored_value;
		}

		$option_key = $option_key_prefix . $post_type;
		$template   = (string) $this->options_helper->get( $option_key, '' );

		if ( $use_installation_default && $template === '' ) {
			$template = (string) $this->options_helper->get_title_default( $option_key );
		}

		return $template;
	}
}
