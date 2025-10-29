<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Schema filter
 *
 * Filters schema pieces by allowed types (whitelist approach).
 */
class Schema_Pieces_Filter {

	/**
	 * Configuration provider
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * Constructor
	 *
	 * @param Config $config Configuration provider.
	 */
	public function __construct( Config $config ) {
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
		// Handle string @type.
		if ( \is_string( $type ) ) {
			return $this->is_allowed_type( $type );
		}

		// Handle array @type (JSON-LD allows multiple types).
		if ( \is_array( $type ) ) {
			foreach ( $type as $single_type ) {
				// Validate each type is a string.
				if ( ! \is_string( $single_type ) ) {
					continue;
				}

				// Check if this type is allowed.
				if ( $this->is_allowed_type( $single_type ) ) {
					return true; // At least one type is allowed.
				}
			}

			return false;
		}

		// Neither an array or a string: Invalid @type format.
		\error_log( 'Yoast Schema Aggregator Filter: @type is neither string nor array' );
		return false;
	}
}
