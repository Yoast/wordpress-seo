<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Schema_Aggregator\Person_Schema_Enhancer_Double;

/**
 * Tests the Person_Schema_Enhancer class enhance method.
 *
 * @group schema-aggregator
 */
final class Enhance_Schema_Piece_Test extends Abstract_Person_Schema_Enhancer_Test {

	/**
	 * The Person_Schema_Enhancer_Double
	 *
	 * @var Person_Schema_Enhancer_Double
	 */
	private $person_schema_enhancer_double;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->person_schema_enhancer_double = new Person_Schema_Enhancer_Double();
		$this->person_schema_enhancer_double->set_person_config( $this->config );
	}

	/**
	 * Tests that enhance_schema_piece correctly handles exceptions.
	 *
	 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_handles_exception() {
		$schema_data = [
			'@context'    => 'https://schema.org',
			'@type'       => 'Person',
			'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
			'name'        => 'John Doe',
			'description' => 'Test person description',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'person_job_title' )
			->andReturn( true );

		Functions\expect( 'get_user_meta' )
			->with( $indexable->author_id, 'job_title', true )
			->andThrow( new Exception( 'Dummy exception' ) );

		$data = $this->person_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );

		$this->assertEquals( $schema_data, $data );
	}

	/**
	 * Tests the enhance_schema_piece method when jobTitle enhancement is disabled.
	 *
	 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_job_title_enhancement_disabled() {
		$schema_data = [
			'@context'    => 'https://schema.org',
			'@type'       => 'Person',
			'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
			'name'        => 'John Doe',
			'description' => 'Test person description',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'person_job_title' )
			->andReturn( false );

		$data = $this->person_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );

		$this->assertEquals( $schema_data, $data );
	}

	/**
	 * Tests the enhance_schema_piece method when jobTitle already exists.
	 *
	 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_job_title_already_exists() {
		$schema_data = [
			'@context'    => 'https://schema.org',
			'@type'       => 'Person',
			'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
			'name'        => 'John Doe',
			'description' => 'Test person description',
			'jobTitle'    => 'Existing job title',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'person_job_title' )
			->andReturn( true );

		$data = $this->person_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );

		$this->assertEquals( $schema_data, $data );
	}

	/**
	 * Tests the enhance_schema_piece method for jobTitle enhancement scenarios.
	 *
	 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance_schema_piece
	 *
	 * @dataProvider enhance_schema_piece_job_title_data_provider
	 *
	 * @param array<string, mixed> $schema_data     The schema piece data.
	 * @param array<string, mixed> $expected_result The expected enhanced schema data.
	 * @param string               $job_title       The job title from user meta.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_job_title( array $schema_data, array $expected_result, string $job_title ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'person_job_title' )
			->andReturn( true );

		Functions\expect( 'get_user_meta' )
			->with( $indexable->author_id, 'job_title', true )
			->andReturn( $job_title );

		$data = $this->person_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
		$this->assertSame( $expected_result, $data );
	}

	/**
	 * Data provider for test_enhance_schema_piece_job_title
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function enhance_schema_piece_job_title_data_provider(): array {
		return [
			'with_valid_job_title' => [
				'schema_data'     => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'expected_result' => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
					'jobTitle'    => 'Senior Developer',
				],
				'job_title'       => '  Senior Developer  ',
			],
			'with_empty_job_title' => [
				'schema_data'     => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'expected_result' => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'job_title'       => '',
			],
			'with_null_job_title' => [
				'schema_data'     => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'expected_result' => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'job_title'       => '',
			],
			'with_whitespace_only_job_title' => [
				'schema_data'     => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'expected_result' => [
					'@context'    => 'https://schema.org',
					'@type'       => 'Person',
					'@id'         => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
					'name'        => 'John Doe',
					'description' => 'Test person description',
				],
				'job_title'       => '   ',
			],
		];
	}
}
