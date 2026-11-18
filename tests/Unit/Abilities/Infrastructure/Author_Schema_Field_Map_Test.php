<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Author_Schema_Field_Repository_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_User_Meta_Repository;
use Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Pronouns;

/**
 * Tests the Author_Schema_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map
 */
final class Author_Schema_Field_Map_Test extends TestCase {

	/**
	 * The author pronouns user meta mock.
	 *
	 * @var Mockery\MockInterface|Author_Pronouns
	 */
	private $author_pronouns;

	/**
	 * The user meta repository mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_User_Meta_Repository
	 */
	private $user_meta_repository;

	/**
	 * The user can edit users conditional mock.
	 *
	 * @var Mockery\MockInterface|User_Can_Edit_Users_Conditional
	 */
	private $user_can_edit_users_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Author_Schema_Field_Map
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

		$this->author_pronouns = Mockery::mock( Author_Pronouns::class );

		$this->user_meta_repository = Mockery::mock( Author_Schema_User_Meta_Repository::class );

		$this->user_can_edit_users_conditional = Mockery::mock( User_Can_Edit_Users_Conditional::class );

		$this->instance = new Author_Schema_Field_Map( $this->author_pronouns, $this->user_meta_repository, $this->user_can_edit_users_conditional );
	}

	/**
	 * Tests that get_fields returns the author schema fields of Yoast SEO with their schema.
	 *
	 * @covers ::__construct
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 * @covers ::get_repositories
	 * @covers ::get_default_fields
	 * @covers ::get_pronouns_description
	 *
	 * @return void
	 */
	public function test_get_fields_defaults() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();

		$fields = $this->instance->get_fields();

		$this->assertSame(
			[
				'wpseo_pronouns',
				'facebook',
				'instagram',
				'linkedin',
				'myspace',
				'pinterest',
				'soundcloud',
				'tumblr',
				'twitter',
				'youtube',
				'wikipedia',
			],
			\array_keys( $fields ),
		);
		$this->assertSame(
			[
				'type'        => 'string',
				'description' => 'The pronouns of the user, like "she/her", "he/him" or "they/them". Only users who can edit other users can change them.',
			],
			$fields['wpseo_pronouns'],
		);

		foreach ( $fields as $schema ) {
			$this->assertSame( 'string', $schema['type'] );
		}

		$this->assertSame(
			[
				'wpseo_pronouns' => [ $this->instance, 'validate_pronouns' ],
			],
			$this->instance->get_validators(),
		);
		$this->assertSame( \array_fill_keys( \array_keys( $fields ), $this->user_meta_repository ), $this->instance->get_repositories() );
	}

	/**
	 * Tests that the pronouns description tells agents when the pronouns cannot be changed.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 * @covers ::get_pronouns_description
	 *
	 * @return void
	 */
	public function test_get_fields_with_author_archives_disabled() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnFalse();

		$this->assertSame(
			'The pronouns of the user, like "she/her", "he/him" or "they/them". Author archives are disabled on this site, so the pronouns cannot be changed.',
			$this->instance->get_fields()['wpseo_pronouns']['description'],
		);
	}

	/**
	 * Tests that get_fields includes the fields added through the filter, drops the ones without a
	 * schema and caches the result.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_fields_filtered() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();

		$mastodon = [
			'type'        => 'string',
			'description' => 'The URL of the user\'s Mastodon profile.',
		];

		Monkey\Filters\expectApplied( 'wpseo_author_schema_ability_fields' )
			->once()
			->andReturnUsing(
				static function ( $fields ) use ( $mastodon ) {
					$fields['mastodon']    = $mastodon;
					$fields['not-a-field'] = 'invalid';

					return $fields;
				},
			);

		$fields = $this->instance->get_fields();

		$this->assertSame( $mastodon, $fields['mastodon'] );
		$this->assertArrayNotHasKey( 'not-a-field', $fields );
		$this->assertArrayHasKey( 'facebook', $fields );
		$this->assertSame( $fields, $this->instance->get_fields() );
	}

	/**
	 * Tests that the validators registered along with the fields are kept out of the schemas, and that a field
	 * whose validator is not callable is dropped.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_validators() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();

		$validate_job_title = static function () {
			return null;
		};

		$add_on_fields = [
			'job_title'   => [
				'type'              => 'string',
				'description'       => 'The job title of the user.',
				'validate_callback' => $validate_job_title,
			],
			'knows_about' => [
				'type'              => 'string',
				'description'       => 'The topics the user knows about.',
				'validate_callback' => 'not_a_function',
			],
		];

		Monkey\Filters\expectApplied( 'wpseo_author_schema_ability_fields' )
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
				'description' => 'The job title of the user.',
			],
			$fields['job_title'],
		);
		$this->assertArrayNotHasKey( 'knows_about', $fields );

		$validators = $this->instance->get_validators();
		$this->assertSame( $validate_job_title, $validators['job_title'] );
		$this->assertArrayNotHasKey( 'knows_about', $validators );
	}

	/**
	 * Tests that the repositories registered along with the fields are kept out of the schemas, that a field whose
	 * repository is not an author schema field repository is dropped, and that a field that is not a string is
	 * dropped unless it comes with its own repository.
	 *
	 * @covers ::get_repositories
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_repositories() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();

		$repository = Mockery::mock( Author_Schema_Field_Repository_Interface::class );

		$validate_works_for = static function () {
			return null;
		};

		$add_on_fields = [
			'jobTitle'  => [
				'type'        => 'string',
				'description' => 'The job title of the user.',
				'repository'  => $repository,
			],
			'worksFor'  => [
				'type'              => 'string',
				'description'       => 'The employer of the user.',
				'repository'        => 'not_a_repository',
				'validate_callback' => $validate_works_for,
			],
			'birthYear' => [
				'type'        => 'integer',
				'description' => 'The birth year of the user.',
				'repository'  => $repository,
			],
			'age'       => [
				'type'        => 'integer',
				'description' => 'The age of the user.',
			],
			'nicknames' => [
				'description' => 'The nicknames of the user, without a type.',
			],
		];

		Monkey\Filters\expectApplied( 'wpseo_author_schema_ability_fields' )
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
				'description' => 'The job title of the user.',
			],
			$fields['jobTitle'],
		);
		$this->assertArrayNotHasKey( 'worksFor', $fields );
		$this->assertArrayHasKey( 'birthYear', $fields );
		$this->assertArrayNotHasKey( 'age', $fields );
		$this->assertArrayNotHasKey( 'nicknames', $fields );

		$repositories = $this->instance->get_repositories();
		$this->assertSame( $repository, $repositories['jobTitle'] );
		$this->assertSame( $this->user_meta_repository, $repositories['facebook'] );
		$this->assertArrayNotHasKey( 'worksFor', $repositories );
		$this->assertSame( $repository, $repositories['birthYear'] );
		$this->assertArrayNotHasKey( 'age', $repositories );
		$this->assertArrayNotHasKey( 'worksFor', $this->instance->get_validators() );
	}

	/**
	 * Tests that get_fields falls back to the defaults when the filter does not return an array.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_fields_filtered_invalid() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();

		Monkey\Filters\expectApplied( 'wpseo_author_schema_ability_fields' )
			->once()
			->andReturn( 'invalid' );

		$this->assertCount( 11, $this->instance->get_fields() );
	}

	/**
	 * Tests that the pronouns can be set when author archives are enabled and the current user can edit other users.
	 *
	 * @covers ::validate_pronouns
	 *
	 * @return void
	 */
	public function test_validate_pronouns_enabled() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();
		$this->user_can_edit_users_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->assertNull( $this->instance->validate_pronouns( 'they/them', 'wpseo_pronouns' ) );
	}

	/**
	 * Tests that the pronouns cannot be set when author archives are disabled, like on the user profile page.
	 *
	 * @covers ::validate_pronouns
	 *
	 * @return void
	 */
	public function test_validate_pronouns_disabled() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnFalse();
		$this->user_can_edit_users_conditional->expects( 'is_met' )->never();

		$this->assertSame(
			'The wpseo_pronouns setting was not changed, because author archives are disabled on this site.',
			$this->instance->validate_pronouns( 'they/them', 'wpseo_pronouns' ),
		);
	}

	/**
	 * Tests that the pronouns cannot be set by users who cannot edit other users, like on the user profile page.
	 *
	 * @covers ::validate_pronouns
	 *
	 * @return void
	 */
	public function test_validate_pronouns_cannot_edit_users() {
		$this->author_pronouns->expects( 'is_setting_enabled' )->once()->andReturnTrue();
		$this->user_can_edit_users_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$this->assertSame(
			'The wpseo_pronouns setting was not changed, because only users who can edit other users can change it.',
			$this->instance->validate_pronouns( 'they/them', 'wpseo_pronouns' ),
		);
	}
}
