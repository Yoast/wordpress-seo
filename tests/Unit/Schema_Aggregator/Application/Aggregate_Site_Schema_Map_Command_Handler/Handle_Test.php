<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Interface;

/**
 * Tests the Aggregate_Site_Schema_Map_Command_Handler handle method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler::handle
 */
final class Handle_Test extends Abstract_Aggregate_Site_Schema_Map_Command_Handler_Test {

	/**
	 * Tests handle method orchestrates the schema map generation process with indexables enabled.
	 *
	 * @return void
	 */
	public function test_handle_orchestrates_schema_map_generation_with_indexables_enabled() {
		$command    = new Aggregate_Site_Schema_Map_Command( [ 'post', 'page' ] );
		$repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$indexable_counts = new Indexable_Count_Collection();
		$indexable_counts->add_indexable_count( new Indexable_Count( 'post', 100 ) );
		$indexable_counts->add_indexable_count( new Indexable_Count( 'page', 50 ) );

		$schema_map = [
			[
				'post_type' => 'post',
				'url'       => 'https://example.com',
				'lastmod'   => '2024-01-01',
				'count'     => 100,
			],
		];
		$xml_output = '<xml>schema map</xml>';

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturn( true );

		$this->schema_map_repository_factory
			->expects( 'get_repository' )
			->once()
			->with( true )
			->andReturn( $repository );

		$repository
			->expects( 'get_indexable_count_per_post_type' )
			->once()
			->with( [ 'post', 'page' ] )
			->andReturn( $indexable_counts );

		$this->schema_map_builder
			->expects( 'with_repository' )
			->once()
			->with( $repository )
			->andReturnSelf();

		$this->schema_map_builder
			->expects( 'build' )
			->once()
			->with( $indexable_counts )
			->andReturn( $schema_map );

		$this->schema_map_xml_renderer
			->expects( 'render' )
			->once()
			->with( $schema_map )
			->andReturn( $xml_output );

		$result = $this->instance->handle( $command );

		$this->assertSame( $xml_output, $result );
	}

	/**
	 * Tests handle method with indexables disabled.
	 *
	 * @return void
	 */
	public function test_handle_with_indexables_disabled() {
		$command    = new Aggregate_Site_Schema_Map_Command( [ 'post' ] );
		$repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$indexable_counts = new Indexable_Count_Collection();
		$schema_map       = [];
		$xml_output       = '<xml>map</xml>';

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturn( false );

		$this->schema_map_repository_factory
			->expects( 'get_repository' )
			->once()
			->with( false )
			->andReturn( $repository );

		$repository
			->expects( 'get_indexable_count_per_post_type' )
			->once()
			->with( [ 'post' ] )
			->andReturn( $indexable_counts );

		$this->schema_map_builder
			->expects( 'with_repository' )
			->once()
			->with( $repository )
			->andReturnSelf();

		$this->schema_map_builder
			->expects( 'build' )
			->once()
			->andReturn( $schema_map );

		$this->schema_map_xml_renderer
			->expects( 'render' )
			->once()
			->andReturn( $xml_output );

		$result = $this->instance->handle( $command );

		$this->assertSame( $xml_output, $result );
	}

	/**
	 * Tests handle method returns string.
	 *
	 * @return void
	 */
	public function test_handle_returns_string() {
		$command    = new Aggregate_Site_Schema_Map_Command( [] );
		$repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->andReturn( true );

		$this->schema_map_repository_factory
			->expects( 'get_repository' )
			->andReturn( $repository );

		$repository
			->expects( 'get_indexable_count_per_post_type' )
			->andReturn( new Indexable_Count_Collection() );

		$this->schema_map_builder
			->expects( 'with_repository' )
			->andReturnSelf();

		$this->schema_map_builder
			->expects( 'build' )
			->andReturn( [] );

		$this->schema_map_xml_renderer
			->expects( 'render' )
			->andReturn( '' );

		$result = $this->instance->handle( $command );

		$this->assertIsString( $result );
	}

	/**
	 * Tests handle method with multiple post types.
	 *
	 * @return void
	 */
	public function test_handle_with_multiple_post_types() {
		$command    = new Aggregate_Site_Schema_Map_Command( [ 'post', 'page', 'product' ] );
		$repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$indexable_counts = new Indexable_Count_Collection();
		$indexable_counts->add_indexable_count( new Indexable_Count( 'post', 100 ) );
		$indexable_counts->add_indexable_count( new Indexable_Count( 'page', 50 ) );
		$indexable_counts->add_indexable_count( new Indexable_Count( 'product', 25 ) );

		$schema_map = [
			[
				'post_type' => 'post',
				'url'       => 'https://example.com/post',
				'lastmod'   => '2024-01-01',
				'count'     => 100,
			],
			[
				'post_type' => 'page',
				'url'       => 'https://example.com/page',
				'lastmod'   => '2024-01-01',
				'count'     => 50,
			],
		];
		$xml_output = '<xml>complete map</xml>';

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturn( true );

		$this->schema_map_repository_factory
			->expects( 'get_repository' )
			->once()
			->andReturn( $repository );

		$repository
			->expects( 'get_indexable_count_per_post_type' )
			->once()
			->with( [ 'post', 'page', 'product' ] )
			->andReturn( $indexable_counts );

		$this->schema_map_builder
			->expects( 'with_repository' )
			->once()
			->andReturnSelf();

		$this->schema_map_builder
			->expects( 'build' )
			->once()
			->andReturn( $schema_map );

		$this->schema_map_xml_renderer
			->expects( 'render' )
			->once()
			->andReturn( $xml_output );

		$result = $this->instance->handle( $command );

		$this->assertSame( $xml_output, $result );
	}
}
