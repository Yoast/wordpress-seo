<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;

/**
 * Schema filter
 *
 * Filters schema pieces by allowed types (whitelist approach).
 */
class Schema_Pieces_Filter {

	/**
	 * Configuration provider
	 *
	 * @var Aggregator_Config
	 */
	private $config;

	/**
	 * Constructor
	 *
	 * @param Aggregator_Config $config Configuration provider.
	 */
	public function __construct( Aggregator_Config $config ) {
		$this->config = $config;
	}

	/**
	 * Check if type is allowed.
	 *
	 * @param string $type Schema type.
	 * @return bool True if allowed.
	 */
	public function is_allowed_type( string $type ): bool {
		return \in_array( $type, $this->get_allowed_types(), true );
	}

	/**
	 * Get allowed types from config.
	 *
	 * @return array<string>
	 */
	public function get_allowed_types(): array {
		return $this->config->get_allowed_schema_types();
	}

	/**
	 * Check if entity has at least one allowed type.
	 *
	 * Handles @type as both string and array (per JSON-LD spec).
	 * Returns true if the entity's @type contains at least one allowed type.
	 *
	 * @param Schema_Piece $piece The schema piece.
	 * @return bool True if at least one type is allowed.
	 */
	public function has_allowed_type( Schema_Piece $piece ): bool {
		$type = $piece->get_type();

		if ( \is_string( $type ) ) {
			return $this->is_allowed_type( $type );
		}

		if ( \is_array( $type ) ) {
			foreach ( $type as $single_type ) {
				if ( $this->is_allowed_type( (string) $single_type ) ) {
					return true;
				}
			}

			return false;
		}

		return false;
	}
}
