<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application;

use Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Schema_Piece_Repository;

/**
 * Class that handles the Aggregate_Site_Schema_Command.
 */
class Aggregate_Site_Schema_Command_Handler {

	/**
	 * The Schema_Piece_Repository instance.
	 *
	 * @var Schema_Piece_Repository
	 */
	private $schema_piece_repository;

	/**
	 * Aggregate_Site_Schema_Command_Handler constructor.
	 *
	 * @param Schema_Piece_Repository $schema_piece_repository The collector of indexables that need to be aggregated.
	 */
	public function __construct( Schema_Piece_Repository $schema_piece_repository ) {
		$this->schema_piece_repository = $schema_piece_repository;
	}

	/**
	 * Handles the Aggregate_Site_Schema_Command.
	 *
	 * @param Aggregate_Site_Schema_Command $command The command.
	 *
	 * @return array<string> The aggregated schema.
	 */
	public function handle( Aggregate_Site_Schema_Command $command ): array {

		$schema_pieces = $this->schema_piece_repository->get(
			$command->get_page_controls()->get_page(),
			$command->get_page_controls()->get_page_size()
		);

		// This part should be replaced by the rest of the system.
		$schema = [];
		foreach ( $schema_pieces as $schema_piece ) {
			$schema[] = $schema_piece->get_data();
		}
		return $schema;
	}
}
