<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Site_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 */
final class Twitter_Site_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the generation of the Twitter site for a company.
	 *
	 * @covers ::generate_twitter_site
	 *
	 * @return void
	 */
	public function test_generate_twitter_site_for_a_company() {
		$this->context->site_represents = 'company';

		$this->options
			->expects( 'get' )
			->with( 'twitter_site' )
			->once()
			->andReturn( '@company' );

		$this->assertEquals( '@company', $this->instance->generate_twitter_site() );
	}

	/**
	 * Tests the generation of the Twitter site for a user.
	 *
	 * @covers ::generate_twitter_site
	 *
	 * @return void
	 */
	public function test_generate_twitter_site_for_a_user() {
		$this->context->site_represents = 'person';
		$this->context->site_user_id    = 1337;

		$this->user
			->expects( 'get_the_author_meta' )
			->with( 'twitter', 1337 )
			->once()
			->andReturn( '@user' );

		$this->assertEquals( '@user', $this->instance->generate_twitter_site() );
	}

	/**
	 * Tests the generation of the Twitter site for a user with no meta value set.
	 *
	 * @covers ::generate_twitter_site
	 *
	 * @return void
	 */
	public function test_generate_twitter_site_for_a_user_with_no_meta_set() {
		$this->context->site_represents = 'person';
		$this->context->site_user_id    = 1337;

		$this->user
			->expects( 'get_the_author_meta' )
			->with( 'twitter', 1337 )
			->once()
			->andReturn( '' );

		$this->options
			->expects( 'get' )
			->with( 'twitter_site' )
			->once()
			->andReturn( '@company' );

		$this->assertEquals( '@company', $this->instance->generate_twitter_site() );
	}

	/**
	 * Tests the generation of the Twitter site for the default.
	 *
	 * @covers ::generate_twitter_site
	 *
	 * @return void
	 */
	public function test_generate_twitter_site_the_default_scenario() {
		$this->options
			->expects( 'get' )
			->with( 'twitter_site' )
			->once()
			->andReturn( '@company' );

		$this->assertEquals( '@company', $this->instance->generate_twitter_site() );
	}
}
