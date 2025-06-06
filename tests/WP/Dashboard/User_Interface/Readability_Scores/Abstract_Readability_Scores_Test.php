<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Readability_Scores;

use Mockery;
use Yoast\WP\SEO\Dashboard\Application\Score_Results\Readability_Score_Results\Readability_Score_Results_Repository;
use Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Abstract_Readability_Scores_Test
 */
abstract class Abstract_Readability_Scores_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Readability_Scores_Route
	 */
	private $instance;

	/**
	 * Holds the Readability_Score_Results_Repository instance.
	 *
	 * @var Mockery\MockInterface|Readability_Score_Results_Repository
	 */
	private $score_results_repository;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->score_results_repository = Mockery::mock( Readability_Score_Results_Repository::class );

		$this->instance = new Readability_Scores_Route( $this->score_results_repository );

		$user = $this->factory->user->create_and_get();
		$user->add_cap( 'wpseo_manage_options' );

		\wp_set_current_user( $user->ID );
	}
}
