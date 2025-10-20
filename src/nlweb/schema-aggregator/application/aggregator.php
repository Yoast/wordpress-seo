<?php

namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Application;

use Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain\Schema_Piece_Repository_Interface;

/**
 * Schema pieces aggregator.
 */
class Aggregator {

	/**
	 * The schema data repository.
	 *
	 * @var Schema_Piece_Repository_Interface
	 */
	protected $schema_data_repository;

	/**
	 * Constructor.
	 *
	 * @param Schema_Piece_Repository_Interface $schema_data_repository The schema data repository.
	 */
	public function __construct(
		Schema_Piece_Repository_Interface $schema_data_repository
	) {
		$this->schema_data_repository = $schema_data_repository;
	}
}
