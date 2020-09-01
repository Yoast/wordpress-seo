<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexation_Permalink_Warning_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter
 *
 * @group presenters
 * @group indexation
 */
class Indexation_Permalink_Warning_Presenter_Test extends TestCase {

	/**
	 * Holds the options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( '' );

		$this->options = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Tests the indexation permalink warning presenter with the reason being the permalinks settings having changed.
	 *
	 * @covers ::present
	 * @covers ::get_text_for_reason
	 */
	public function test_present_permalink_reason() {
		$presenter = new Indexation_Permalink_Warning_Presenter( 12, $this->options, Indexation_Warning_Presenter::ACTION_TYPE_RUN_HERE );

		$this->options
			->expects( 'get' )
			->with( 'indexables_indexation_reason' )
			->once()
			->andReturn( 'permalink_settings_changed' );

		Monkey\Filters\expectApplied( 'wpseo_indexables_indexation_alert' );

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success">';
		$expected .= '<p>Because of a change in your permalink structure, some of your SEO data need to be reprocessed.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<button type="button" class="button yoast-open-indexation" data-title="<strong>Yoast indexing status</strong>" data-settings="yoastIndexationData">Start processing and speed up your site now</button>';
		$expected .= '<hr /><p><button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">Hide this notice</button> ';
		$expected .= '(everything will continue to function normally)</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}

	/**
	 * Tests the indexation permalink warning presenter with the reason being the category base settings having changed.
	 *
	 * @covers ::present
	 * @covers ::get_text_for_reason
	 */
	public function test_present_category_base_reason() {
		$presenter = new Indexation_Permalink_Warning_Presenter( 12, $this->options, Indexation_Warning_Presenter::ACTION_TYPE_RUN_HERE );

		$this->options
			->expects( 'get' )
			->with( 'indexables_indexation_reason' )
			->once()
			->andReturn( 'category_base_changed' );

		Monkey\Filters\expectApplied( 'wpseo_indexables_indexation_alert' );

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success">';
		$expected .= '<p>Because of a change in your category URL setting, some of your SEO data need to be reprocessed.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<button type="button" class="button yoast-open-indexation" data-title="<strong>Yoast indexing status</strong>" data-settings="yoastIndexationData">Start processing and speed up your site now</button>';
		$expected .= '<hr /><p><button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">Hide this notice</button> ';
		$expected .= '(everything will continue to function normally)</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}
}
