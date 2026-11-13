<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;

/**
 * Application service that reads the SEO data of a single author archive.
 *
 * Only users the current user may edit are exposed.
 */
class Author_SEO_Data_Collector {

	/**
	 * The author identifier resolver.
	 *
	 * @var Author_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The author SEO field map.
	 *
	 * @var Author_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable access checker.
	 *
	 * @var Indexable_Access_Checker
	 */
	private $access_checker;

	/**
	 * Constructor.
	 *
	 * @param Author_Identifier_Resolver $resolver       The author identifier resolver.
	 * @param Author_SEO_Field_Map       $field_map      The author SEO field map.
	 * @param Indexable_Access_Checker   $access_checker The indexable access checker.
	 */
	public function __construct(
		Author_Identifier_Resolver $resolver,
		Author_SEO_Field_Map $field_map,
		Indexable_Access_Checker $access_checker
	) {
		$this->resolver       = $resolver;
		$this->field_map      = $field_map;
		$this->access_checker = $access_checker;
	}

	/**
	 * Retrieves the SEO data for the author matching the input.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing a 'user_id' or 'permalink'.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The SEO data of the author, or an error.
	 */
	public function get_author_seo_data( array $input ) {
		$indexable = $this->resolver->resolve_one( $input );

		if ( $indexable instanceof WP_Error ) {
			return $indexable;
		}

		$can_edit = $this->access_checker->ensure_can_edit( $indexable );

		if ( $can_edit instanceof WP_Error ) {
			return $can_edit;
		}

		return $this->field_map->to_seo_array( $indexable );
	}
}
