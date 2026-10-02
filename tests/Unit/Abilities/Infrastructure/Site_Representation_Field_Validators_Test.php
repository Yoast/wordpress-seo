<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Validators;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Logo_Helper;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
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
	 * The site representation logo helper mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Logo_Helper
	 */
	private $logo_helper;

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
		$this->logo_helper                  = Mockery::mock( Site_Representation_Logo_Helper::class );

		$this->instance = new Site_Representation_Field_Validators(
			$this->local_seo_active_conditional,
			$this->image_helper,
			$this->logo_helper,
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
		Monkey\Functions\expect( 'get_userdata' )->never();

		$this->assertNull( $this->instance->validate_user_id( 0 ) );
	}

	/**
	 * Tests that an existing user to represent is allowed.
	 *
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_validate_user_id_existing() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );

		$this->assertNull( $this->instance->validate_user_id( 3 ) );
	}

	/**
	 * Tests that a user to represent that does not exist is rejected.
	 *
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_validate_user_id_not_existing() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();

		$this->assertSame(
			'The user to represent was not changed, because no user exists with the given ID.',
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
		$this->logo_helper->expects( 'get_logo_id' )->never();

		$this->assertNull( $this->instance->validate_logo( '', 'company_logo' ) );
	}

	/**
	 * Tests that a logo URL of an image in the media library is allowed.
	 *
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_validate_logo_image() {
		$this->logo_helper->expects( 'get_logo_id' )->once()->with( 'https://example.com/logo.png' )->andReturn( 12 );
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->assertNull( $this->instance->validate_logo( 'https://example.com/logo.png', 'company_logo' ) );
	}

	/**
	 * Data provider for test_validate_logo_not_an_image.
	 *
	 * @return array<string, array<string, int|bool|null>>
	 */
	public static function data_validate_logo_not_an_image() {
		return [
			'Not in the media library' => [
				'attachment_id' => 0,
				'is_valid'      => null,
			],
			'Not an image'             => [
				'attachment_id' => 12,
				'is_valid'      => false,
			],
		];
	}

	/**
	 * Tests that a logo URL that is not an image in the media library is rejected.
	 *
	 * @covers ::validate_logo
	 *
	 * @dataProvider data_validate_logo_not_an_image
	 *
	 * @param int       $attachment_id The attachment ID found for the URL.
	 * @param bool|null $is_valid      Whether the attachment is a valid image, null when it is not checked.
	 *
	 * @return void
	 */
	public function test_validate_logo_not_an_image( int $attachment_id, ?bool $is_valid ) {
		$this->logo_helper->expects( 'get_logo_id' )->once()->with( 'https://example.com/logo.pdf' )->andReturn( $attachment_id );

		if ( $is_valid === null ) {
			$this->image_helper->expects( 'is_valid_attachment' )->never();
		}
		else {
			$this->image_helper->expects( 'is_valid_attachment' )->once()->with( $attachment_id )->andReturn( $is_valid );
		}

		$this->assertSame(
			'The company_logo setting was not changed, because it is not the URL of an image in the media library.',
			$this->instance->validate_logo( 'https://example.com/logo.pdf', 'company_logo' ),
		);
	}
}
