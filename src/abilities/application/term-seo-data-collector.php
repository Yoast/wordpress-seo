<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;

/**
 * Application service that reads the SEO data of a single term.
 *
 * Only terms the current user may edit are exposed.
 */
class Term_SEO_Data_Collector {

	/**
	 * The term identifier resolver.
	 *
	 * @var Term_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The term SEO field map.
	 *
	 * @var Term_SEO_Field_Map
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
	 * @param Term_Identifier_Resolver $resolver       The term identifier resolver.
	 * @param Term_SEO_Field_Map       $field_map      The term SEO field map.
	 * @param Indexable_Access_Checker $access_checker The indexable access checker.
	 */
	public function __construct(
		Term_Identifier_Resolver $resolver,
		Term_SEO_Field_Map $field_map,
		Indexable_Access_Checker $access_checker
	) {
		$this->resolver       = $resolver;
		$this->field_map      = $field_map;
		$this->access_checker = $access_checker;
	}

	/**
	 * Retrieves the SEO data for the term matching the input.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing a 'term_id' or 'permalink'.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The SEO data of the term, or an error.
	 */
	public function get_term_seo_data( array $input ) {
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
