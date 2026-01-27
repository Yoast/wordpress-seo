<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

use Mockery;
use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface;
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
	 * The SEO score groups repository mock.
	 *
	 * @var Mockery\MockInterface|SEO_Score_Groups_Repository
	 */
	protected $seo_score_groups_repository;

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

		$this->indexable_repository        = Mockery::mock( Indexable_Repository::class );
		$this->seo_score_groups_repository = Mockery::mock( SEO_Score_Groups_Repository::class );

		$this->instance = new Recent_Content_Indexable_Collector(
			$this->indexable_repository,
			$this->seo_score_groups_repository
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

	/**
	 * Sets up the SEO score groups repository to return a score group with the given name.
	 *
	 * @param int    $score      The score to expect.
	 * @param string $group_name The group name to return.
	 *
	 * @return void
	 */
	protected function expect_score_group( int $score, string $group_name ): void {
		$score_group = Mockery::mock( SEO_Score_Groups_Interface::class );
		$score_group->expects( 'get_name' )->andReturn( $group_name );

		$this->seo_score_groups_repository
			->expects( 'get_seo_score_group' )
			->with( $score )
			->andReturn( $score_group );
	}
}
