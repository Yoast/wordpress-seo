<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;

/**
 * Provides the targets of the archive and special page abilities: the ones that are a single group of pages each, and
 * the archives that exist once per content type or taxonomy.
 *
 * @internal Backs the global SEO settings abilities. Not meant to be used outside of Yoast SEO, so it can change
 *           at any time without notice.
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
	 * The factory of the taxonomy archive targets.
	 *
	 * @var Taxonomy_Archive_Target_Factory
	 */
	private $taxonomy_archive_factory;

	/**
	 * Constructor.
	 *
	 * The targets are listed instead of injected as a variadic, as the targets that exist once per content type or
	 * taxonomy implement the same interface but cannot be autowired.
	 *
	 * @param Homepage_Target                  $homepage                  The homepage target.
	 * @param Author_Archives_Target           $author_archives           The author archives target.
	 * @param Date_Archives_Target             $date_archives             The date archives target.
	 * @param Search_Page_Target               $search_page               The search page target.
	 * @param Not_Found_Page_Target            $not_found_page            The 404 page target.
	 * @param Post_Type_Archive_Target_Factory $post_type_archive_factory The factory of the content type archive
	 *                                                                    targets.
	 * @param Taxonomy_Archive_Target_Factory  $taxonomy_archive_factory  The factory of the taxonomy archive targets.
	 */
	public function __construct(
		Homepage_Target $homepage,
		Author_Archives_Target $author_archives,
		Date_Archives_Target $date_archives,
		Search_Page_Target $search_page,
		Not_Found_Page_Target $not_found_page,
		Post_Type_Archive_Target_Factory $post_type_archive_factory,
		Taxonomy_Archive_Target_Factory $taxonomy_archive_factory
	) {
		foreach ( [ $homepage, $author_archives, $date_archives, $search_page, $not_found_page ] as $target ) {
			$this->single_targets[ $target->get_name() ] = $target;
		}

		$this->post_type_archive_factory = $post_type_archive_factory;
		$this->taxonomy_archive_factory  = $taxonomy_archive_factory;
	}

	/**
	 * Returns the names of all targets, as agents pass them to the abilities, in the order of the settings page:
	 * content types, categories & tags, then the advanced settings.
	 *
	 * @return array<string> The names.
	 */
	public function get_names(): array {
		return [
			Homepage_Target::NAME,
			Post_Type_Archive_Target::NAME,
			Taxonomy_Archive_Target::NAME,
			Author_Archives_Target::NAME,
			Date_Archives_Target::NAME,
			Search_Page_Target::NAME,
			Not_Found_Page_Target::NAME,
		];
	}

	/**
	 * Returns all targets whose global settings can be changed on the site, leaving out the ones that cannot, like
	 * a static homepage or the WooCommerce Shop page.
	 *
	 * @return array<Global_Setting_Target_Interface> The targets.
	 */
	public function get_all(): array {
		$targets = [];
		foreach ( $this->get_names() as $name ) {
			$targets = \array_merge( $targets, $this->filter_available( $this->create_all( $name ) ) );
		}

		return $targets;
	}

	/**
	 * Returns a target by its name and, for the targets that exist once per content type or taxonomy, the post type
	 * or the taxonomy.
	 *
	 * @param string $name      The name of the target.
	 * @param string $post_type The post type, for the targets that exist once per content type.
	 * @param string $taxonomy  The taxonomy, for the targets that exist once per taxonomy.
	 *
	 * @return Global_Setting_Target_Interface The target, which is not guaranteed to be available.
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When no target has that name.
	 */
	public function get( string $name, string $post_type, string $taxonomy ): Global_Setting_Target_Interface {
		switch ( $name ) {
			case Post_Type_Archive_Target::NAME:
				return $this->post_type_archive_factory->create( $post_type );
			case Taxonomy_Archive_Target::NAME:
				return $this->taxonomy_archive_factory->create( $taxonomy );
		}

		if ( isset( $this->single_targets[ $name ] ) ) {
			return $this->single_targets[ $name ];
		}

		$message = \__( 'The given target is not valid.', 'wordpress-seo' );

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
		throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_target', $message );
	}

	/**
	 * Creates all targets of a name, whether or not they are available.
	 *
	 * @param string $name The name of the target.
	 *
	 * @return array<Global_Setting_Target_Interface> The targets.
	 */
	private function create_all( string $name ): array {
		switch ( $name ) {
			case Post_Type_Archive_Target::NAME:
				return $this->post_type_archive_factory->create_all();
			case Taxonomy_Archive_Target::NAME:
				return $this->taxonomy_archive_factory->create_all();
		}

		return [ $this->single_targets[ $name ] ];
	}

	/**
	 * Leaves out the targets whose global settings cannot be changed.
	 *
	 * @param array<Global_Setting_Target_Interface> $targets The targets.
	 *
	 * @return array<Global_Setting_Target_Interface> The available targets.
	 */
	private function filter_available( array $targets ): array {
		$available = [];
		foreach ( $targets as $target ) {
			try {
				$target->ensure_available();
			} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
				continue;
			}

			$available[] = $target;
		}

		return $available;
	}
}
