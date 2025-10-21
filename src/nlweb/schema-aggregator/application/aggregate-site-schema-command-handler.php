<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application;

use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\To_Aggregate_Indexable_Collector;

/**
 * Class that handles the Aggregate_Site_Schema_Command.
 */
class Aggregate_Site_Schema_Command_Handler {

	/**
	 * The To_Aggregate_Indexable_Collector instance.
	 *
	 * @var To_Aggregate_Indexable_Collector
	 */
	private $to_aggregate_indexable_collector;

	/**
	 * Represents the meta tags memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * Aggregate_Site_Schema_Command_Handler constructor.
	 *
	 * @param To_Aggregate_Indexable_Collector $to_aggregate_indexable_collector The collector of indexables that need to be aggregated.
	 * @param Meta_Tags_Context_Memoizer       $meta_tags_context_memoizer       The meta tags context memoizer.
	 */
	public function __construct( To_Aggregate_Indexable_Collector $to_aggregate_indexable_collector, Meta_Tags_Context_Memoizer $meta_tags_context_memoizer ) {
		$this->to_aggregate_indexable_collector = $to_aggregate_indexable_collector;
		$this->meta_tags_context_memoizer       = $meta_tags_context_memoizer;
	}

	/**
	 * Handles the Aggregate_Site_Schema_Command.
	 *
	 * @param Aggregate_Site_Schema_Command $command The command.
	 *
	 * @return array<string> The aggregated schema.
	 */
	public function handle( Aggregate_Site_Schema_Command $command ): array {

		$indexables = $this->to_aggregate_indexable_collector->get(
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
