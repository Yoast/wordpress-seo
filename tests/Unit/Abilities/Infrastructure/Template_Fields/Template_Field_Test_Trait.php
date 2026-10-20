<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Fields;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;

/**
 * Creates the targets the template field tests check the option names of.
 */
trait Template_Field_Test_Trait {

	/**
	 * Data provider with every target name.
	 *
	 * @return array<string, array<string>>
	 */
	public static function data_targets() {
		return [
			'Homepage'             => [ 'homepage' ],
			'Author archives'      => [ 'author_archives' ],
			'Date archives'        => [ 'date_archives' ],
			'Search page'          => [ 'search_page' ],
			'404 page'             => [ 'not_found_page' ],
			'Content type archive' => [ 'post_type_archive' ],
		];
	}

	/**
	 * Creates a target mock that fills the `portfolio` post type into option patterns.
	 *
	 * @param string $target_name The name of the target.
	 *
	 * @return Mockery\MockInterface|Template_Target_Interface The target mock.
	 */
	private function mock_target( string $target_name ) {
		$target = Mockery::mock( Template_Target_Interface::class );
		$target->allows( 'get_name' )->andReturn( $target_name );
		$target->allows( 'format_option_name' )->andReturnUsing(
			static function ( $option_pattern ) {
				return \sprintf( $option_pattern, 'portfolio' );
			},
		);

		return $target;
	}
}
