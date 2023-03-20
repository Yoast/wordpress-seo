<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Class Yoast_View_Utils.
 *
 * @deprecated 20.3
 * @codeCoverageIgnore
 */
class Yoast_View_Utils {

	/**
	 * Form to use.
	 *
	 * @var Yoast_Form
	 */
	protected $form;

	/**
	 * Yoast_View_Utils constructor.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );
		$this->form = Yoast_Form::get_instance();
	}

	/**
	 * Shows the search results help question mark and help section.
	 *
	 * Used for all the Help sections for indexable objects like post types, taxonomies, or archives.
	 *
	 * @param string|object $post_type        The post type to show the search results help for.
	 * @param string        $help_text_switch Switch the help text to one that's more appropriate
	 *                                        for the indexable object type the help section is for.
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @return object The help panel instance.
	 */
	public function search_results_setting_help( $post_type, $help_text_switch = '' ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );
		if ( ! is_object( $post_type ) ) {
			$post_type = get_post_type_object( $post_type );
		}

		/* translators: 1: expands to an indexable object's name, like a post type or taxonomy; 2: expands to <code>noindex</code>; 3: link open tag; 4: link close tag. */
		$help_text = esc_html__( 'Not showing %1$s in the search results technically means those will have a %2$s robots meta and will be excluded from XML sitemaps. %3$sMore info on the search results settings%4$s.', 'wordpress-seo' );

		if ( $help_text_switch === 'archive' ) {
			/* translators: 1: expands to an indexable object's name, like a post type or taxonomy; 2: expands to <code>noindex</code>; 3: link open tag; 4: link close tag. */
			$help_text = esc_html__( 'Not showing the archive for %1$s in the search results technically means those will have a %2$s robots meta and will be excluded from XML sitemaps. %3$sMore info on the search results settings%4$s.', 'wordpress-seo' );
		}

		$help_panel = new WPSEO_Admin_Help_Panel(
			// Sometimes the same post type is used more than once in the same page, we need a unique ID though.
			uniqid( 'noindex-' . $post_type->name ),
			esc_html__( 'Help on this search results setting', 'wordpress-seo' ),
			sprintf(
				$help_text,
				$post_type->labels->name,
				'<code>noindex</code>',
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/show-x' ) ) . '" target="_blank" rel="noopener noreferrer">',
				'</a>'
			)
		);

		return $help_panel;
	}

	/**
	 * Generates the OpenGraph disabled alert, depending on whether the OpenGraph feature is disabled.
	 *
	 * @param string $type The type of message. Can be altered to homepage, taxonomies or archives. Empty string by default.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @return string The alert. Returns an empty string if the setting is enabled.
	 */
	public function generate_opengraph_disabled_alert( $type = '' ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );
		$is_enabled = WPSEO_Options::get( 'opengraph', true );

		if ( $is_enabled ) {
			return '';
		}

		$message = $this->generate_opengraph_disabled_alert_text( $type );

		if ( empty( $message ) ) {
			return '';
		}

		$alert = new Alert_Presenter( $message, 'info' );

		return sprintf(
			'<div class="yoast-measure padded">%s</div>',
			$alert->present()
		);
	}

	/**
	 * Generates the OpenGraph disabled alert text.
	 *
	 * @param string $type The type of message. Can be altered to homepage, taxonomies or archives. Empty string by default.
	 *
	 * @return string The alert. Returns an empty string if the setting is enabled.
	 */
	private function generate_opengraph_disabled_alert_text( $type ) {
		if ( $type === 'homepage' ) {
			return sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__(
					'The social appearance settings for your homepage require Open Graph metadata (which is currently disabled). You can enable this in the %1$s‘Social’ settings under the ‘Facebook’ tab%2$s.',
					'wordpress-seo'
				),
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		if ( ! YoastSEO()->helpers->product->is_premium() ) {
			return '';
		}

		if ( $type === '' ) {
			return sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__(
					'The social appearance settings for content types require Open Graph metadata (which is currently disabled). You can enable this in the %1$s‘Social’ settings under the ‘Facebook’ tab%2$s.',
					'wordpress-seo'
				),
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		if ( $type === 'taxonomies' ) {
			return sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__(
					'The social appearance settings for taxonomies require Open Graph metadata (which is currently disabled). You can enable this in the %1$s‘Social’ settings under the ‘Facebook’ tab%2$s.',
					'wordpress-seo'
				),
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		if ( $type === 'archives' ) {
			return sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__(
					'The social appearance settings for archives require Open Graph metadata (which is currently disabled). You can enable this in the %1$s‘Social’ settings under the ‘Facebook’ tab%2$s.',
					'wordpress-seo'
				),
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		return '';
	}
}
