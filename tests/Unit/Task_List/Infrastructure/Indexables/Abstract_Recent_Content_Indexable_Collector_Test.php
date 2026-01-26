<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

use Mockery;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Recent Content Indexable Collector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Recent_Content_Indexable_Collector_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Holds the instance.
	 *
	 * @var Recent_Content_Indexable_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Recent_Content_Indexable_Collector(
			$this->indexable_repository
		);
	}

	/**
	 * Creates a raw result array as returned by the indexable repository.
	 *
	 * @param int    $object_id The object ID.
	 * @param string $title     The breadcrumb title.
	 * @param int    $score     The SEO score.
	 *
	 * @return array<string, int|string> The raw result.
	 */
	protected function create_raw_result( int $object_id, string $title, int $score ): array {
		return [
			'object_id'                   => $object_id,
			'breadcrumb_title'            => $title,
			'primary_focus_keyword_score' => $score,
		];
	}
}
