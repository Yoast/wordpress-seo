<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Display a list of contributors
 *
 * @param array $contributors Contributors' data, associative by GitHub username.
 */
function wpseo_display_contributors( $contributors ) {
	foreach ( $contributors as $username => $dev ) {
		echo '<li class="wp-person" id="wp-person-', $username, '">';
		echo '<a href="https://github.com/', $username, '"><img	src="//gravatar.com/avatar/', $dev->gravatar, '?s=60" class="gravatar" alt="', $dev->name, '"></a>';
		echo '<a class="web" href="https://github.com/', $username, '">', $dev->name, '</a>';
		echo '<span class="title">', $dev->role, '</span></li>';
	}
}

?>

<div class="wrap about-wrap">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( 'Thank you for updating %1$s!', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>

	<p class="about-text">
		Yoast SEO 3.1 has, next to tons of bugfixes, 4 sections of "major" changes: an improved snippet editor, a
		primary category feature, an overhauled admin section and (in Premium), an improved redirects feature.
	</p>

	<div class="wp-badge"></div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#new" id="new-tab">
			<?php
			/* translators: %s: '3.0' version number */
			echo sprintf( __( 'What’s new in %s', 'wordpress-seo' ), '3.1' );
			?>
		</a>
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="new" class="wpseotab">

		<h2>Release video and post</h2>
		<p>In <a href="https://yoast.com/yoast-seo-3-1/">this post</a>, Joost explains the features of Yoast SEO 3.1. If
			you're more of a video type, check the release video below:</p>

		<div class="headline-feature feature-video">
			<?php // @codingStandardsIgnoreStart ?>
			<iframe style="width:1050px;height:591px;" src="https://www.youtube.com/embed/Qt1yGL_spW4?rel=0&vq=hd720"
			        frameborder="0" allowfullscreen></iframe>
			<?php // @codingStandardsIgnoreEnd ?>
		</div>

		<div class="feature-section two-col">
			<div class="col">
				<div class="media-container">
					<img style="height: 350px; margin: 0 0 10px 0;"
					     src="//yoast-30.s3.amazonaws.com/snippet-editor-new.png" alt="Snippet editor">
				</div>
				<h3>An improved snippet editor</h3>

				<p>All of the user feedback on Yoast SEO 3.0 has made us improve on the snippet editor some more. This
					is
					what it looks like now!</p>
			</div>
			<div class="col">
				<div class="media-container">
					<img style="height: 350px; margin: 0 0 10px 0;" src="//yoast-30.s3.amazonaws.com/admin-toggles.png"
					     alt="Admin overhaul">
				</div>
				<h3>Admin overhaul</h3>

				<p>We had checboxes that enabled things and checkboxes that disabled things. That's, of course,
					completely unusable. So now we have toggles. Everywhere.</p>
			</div>			<div class="col">
				<div class="media-containerr">
					<img style="height: 225px; margin: 0 0 10px 0;"
					     src="//yoast-30.s3.amazonaws.com/primary-category.png" alt="Primary category">
				</div>
				<h3>Primary category</h3>

				<p>If you've ever been annoyed by a breadcrumb showing the wrong category: this one's for you!</p>
			</div>
			<div class="col">
				<div class="media-container">
					<img style="height: 225px; margin: 0 0 10px 0;" src="//yoast-30.s3.amazonaws.com/redirect.png"
					     alt="Redirects overhaul">
				</div>
				<h3>Redirects improvements</h3>

				<p>We've worked hard on making our Redirects feature in Yoast SEO Premium even better. Mostly by
					improving our validation features, like preventing you from making infinite loops. But: we've also
					added a neat inline editor, the option to do HTTP
					451 statuses and more.</p>
			</div>

			<div class="clear"></div>

			<div class="return-to-dashboard">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ); ?>"><?php _e( 'Go to the General settings page →', 'wordpress-seo' ); ?></a>
			</div>

		</div>
	</div>

	<div id="credits" class="wpseotab">
		<p class="about-description">
			<?php
			/* translators: %1$s and %2$s expands to anchor tags, %3$s expands to Yoast SEO */
			printf( __( 'While most of the development team is at %1$sYoast%2$s in the Netherlands, %3$s is created by a worldwide team.', 'wordpress-seo' ), '<a target="_blank" href="https://yoast.com/">', '</a>', 'Yoast SEO' );
			echo ' ';
			printf( __( 'Want to help us develop? Read our %1$scontribution guidelines%2$s!', 'wordpress-seo' ), '<a target="_blank" href="http://yoa.st/wpseocontributionguidelines">', '</a>' );
			?>
		</p>

		<h4 class="wp-people-group"><?php _e( 'Project Leaders', 'wordpress-seo' ); ?></h4>
		<ul class="wp-people-group " id="wp-people-group-project-leaders">
			<?php
			$leaders = array(
				'jdevalk'   => (object) array(
					'name'     => 'Joost de Valk',
					'role'     => __( 'Project Lead', 'wordpress-seo' ),
					'gravatar' => 'f08c3c3253bf14b5616b4db53cea6b78',
				),
				'omarreiss' => (object) array(
					'name'     => 'Omar Reiss',
					'role'     => __( 'Lead Architect', 'wordpress-seo' ),
					'gravatar' => '86aaa606a1904e7e0cf9857a663c376e',
				),
				'atimmer'   => (object) array(
					'name'     => 'Anton Timmermans',
					'role'     => __( 'Architect', 'wordpress-seo' ),
					'gravatar' => 'b3acbabfdd208ecbf950d864b86fe968',
				),
				'tacoverdo' => (object) array(
					'name'     => 'Taco Verdonschot',
					'role'     => __( 'QA & Translations Manager', 'wordpress-seo' ),
					'gravatar' => 'd2d3ecb38cacd521926979b5c678297b',
				),
			);

			wpseo_display_contributors( $leaders );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributing Developers', 'wordpress-seo' ); ?></h4>
		<ul class="wp-people-group " id="wp-people-group-core-developers">
			<?php
			$contributors = array(
				'andizer'       => (object) array(
					'name'     => 'Andy Meerwaldt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'a9b43e766915b48031eab78f9916ca8e',
				),
				'terw-dan'      => (object) array(
					'name'     => 'Danny Terwindt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '20a04b0736e630e80ce2dbefe3f1d62f',
				),
				'CarolineGeven' => (object) array(
					'name'     => 'Caroline Geven',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'f2596a568c3974e35f051266a63d791f',
				),
				'jcomack'       => (object) array(
					'name'     => 'Jimmy Comack',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '41073ef9e1f3e01b03cbee75cee33bd4',
				),
				'moorscode'     => (object) array(
					'name'     => 'Jip Moors',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '1751c5afc377ef4ec07a50791db1bc52',
				),
				'rarst'         => (object) array(
					'name'     => 'Andrey Savchenko',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'c445c2491f9f55409b2e4dccee357961',
				),
				'boblinthorst'  => (object) array(
					'name'     => 'Bob Linthorst',
					'role'     => __( 'Tester / Developer', 'wordpress-seo' ),
					'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
				),
				'diedexx'       => (object) array(
					'name'     => 'Diede Exterkate',
					'role'     => __( 'Tester / Developer', 'wordpress-seo' ),
					'gravatar' => '59908788f406037240ee011388db29f8',
				),
				'jrfnl'         => (object) array(
					'name'     => 'Juliette Reinders Folmer',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'cbbac3e529102364dc3b026af3cc2988',
				),

			);

			wpseo_display_contributors( $contributors );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributors to this release', 'wordpress-seo' ); ?></h4>
		<?php
		$patches_from = array(
			'Daniel Homer' => 'https://github.com/danielhomer',
		);
		?>
		<p>We're always grateful for patches from non-regular contributors, in Yoast SEO 3.0, patches from
			the
			following people made it in:</p>
		<ul class="ul-square">
			<?php
			foreach ( $patches_from as $patcher => $link ) {
				echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
			}
			?>
		</ul>
	</div>
</div>
