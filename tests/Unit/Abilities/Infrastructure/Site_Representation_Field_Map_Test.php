<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Validators;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Representation_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map
 */
final class Site_Representation_Field_Map_Test extends TestCase {

	/**
	 * The Local SEO active conditional mock.
	 *
	 * @var Mockery\MockInterface|Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

	/**
	 * The site representation field validators mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Field_Validators
	 */
	private $field_validators;

	/**
	 * The instance under test.
	 *
	 * @var Site_Representation_Field_Map
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
		$this->field_validators             = Mockery::mock( Site_Representation_Field_Validators::class );

		$this->instance = new Site_Representation_Field_Map( $this->local_seo_active_conditional, $this->field_validators );
	}

	/**
	 * Tests that get_fields returns the site representation fields of Yoast SEO with their schema.
	 *
	 * @covers ::__construct
	 * @covers ::get_fields
	 * @covers ::resolve_fields
	 * @covers ::get_validators
	 * @covers ::get_default_fields
	 * @covers ::get_company_or_person_description
	 *
	 * @return void
	 */
	public function test_get_fields_defaults() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$fields = $this->instance->get_fields();

		$this->assertSame(
			[
				'company_or_person',
				'company_name',
				'company_alternate_name',
				'company_logo',
				'company_or_person_user_id',
				'person_name',
				'person_logo',
				'facebook_site',
				'twitter_site',
				'other_social_urls',
			],
			\array_keys( $fields ),
		);
		$this->assertSame(
			[
				'type'        => 'string',
				'enum'        => [ 'company', 'person' ],
				'description' => 'Whether the site represents an organization ("company") or a person ("person").',
			],
			$fields['company_or_person'],
		);
		$this->assertSame( 'integer', $fields['company_or_person_user_id']['type'] );
		$this->assertSame( 0, $fields['company_or_person_user_id']['minimum'] );
		$this->assertSame(
			[
				'company_or_person'         => [ $this->field_validators, 'validate_company_or_person' ],
				'company_logo'              => [ $this->field_validators, 'validate_logo' ],
				'company_or_person_user_id' => [ $this->field_validators, 'validate_user_id' ],
				'person_logo'               => [ $this->field_validators, 'validate_logo' ],
			],
			$this->instance->get_validators(),
		);
	}

	/**
	 * Tests that the company_or_person description tells agents when Local SEO prevents representing a person.
	 *
	 * @covers ::get_fields
	 * @covers ::resolve_fields
	 * @covers ::get_company_or_person_description
	 *
	 * @return void
	 */
	public function test_get_fields_with_local_seo() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->assertSame(
			'Whether the site represents an organization ("company") or a person ("person"). Yoast Local SEO is active on this site and requires the site to represent an organization, so "person" cannot be set.',
			$this->instance->get_fields()['company_or_person']['description'],
		);
	}

	/**
	 * Tests that get_fields includes the fields added through the filter, drops the ones without a
	 * schema and caches the result.
	 *
	 * @covers ::get_fields
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_fields_filtered() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$org_email = [
			'type'        => 'string',
			'description' => 'The email address of the organization.',
		];

		Monkey\Filters\expectApplied( 'wpseo_site_representation_ability_fields' )
			->once()
			->andReturnUsing(
				static function ( $fields ) use ( $org_email ) {
					$fields['org-email']   = $org_email;
					$fields['not-a-field'] = 'invalid';

					return $fields;
				},
			);

		$fields = $this->instance->get_fields();

		$this->assertSame( $org_email, $fields['org-email'] );
		$this->assertArrayNotHasKey( 'not-a-field', $fields );
		$this->assertArrayHasKey( 'company_name', $fields );
		$this->assertSame( $fields, $this->instance->get_fields() );
	}

	/**
	 * Tests that the validators registered along with the fields are kept out of the schemas, and that a field
	 * whose validator is not callable is dropped.
	 *
	 * @covers ::get_fields
	 * @covers ::get_validators
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_validators() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$validate_org_email = static function () {
			return null;
		};

		$add_on_fields = [
			'org-email' => [
				'type'              => 'string',
				'description'       => 'The email address of the organization.',
				'validate_callback' => $validate_org_email,
			],
			'org-phone' => [
				'type'              => 'string',
				'description'       => 'The phone number of the organization.',
				'validate_callback' => 'not_a_function',
			],
		];

		Monkey\Filters\expectApplied( 'wpseo_site_representation_ability_fields' )
			->once()
			->andReturnUsing(
				static function ( $fields ) use ( $add_on_fields ) {
					return \array_merge( $fields, $add_on_fields );
				},
			);

		$fields = $this->instance->get_fields();

		$this->assertSame(
			[
				'type'        => 'string',
				'description' => 'The email address of the organization.',
			],
			$fields['org-email'],
		);
		$this->assertArrayNotHasKey( 'org-phone', $fields );

		$validators = $this->instance->get_validators();
		$this->assertSame( $validate_org_email, $validators['org-email'] );
		$this->assertArrayNotHasKey( 'org-phone', $validators );
	}

	/**
	 * Tests that get_fields falls back to the defaults when the filter does not return an array.
	 *
	 * @covers ::get_fields
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_fields_filtered_invalid() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		Monkey\Filters\expectApplied( 'wpseo_site_representation_ability_fields' )
			->once()
			->andReturn( 'invalid' );

		$this->assertCount( 10, $this->instance->get_fields() );
	}
}
