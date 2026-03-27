<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Enabled_Analysis_Features_Checker class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker
 */
final class Enabled_Analysis_Features_Checker_Test extends TestCase {

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The language helper mock.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language_helper;

	/**
	 * The instance under test.
	 *
	 * @var Enabled_Analysis_Features_Checker
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );
		$this->language_helper                      = Mockery::mock( Language_Helper::class );

		$this->instance = new Enabled_Analysis_Features_Checker(
			$this->enabled_analysis_features_repository,
			$this->language_helper,
		);
	}

	/**
	 * Tests that is_keyword_analysis_enabled returns true when the feature is enabled.
	 *
	 * @covers ::is_keyword_analysis_enabled
	 *
	 * @return void
	 */
	public function test_is_keyword_analysis_enabled_returns_true() {
		$this->mock_enabled_features( [ Keyphrase_Analysis::NAME => true ] );

		$this->assertTrue( $this->instance->is_keyword_analysis_enabled() );
	}

	/**
	 * Tests that is_keyword_analysis_enabled returns false when the feature is disabled.
	 *
	 * @covers ::is_keyword_analysis_enabled
	 *
	 * @return void
	 */
	public function test_is_keyword_analysis_enabled_returns_false() {
		$this->mock_enabled_features( [ Keyphrase_Analysis::NAME => false ] );

		$this->assertFalse( $this->instance->is_keyword_analysis_enabled() );
	}

	/**
	 * Tests that is_keyword_analysis_enabled returns false when the feature is not present.
	 *
	 * @covers ::is_keyword_analysis_enabled
	 *
	 * @return void
	 */
	public function test_is_keyword_analysis_enabled_returns_false_when_not_present() {
		$this->mock_enabled_features( [] );

		$this->assertFalse( $this->instance->is_keyword_analysis_enabled() );
	}

	/**
	 * Tests that is_content_analysis_enabled returns true when the feature is enabled.
	 *
	 * @covers ::is_content_analysis_enabled
	 *
	 * @return void
	 */
	public function test_is_content_analysis_enabled_returns_true() {
		$this->mock_enabled_features( [ Readability_Analysis::NAME => true ] );

		$this->assertTrue( $this->instance->is_content_analysis_enabled() );
	}

	/**
	 * Tests that is_content_analysis_enabled returns false when the feature is disabled.
	 *
	 * @covers ::is_content_analysis_enabled
	 *
	 * @return void
	 */
	public function test_is_content_analysis_enabled_returns_false() {
		$this->mock_enabled_features( [ Readability_Analysis::NAME => false ] );

		$this->assertFalse( $this->instance->is_content_analysis_enabled() );
	}

	/**
	 * Tests that is_inclusive_language_enabled returns true when the feature is enabled and language is supported.
	 *
	 * @covers ::is_inclusive_language_enabled
	 *
	 * @return void
	 */
	public function test_is_inclusive_language_enabled_returns_true() {
		$this->mock_enabled_features( [ Inclusive_Language_Analysis::NAME => true ] );

		$this->language_helper
			->expects( 'get_language' )
			->once()
			->andReturn( 'en' );

		$this->language_helper
			->expects( 'has_inclusive_language_support' )
			->once()
			->with( 'en' )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_inclusive_language_enabled() );
	}

	/**
	 * Tests that is_inclusive_language_enabled returns false when the feature is disabled.
	 *
	 * @covers ::is_inclusive_language_enabled
	 *
	 * @return void
	 */
	public function test_is_inclusive_language_enabled_returns_false() {
		$this->mock_enabled_features( [ Inclusive_Language_Analysis::NAME => false ] );

		$this->assertFalse( $this->instance->is_inclusive_language_enabled() );
	}

	/**
	 * Tests that is_inclusive_language_enabled returns false when the feature is not present.
	 *
	 * @covers ::is_inclusive_language_enabled
	 *
	 * @return void
	 */
	public function test_is_inclusive_language_enabled_returns_false_when_not_present() {
		$this->mock_enabled_features( [] );

		$this->assertFalse( $this->instance->is_inclusive_language_enabled() );
	}

	/**
	 * Tests that is_inclusive_language_enabled returns false when the language is not supported.
	 *
	 * @covers ::is_inclusive_language_enabled
	 *
	 * @return void
	 */
	public function test_is_inclusive_language_enabled_returns_false_when_language_not_supported() {
		$this->mock_enabled_features( [ Inclusive_Language_Analysis::NAME => true ] );

		$this->language_helper
			->expects( 'get_language' )
			->once()
			->andReturn( 'de' );

		$this->language_helper
			->expects( 'has_inclusive_language_support' )
			->once()
			->with( 'de' )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_inclusive_language_enabled() );
	}

	/**
	 * Mocks the enabled features repository to return the given features array.
	 *
	 * @param array<string, bool> $features The features array.
	 *
	 * @return void
	 */
	private function mock_enabled_features( array $features ) {
		$features_list = Mockery::mock( Analysis_Features_List::class );

		$features_list
			->expects( 'to_array' )
			->once()
			->andReturn( $features );

		$this->enabled_analysis_features_repository
			->expects( 'get_enabled_features' )
			->once()
			->andReturn( $features_list );
	}
}
