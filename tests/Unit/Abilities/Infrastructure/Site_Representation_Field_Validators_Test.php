<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Validators;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Representation_Field_Validators class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Validators
 */
final class Site_Representation_Field_Validators_Test extends TestCase {

	/**
	 * The Local SEO active conditional mock.
	 *
	 * @var Mockery\MockInterface|Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	private $image_helper;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Site_Representation_Field_Validators
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

		$this->local_seo_active_conditional = Mockery::mock( Local_SEO_Active_Conditional::class );
		$this->image_helper                 = Mockery::mock( Image_Helper::class );
		$this->options_helper               = Mockery::mock( Options_Helper::class );

		$this->instance = new Site_Representation_Field_Validators(
			$this->local_seo_active_conditional,
			$this->image_helper,
			$this->options_helper,
		);
	}

	/**
	 * Tests that representing an organization is always allowed, without checking for Local SEO.
	 *
	 * @covers ::__construct
	 * @covers ::validate_company_or_person
	 *
	 * @return void
	 */
	public function test_validate_company_or_person_company() {
		$this->local_seo_active_conditional->expects( 'is_met' )->never();

		$this->assertNull( $this->instance->validate_company_or_person( 'company' ) );
	}

	/**
	 * Tests that representing a person is allowed when Local SEO is not active.
	 *
	 * @covers ::validate_company_or_person
	 *
	 * @return void
	 */
	public function test_validate_company_or_person_person() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$this->assertNull( $this->instance->validate_company_or_person( 'person' ) );
	}

	/**
	 * Tests that representing a person is rejected when Local SEO is active.
	 *
	 * @covers ::validate_company_or_person
	 *
	 * @return void
	 */
	public function test_validate_company_or_person_person_with_local_seo() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->assertSame(
			'The site was not set to represent a person, because Yoast Local SEO is active and requires the site to represent an organization.',
			$this->instance->validate_company_or_person( 'person' ),
		);
	}

	/**
	 * Tests that clearing the user to represent is allowed without looking it up.
	 *
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_validate_user_id_cleared() {
		$this->options_helper->expects( 'get' )->never();
		Monkey\Functions\expect( 'get_userdata' )->never();

		$this->assertNull( $this->instance->validate_user_id( 0 ) );
	}

	/**
	 * Tests that keeping the current user to represent is allowed without looking it up.
	 *
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_validate_user_id_current() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->never();

		$this->assertNull( $this->instance->validate_user_id( 1 ) );
	}

	/**
	 * Tests that any existing user is allowed when the current user can list users.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 *
	 * @return void
	 */
	public function test_validate_user_id_with_list_users() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturnFalse();
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'list_users' )->andReturnTrue();
		Monkey\Functions\expect( 'count_user_posts' )->never();

		$this->assertNull( $this->instance->validate_user_id( 3 ) );
	}

	/**
	 * Tests that a user with published posts is allowed when the current user cannot list users.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 * @covers ::has_published_posts
	 *
	 * @return void
	 */
	public function test_validate_user_id_with_published_posts() {
		$post_types = [
			'post' => 'post',
			'page' => 'page',
		];

		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'list_users' )->andReturnFalse();
		Monkey\Functions\expect( 'get_post_types' )->once()->with( [ 'show_in_rest' => true ] )->andReturn( $post_types );
		Monkey\Functions\expect( 'count_user_posts' )->once()->with( 3, $post_types, true )->andReturn( '2' );

		$this->assertNull( $this->instance->validate_user_id( 3 ) );
	}

	/**
	 * Tests that a user without published posts is rejected when the current user cannot list users.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 * @covers ::has_published_posts
	 *
	 * @return void
	 */
	public function test_validate_user_id_without_published_posts() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'list_users' )->andReturnFalse();
		Monkey\Functions\expect( 'get_post_types' )->once()->andReturn( [ 'post' => 'post' ] );
		Monkey\Functions\expect( 'count_user_posts' )->once()->andReturn( '0' );

		$this->assertSame(
			'The user to represent was not changed, because no user that you can select exists with the given ID.',
			$this->instance->validate_user_id( 3 ),
		);
	}

	/**
	 * Tests that a member of the site is allowed on multisite.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 *
	 * @return void
	 */
	public function test_validate_user_id_multisite_member() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );
		Monkey\Functions\stubs( [ 'is_multisite' => true ] );
		Monkey\Functions\expect( 'is_user_member_of_blog' )->once()->with( 3 )->andReturnTrue();
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'list_users' )->andReturnTrue();

		$this->assertNull( $this->instance->validate_user_id( 3 ) );
	}

	/**
	 * Tests that a user who is not a member of the site is rejected on multisite, even when the current user can list users.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 *
	 * @return void
	 */
	public function test_validate_user_id_multisite_non_member() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );
		Monkey\Functions\stubs( [ 'is_multisite' => true ] );
		Monkey\Functions\expect( 'is_user_member_of_blog' )->once()->with( 3 )->andReturnFalse();
		Monkey\Functions\expect( 'current_user_can' )->never();

		$this->assertSame(
			'The user to represent was not changed, because no user that you can select exists with the given ID.',
			$this->instance->validate_user_id( 3 ),
		);
	}

	/**
	 * Tests that a user to represent that does not exist is rejected with the same warning as a disallowed user.
	 *
	 * @covers ::validate_user_id
	 * @covers ::can_select_user
	 *
	 * @return void
	 */
	public function test_validate_user_id_not_existing() {
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();
		Monkey\Functions\expect( 'current_user_can' )->never();

		$this->assertSame(
			'The user to represent was not changed, because no user that you can select exists with the given ID.',
			$this->instance->validate_user_id( 99 ),
		);
	}

	/**
	 * Tests that clearing a logo is allowed without looking it up.
	 *
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_validate_logo_cleared() {
		$this->image_helper->expects( 'is_valid_attachment' )->never();

		$this->assertNull( $this->instance->validate_logo( 0, 'company_logo_id' ) );
	}

	/**
	 * Tests that the ID of an image in the media library is allowed.
	 *
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_validate_logo_image() {
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->assertNull( $this->instance->validate_logo( 12, 'company_logo_id' ) );
	}

	/**
	 * Tests that an ID that is not an image in the media library is rejected.
	 *
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_validate_logo_not_an_image() {
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnFalse();

		$this->assertSame(
			'The company_logo_id setting was not changed, because it is not the ID of an image in the media library.',
			$this->instance->validate_logo( 12, 'company_logo_id' ),
		);
	}
}
