<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use WP_Post_Type;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;

/**
 * The archive of a content type, identified by its post type.
 *
 * Created per post type by the Post_Type_Archive_Target_Factory, so it is never injected by itself.
 */
class Post_Type_Archive_Target extends Abstract_Global_Setting_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'post_type_archive';

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
	 * The WooCommerce helper.
	 *
	 * @var Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * Whether the post type is already known to have an archive with global settings.
	 *
	 * @var bool
	 */
	private $is_known_archive;

	/**
	 * Constructor.
	 *
	 * @param string             $post_type          The post type of the content type.
	 * @param Post_Type_Helper   $post_type_helper   The post type helper.
	 * @param Woocommerce_Helper $woocommerce_helper The WooCommerce helper.
	 * @param bool               $is_known_archive   Whether the post type is already known to have an archive with
	 *                                               global settings, so it is not looked up again.
	 */
	public function __construct( string $post_type, Post_Type_Helper $post_type_helper, Woocommerce_Helper $woocommerce_helper, bool $is_known_archive = false ) {
		$this->post_type          = $post_type;
		$this->post_type_helper   = $post_type_helper;
		$this->woocommerce_helper = $woocommerce_helper;
		$this->is_known_archive   = $is_known_archive;
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
	 * Returns the name of the target, the post type and the name of the content type.
	 *
	 * @return array<string, string> The identifiers, keyed by input name.
	 */
	public function get_identifiers(): array {
		$post_type_object = \get_post_type_object( $this->post_type );

		return [
			'target'    => self::NAME,
			'post_type' => $this->post_type,
			'label'     => ( $post_type_object instanceof WP_Post_Type ) ? $post_type_object->label : $this->post_type,
		];
	}

	/**
	 * Fills the post type into the option pattern, as each content type archive has its own options.
	 *
	 * @param string $option_pattern The option pattern, like `title-ptarchive-%s`.
	 *
	 * @return string The option name.
	 */
	public function format_option_name( string $option_pattern ): string {
		return \sprintf( $option_pattern, $this->post_type );
	}

	/**
	 * Ensures the content type has an archive with global settings.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the post type is missing or has no such archive.
	 */
	public function ensure_available(): void {
		if ( $this->post_type === '' ) {
			$message = \sprintf(
				/* translators: %s expands to the name of a parameter. */
				\__( 'Provide the %s of the content type whose archive to update.', 'wordpress-seo' ),
				'post_type',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_missing_post_type', $message );
		}

		// Targets built from the list of archives skip the lookup, so listing them does not rebuild that list per archive.
		if ( ! $this->is_known_archive && ! \array_key_exists( $this->post_type, $this->post_type_helper->get_indexable_post_archives() ) ) {
			$message = \sprintf(
				/* translators: 1: the name of a parameter, 2: the name of an ability. */
				\__( 'No content type archive with SEO data exists for the given %1$s. The %2$s ability lists the ones that do.', 'wordpress-seo' ),
				'post_type',
				'yoast-seo/get-archive-and-special-page-seo-settings',
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_post_type', $message );
		}

		// Checked after the archive, so the Shop page is only pointed to when the product archive has SEO data.
		if ( $this->post_type === 'product' && $this->woocommerce_helper->is_active() ) {
			throw $this->get_woocommerce_shop_exception();
		}
	}

	/**
	 * Returns the exception that points to the Shop page, which the product archive takes its SEO data from when
	 * WooCommerce is active.
	 *
	 * @return Unavailable_Global_Setting_Target_Exception The exception.
	 */
	private function get_woocommerce_shop_exception(): Unavailable_Global_Setting_Target_Exception {
		$shop_page_id = (int) $this->woocommerce_helper->get_shop_page_id();

		if ( $shop_page_id < 1 ) {
			return new Unavailable_Global_Setting_Target_Exception(
				'yoast_seo_woocommerce_shop_page',
				\sprintf(
					/* translators: %1$s expands to WooCommerce. */
					\__( 'With %1$s active, the product archive takes its SEO data from the Shop page, but no Shop page is set in the %1$s settings.', 'wordpress-seo' ),
					'WooCommerce',
				),
			);
		}

		return new Unavailable_Global_Setting_Target_Exception(
			'yoast_seo_woocommerce_shop_page',
			\sprintf(
				/* translators: 1: WooCommerce, 2: the ID of a page, 3: the name of an ability. */
				\__( 'With %1$s active, the product archive takes its SEO data from the Shop page (ID %2$d), so it is set on that page with the %3$s ability instead.', 'wordpress-seo' ),
				'WooCommerce',
				$shop_page_id,
				'yoast-seo/update-post-seo-data',
			),
		);
	}
}
