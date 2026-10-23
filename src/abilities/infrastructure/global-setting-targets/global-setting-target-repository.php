<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;

/**
 * Provides the global setting targets: the ones that are a single group of pages each, and the content type archives.
 */
class Global_Setting_Target_Repository {

	/**
	 * The targets that are a single group of pages each, keyed by name.
	 *
	 * @var array<string, Global_Setting_Target_Interface>
	 */
	private $single_targets = [];

	/**
	 * The factory of the content type archive targets.
	 *
	 * @var Post_Type_Archive_Target_Factory
	 */
	private $post_type_archive_factory;

	/**
	 * Constructor.
	 *
	 * The targets are listed instead of injected as a variadic, as the content type archive target implements the
	 * same interface but cannot be autowired.
	 *
	 * @param Homepage_Target                  $homepage                  The homepage target.
	 * @param Author_Archives_Target           $author_archives           The author archives target.
	 * @param Date_Archives_Target             $date_archives             The date archives target.
	 * @param Search_Page_Target               $search_page               The search page target.
	 * @param Not_Found_Page_Target            $not_found_page            The 404 page target.
	 * @param Post_Type_Archive_Target_Factory $post_type_archive_factory The factory of the content type archive
	 *                                                                    targets.
	 */
	public function __construct(
		Homepage_Target $homepage,
		Author_Archives_Target $author_archives,
		Date_Archives_Target $date_archives,
		Search_Page_Target $search_page,
		Not_Found_Page_Target $not_found_page,
		Post_Type_Archive_Target_Factory $post_type_archive_factory
	) {
		foreach ( [ $homepage, $author_archives, $date_archives, $search_page, $not_found_page ] as $target ) {
			$this->single_targets[ $target->get_name() ] = $target;
		}

		$this->post_type_archive_factory = $post_type_archive_factory;
	}

	/**
	 * Returns the names of all targets, as agents pass them to the abilities.
	 *
	 * @return array<string> The names.
	 */
	public function get_names(): array {
		return \array_merge( \array_keys( $this->single_targets ), [ Post_Type_Archive_Target::NAME ] );
	}

	/**
	 * Returns all targets whose global settings can be changed on the site, leaving out the ones that cannot, like
	 * a static homepage or the WooCommerce Shop page.
	 *
	 * @return array<Global_Setting_Target_Interface> The targets.
	 */
	public function get_all(): array {
		$targets = [];

		foreach ( \array_merge( \array_values( $this->single_targets ), $this->post_type_archive_factory->create_all() ) as $target ) {
			try {
				$target->ensure_available();
			} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
				continue;
			}

			$targets[] = $target;
		}

		return $targets;
	}

	/**
	 * Returns a target by its name and, for the archive of a content type, its post type.
	 *
	 * @param string $name      The name of the target.
	 * @param string $post_type The post type, for the archive of a content type.
	 *
	 * @return Global_Setting_Target_Interface The target.
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When no target has that name.
	 */
	public function get( string $name, string $post_type ): Global_Setting_Target_Interface {
		if ( $name === Post_Type_Archive_Target::NAME ) {
			return $this->post_type_archive_factory->create( $post_type );
		}

		if ( isset( $this->single_targets[ $name ] ) ) {
			return $this->single_targets[ $name ];
		}

		$message = \__( 'The given target is not valid.', 'wordpress-seo' );

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
		throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_target', $message );
	}
}
