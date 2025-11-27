<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Piece_Repository;

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
	 * The Schema_Pieces_Aggregator instance.
	 *
	 * @var Schema_Pieces_Aggregator
	 */
	private $schema_piece_aggregator;

	/**
	 * The Schema_Aggregator_Response_Composer instance.
	 *
	 * @var Schema_Aggregator_Response_Composer
	 */
	private $schema_response_composer;

	/**
	 * Aggregate_Site_Schema_Command_Handler constructor.
	 *
	 * @param Schema_Piece_Repository             $schema_piece_repository  The collector of indexables that need to be aggregated.
	 * @param Schema_Pieces_Aggregator            $schema_piece_aggregator  The schema pieces aggregator.
	 * @param Schema_Aggregator_Response_Composer $schema_response_composer The schema response composer.
	 */
	public function __construct(
		Schema_Piece_Repository $schema_piece_repository,
		Schema_Pieces_Aggregator $schema_piece_aggregator,
		Schema_Aggregator_Response_Composer $schema_response_composer
	) {
		$this->schema_piece_repository  = $schema_piece_repository;
		$this->schema_piece_aggregator  = $schema_piece_aggregator;
		$this->schema_response_composer = $schema_response_composer;
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
			$command->get_page_controls()->get_page_size(),
			$command->get_page_controls()->get_post_type()
		);

		$aggregated_schema_pieces = $this->schema_piece_aggregator->aggregate( $schema_pieces );
		$schema                   = $this->schema_response_composer->compose( $aggregated_schema_pieces, $command->get_page_controls()->get_post_type(), $command->get_page_controls()->get_page(), $command->get_page_controls()->get_page_size() );
		return $schema;
	}
}
