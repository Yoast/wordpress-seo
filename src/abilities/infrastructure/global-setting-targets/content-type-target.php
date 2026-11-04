<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use WP_Post_Type;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * The posts of a content type, identified by its post type, which fall back to its default SEO settings.
 *
 * Created per post type by the Content_Type_Target_Factory, so it is never injected by itself. Unlike the other
 * targets, it backs the content type abilities rather than the archive and special page abilities.
 */
class Content_Type_Target implements Global_Setting_Target_Interface {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'content_type';

	/**
	 * The post type of the content type.
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Whether the post type is already known to have default SEO settings.
	 *
	 * @var bool
	 */
	private $is_known_post_type;

	/**
	 * Constructor.
	 *
	 * @param string           $post_type          The post type of the content type.
	 * @param Post_Type_Helper $post_type_helper   The post type helper.
	 * @param Options_Helper   $options_helper     The options helper.
	 * @param bool             $is_known_post_type Whether the post type is already known to have default SEO settings,
	 *                                             so it is not looked up again.
	 */
	public function __construct(
		string $post_type,
		Post_Type_Helper $post_type_helper,
		Options_Helper $options_helper,
		bool $is_known_post_type = false
	) {
		$this->post_type          = $post_type;
		$this->post_type_helper   = $post_type_helper;
		$this->options_helper     = $options_helper;
		$this->is_known_post_type = $is_known_post_type;
	}

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns the post type and the name of the content type, leaving out the name of the target, as the content type
	 * abilities have no other kind of target to tell it apart from.
	 *
	 * @return array<string, string> The identifiers, keyed by input name.
	 */
	public function get_identifiers(): array {
		$post_type_object = \get_post_type_object( $this->post_type );

		return [
			'post_type' => $this->post_type,
			'label'     => ( $post_type_object instanceof WP_Post_Type ) ? $post_type_object->label : $this->post_type,
		];
	}

	/**
	 * Fills the post type into the option pattern, as each content type has its own options.
	 *
	 * @param string $option_pattern The option pattern, like `title-%s`.
	 *
	 * @return string The option name.
	 */
	public function format_option_name( string $option_pattern ): string {
		return \sprintf( $option_pattern, $this->post_type );
	}

	/**
	 * Returns that the default SEO settings are shared by all posts of the content type.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}

	/**
	 * Returns whether the posts of the content type have pages of their own, which media pages only have when they
	 * are not redirected to the media file.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		if ( $this->post_type !== 'attachment' ) {
			return true;
		}

		return ! $this->options_helper->get( 'disable-attachment', true );
	}

	/**
	 * Ensures the content type has default SEO settings.
	 *
	 * Media is always available, like on the settings page, so its settings can be changed while its pages are
	 * redirected, ahead of enabling them.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the post type is missing or has no default SEO
	 *                                                     settings.
	 */
	public function ensure_available(): void {
		if ( $this->post_type === '' ) {
			$message = \sprintf(
				/* translators: %s expands to the name of a parameter. */
				\__( 'Provide the %s of the content type whose default SEO settings to use.', 'wordpress-seo' ),
				'post_type',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_missing_post_type', $message );
		}

		if ( $this->is_known_post_type || $this->post_type === 'attachment' ) {
			return;
		}

		if ( ! \in_array( $this->post_type, $this->post_type_helper->get_indexable_post_types(), true ) ) {
			$message = \sprintf(
				/* translators: 1: the name of a parameter, 2: the name of an ability. */
				\__( 'No content type with SEO settings exists for the given %1$s. The %2$s ability lists the ones that do.', 'wordpress-seo' ),
				'post_type',
				'yoast-seo/get-content-type-seo-settings',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_post_type', $message );
		}
	}
}
