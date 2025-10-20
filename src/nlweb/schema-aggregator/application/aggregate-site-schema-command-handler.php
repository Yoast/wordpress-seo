<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application;

use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class that handles the Aggregate_Site_Schema_Command.
 */
class Aggregate_Site_Schema_Command_Handler {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Represents the meta tags memoizer.
	 *
	 * @var Indexable_Repository
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * Aggregate_Site_Schema_Command_Handler constructor.
	 *
	 * @param Indexable_Repository       $indexable_repository       The indexable repository.
	 * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
	 */
	public function __construct( Indexable_Repository $indexable_repository, Meta_Tags_Context_Memoizer $meta_tags_context_memoizer ) {
		$this->indexable_repository       = $indexable_repository;
		$this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
	}

	/**
	 * Handles the Aggregate_Site_Schema_Command.
	 *
	 * @param Aggregate_Site_Schema_Command $command The command.
	 *
	 * @return array<string> The aggregated schema.
	 */
	public function handle( Aggregate_Site_Schema_Command $command ): array {

		$indexables = $this->indexable_repository->find_all_public_paginated(
			$command->get_page_controls()->get_page(),
			$command->get_page_controls()->get_page_size()
		);

		// This part should be replaced by the rest of the system.
		$schema = [];
		foreach ( $indexables as $indexable ) {
			$schema[] = $this->meta_tags_context_memoizer->get( $indexable, $indexable->object_sub_type )->presentation->schema;
		}
		return $schema;
	}
}
