<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Class Yoast_View_Utils.
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
	 */
	public function __construct() {
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
	 *
	 * @return object The help panel instance.
	 */
	public function search_results_setting_help( $post_type, $help_text_switch = '' ) {
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
	 * @param string $type The type of message. Can be altered to taxonomies or archives. Empty string by default.
	 *
	 * @return string The alert. Returns an empty string if the setting is enabled.
	 */
	public function generate_opengraph_disabled_alert( $type = '' ) {
		$is_enabled = WPSEO_Options::get( 'opengraph', true );

		if ( $is_enabled || ! YoastSEO()->helpers->product->is_premium() ) {
			return '';
		}

		$message = sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			\esc_html__(
				'The frontpage settings and the social image, social title and social description are hidden for all content types. If you want to show these settings, please enable the ‘Open Graph meta data’ setting on the %1$sFacebook tab of the Social section%2$s.',
				'wordpress-seo'
			),
			'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
			'</a>'
		);

		if ( $type === 'taxonomies' ) {
			$message = sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				\esc_html__(
					'The social image, social title and social description are hidden for all taxonomies. If you want to show these settings, please enable the ‘Open Graph meta data’ setting on the %1$sFacebook tab of the Social section%2$s.',
					'wordpress-seo'
				),
				'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		if ( $type === 'archives' ) {
			$message = sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				\esc_html__(
					'The social image, social title and social description are hidden for all archives. If you want to show these settings, please enable the ‘Open Graph meta data’ setting on the %1$sFacebook tab of the Social section%2$s.',
					'wordpress-seo'
				),
				'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_social#top#facebook' ) ) . '">',
				'</a>'
			);
		}

		$alert = new Alert_Presenter( $message, 'info' );

		return sprintf(
			'<div class="yoast-measure padded">%s</div>',
			$alert->present()
		);
	}
}
