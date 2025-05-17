<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_System_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;

/**
 * Class Set_Indexable_Repository_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Set_Indexable_Repository_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Tests setting the indexable repository.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Indexable_Author_Builder::class,
			$this->getPropertyValue( $this->instance, 'author_builder' ),
			'Author builder should be of class Indexable_Author_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Post_Builder::class,
			$this->getPropertyValue( $this->instance, 'post_builder' ),
			'Post builder should be of class Indexable_Post_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Term_Builder::class,
			$this->getPropertyValue( $this->instance, 'term_builder' ),
			'Term builder should be of class Indexable_Term_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Home_Page_Builder::class,
			$this->getPropertyValue( $this->instance, 'home_page_builder' ),
			'Home page builder should be of class Indexable_Home_Page_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Post_Type_Archive_Builder::class,
			$this->getPropertyValue( $this->instance, 'post_type_archive_builder' ),
			'Post type archive builder should be of class Indexable_Post_Type_Archive_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Date_Archive_Builder::class,
			$this->getPropertyValue( $this->instance, 'date_archive_builder' ),
			'Date archive builder should be of class Indexable_Date_Archive_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_System_Page_Builder::class,
			$this->getPropertyValue( $this->instance, 'system_page_builder' ),
			'System page builder should be of class Indexable_System_Page_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Hierarchy_Builder::class,
			$this->getPropertyValue( $this->instance, 'hierarchy_builder' ),
			'Hierarchy builder should be of class Indexable_Hierarchy_Builder.'
		);
		$this->assertInstanceOf(
			Primary_Term_Builder::class,
			$this->getPropertyValue( $this->instance, 'primary_term_builder' ),
			'Primary term builder should be of class Primary_Term_Builder.'
		);
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' ),
			'Indexable helper should be of class Indexable_Helper.'
		);
		$this->assertInstanceOf(
			Indexable_Version_Manager::class,
			$this->getPropertyValue( $this->instance, 'version_manager' ),
			'Version manager should be of class Indexable_Version_Manager.'
		);
		$this->assertInstanceOf(
			Indexable_Link_Builder::class,
			$this->getPropertyValue( $this->instance, 'link_builder' ),
			'Link builder should be of class Indexable_Link_Builder.'
		);
	}

	/**
	 * Tests setting the indexable repository.
	 *
	 * @covers ::set_indexable_repository
	 *
	 * @return void
	 */
	public function test_set_indexable_repository() {
		$indexable_repository = Mockery::mock( 'Yoast\WP\SEO\Repositories\Indexable_Repository' );
		$this->instance->set_indexable_repository( $indexable_repository );
		$this->assertSame(
			$indexable_repository,
			$this->getPropertyValue( $this->instance, 'indexable_repository' ),
			'Indexable repository should be set.'
		);
	}
}
