<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Collector;
use Yoast\WP\SEO\Abilities\Domain\Author_Schema_Field_Repository_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Schema_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Author_Schema_Collector
 */
final class Author_Schema_Collector_Test extends TestCase {

	/**
	 * The ID of the user whose settings are collected.
	 *
	 * @var int
	 */
	private const USER_ID = 7;

	/**
	 * The author schema field map mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The repository mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Field_Repository_Interface
	 */
	private $repository;

	/**
	 * The instance under test.
	 *
	 * @var Author_Schema_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->field_map  = Mockery::mock( Author_Schema_Field_Map::class );
		$this->repository = Mockery::mock( Author_Schema_Field_Repository_Interface::class );

		$this->instance = new Author_Schema_Collector( $this->field_map );
	}

	/**
	 * Data provider for test_get.
	 *
	 * @return array<string, array<string, string|array<string>>>
	 */
	public static function data_get() {
		return [
			'Set'   => [
				'stored_knows_about'   => [ 'PHP', 'SEO' ],
				'expected_knows_about' => [ 'PHP', 'SEO' ],
			],
			'Unset' => [
				'stored_knows_about'   => '',
				'expected_knows_about' => [],
			],
		];
	}

	/**
	 * Tests that get returns the user ID along with the stored value of each field, read from its repository and
	 * cast to the type its schema declares.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 *
	 * @dataProvider data_get
	 *
	 * @param string|array<string> $stored_knows_about   The value the repository returns for the array field.
	 * @param array<string>        $expected_knows_about The value that is returned for the array field.
	 *
	 * @return void
	 */
	public function test_get( $stored_knows_about, $expected_knows_about ) {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( self::USER_ID )->andReturn( (object) [ 'ID' => self::USER_ID ] );
		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'wpseo_pronouns' => [ 'type' => 'string' ],
				'facebook'       => [ 'type' => 'string' ],
				'knowsAbout'     => [ 'type' => 'array' ],
			],
		);
		$this->field_map->expects( 'get_repositories' )->once()->andReturn(
			[
				'wpseo_pronouns' => $this->repository,
				'facebook'       => $this->repository,
				'knowsAbout'     => $this->repository,
			],
		);
		$this->repository->expects( 'get' )->once()->with( self::USER_ID, 'wpseo_pronouns' )->andReturn( 'they/them' );
		$this->repository->expects( 'get' )->once()->with( self::USER_ID, 'facebook' )->andReturn( '' );
		$this->repository->expects( 'get' )->once()->with( self::USER_ID, 'knowsAbout' )->andReturn( $stored_knows_about );

		$this->assertSame(
			[
				'user_id'        => self::USER_ID,
				'wpseo_pronouns' => 'they/them',
				'facebook'       => '',
				'knowsAbout'     => $expected_knows_about,
			],
			$this->instance->get( self::USER_ID ),
		);
	}

	/**
	 * Tests that get returns an error without reading anything when the user does not exist.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_user_not_found() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();
		$this->field_map->expects( 'get_fields' )->never();
		$this->repository->expects( 'get' )->never();

		$result = $this->instance->get( 99 );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_user_not_found', $result->get_error_code() );
		$this->assertSame( [ 'status' => 404 ], $result->get_error_data() );
	}
}
