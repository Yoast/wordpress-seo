<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Fields;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Template_Field_Interface;
use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Template_Field_Repository class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository
 */
final class Template_Field_Repository_Test extends TestCase {

	/**
	 * Creates a field mock.
	 *
	 * @param string      $name        The name of the field.
	 * @param string|null $option_name The option the field is stored in for any target.
	 *
	 * @return Mockery\MockInterface|Template_Field_Interface The field mock.
	 */
	private function mock_field( string $name, ?string $option_name = null ) {
		$field = Mockery::mock( Template_Field_Interface::class );
		$field->allows( 'get_name' )->andReturn( $name );
		$field->allows( 'get_schema' )->andReturn( [ 'type' => 'string' ] );
		$field->allows( 'get_option_name' )->andReturn( $option_name );

		return $field;
	}

	/**
	 * Tests that get_all returns the fields of Yoast SEO keyed by name, and runs the filter only once.
	 *
	 * @covers ::__construct
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all() {
		$seo_title = $this->mock_field( 'seo_title' );
		$noindex   = $this->mock_field( 'noindex' );

		Monkey\Filters\expectApplied( 'wpseo_template_seo_data_fields' )->once()->with( [ $seo_title, $noindex ] );

		$instance = new Template_Field_Repository( $seo_title, $noindex );

		$this->assertSame(
			[
				'seo_title' => $seo_title,
				'noindex'   => $noindex,
			],
			$instance->get_all(),
		);
		$this->assertSame( [ 'seo_title', 'noindex' ], \array_keys( $instance->get_all() ) );
	}

	/**
	 * Tests that get_all includes the fields added through the filter, and ignores anything that is not a field.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all_filtered() {
		$seo_title    = $this->mock_field( 'seo_title' );
		$social_title = $this->mock_field( 'social_title' );

		Monkey\Filters\expectApplied( 'wpseo_template_seo_data_fields' )->once()->andReturn( [ $seo_title, 'not a field', $social_title ] );

		$this->assertSame(
			[
				'seo_title'    => $seo_title,
				'social_title' => $social_title,
			],
			( new Template_Field_Repository( $seo_title ) )->get_all(),
		);
	}

	/**
	 * Tests that get_all falls back to the fields of Yoast SEO when the filter does not return an array.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all_with_invalid_filter() {
		$seo_title = $this->mock_field( 'seo_title' );

		Monkey\Filters\expectApplied( 'wpseo_template_seo_data_fields' )->once()->andReturn( 'invalid' );

		$this->assertSame( [ 'seo_title' => $seo_title ], ( new Template_Field_Repository( $seo_title ) )->get_all() );
	}

	/**
	 * Tests that get_for_target returns the fields stored in an option for the target.
	 *
	 * @covers ::get_for_target
	 *
	 * @return void
	 */
	public function test_get_for_target() {
		$seo_title = $this->mock_field( 'seo_title', 'title-search-wpseo' );
		$noindex   = $this->mock_field( 'noindex' );

		$target = Mockery::mock( Template_Target_Interface::class );

		$this->assertSame( [ 'seo_title' => $seo_title ], ( new Template_Field_Repository( $seo_title, $noindex ) )->get_for_target( $target ) );
	}

	/**
	 * Tests that get_schemas returns the schema of each field.
	 *
	 * @covers ::get_schemas
	 *
	 * @return void
	 */
	public function test_get_schemas() {
		$seo_title = $this->mock_field( 'seo_title' );

		$this->assertSame(
			[ 'seo_title' => [ 'type' => 'string' ] ],
			( new Template_Field_Repository() )->get_schemas( [ 'seo_title' => $seo_title ] ),
		);
	}
}
