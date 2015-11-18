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
		echo '<a href="https://github.com/', $username, '"><img	src="https://secure.gravatar.com/avatar/', $dev->gravatar, '?s=60" class="gravatar" alt="', $dev->name, '"></a>';
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
		Yoast SEO 3.0 is about feedback. Feedback on what <em>you</em> can do to improve your site and your post(s).
		Feedback when you are doing what you should be doing: writing awesome content.
	</p>

	<div class="wp-badge"
	     style="background: url(<?php echo trailingslashit( plugin_dir_url( WPSEO_FILE ) ); ?>images/Yoast_SEO_Icon.svg); background-size: 150px 160px; box-shadow: none; border: none;"></div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#new" id="new-tab">
			<?php
			/* translators: %s: '3.0' version number */
			echo sprintf( __( 'What’s new in %s', 'wordpress-seo' ), '3.0' );
			?>
		</a>
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="new" class="wpseotab">

		<h2>Real time content analysis</h2>

		<p>No longer will you have to save your post or page for the content analysis to update, it'll be there in real
			time. Which is also why it's now in plain sight all the time.</p>

		<div class="headline-feature feature-video">
			<script charset="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script><div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_vdcuq7tfh1 videoFoam=true" style="height:100%;width:100%">&nbsp;</div></div></div>
		</div>

		<div class="feature-section two-col">
			<div class="col">
				<div class="media-container">
					<img src="//yoast-30.s3.amazonaws.com/snippet-editor.png" alt="Snippet editor">
				</div>
				<h3>A snippet editor</h3>

				<p>Our snippet preview got turned into a snippet editor. Click it, modify it, make it work. With instant
					inline feedback when it's too long and the content analysis updating straight away too.</p>
			</div>
			<div class="col">
				<div class="media-container">
					<img src="//yoast-30.s3.amazonaws.com/onpage.png" alt="OnPage.org indexability check">
				</div>
				<h3>Is your site indexable?</h3>

				<p>in collaboration with our friends at <a href="https://onpage.org/yoast-indexability/">OnPage.org</a>
					we now give you an indexability check for your site. It automatically tells you whether your site
					can be indexed by search engines and will alert you when that changes.</p>
			</div>
			<div class="col">
				<div class="media-container" style="text-align: center; background-color: #fff;">
					<img src="//yoast-30.s3.amazonaws.com/category-fixes.png" alt="Supercharged categories">
				</div>
				<h3>Supercharged categories</h3>

				<p>We've supercharged categories and tags: we've given them a snippet editor, social meta fields, etc.
					The entire post experience in Yoast SEO is now available for categories and tags too. Using custom
					taxonomies? Cool, we support those too!</p>
			</div>
			<div class="col">
				<div class="svg-container">
					<span class="dashicons dashicons-wordpress"></span>
				</div>
				<h3>WordPress 4.4? We're ready!</h3>

				<p>
					WordPress 4.4 is nearing completion. We've tested Yoast SEO extensively with it, and we're ready.
					With the new embeds functionality, our canonical URLs just work. Without you needing to do anything.
				</p>
			</div>

			<div class="clear"></div>

			<div class="return-to-dashboard">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ); ?>"><?php _e( 'Go to the General settings page →', 'wordpress-seo' ); ?></a>
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
						'role'     => __( 'Lead Developer', 'wordpress-seo' ),
						'gravatar' => '86aaa606a1904e7e0cf9857a663c376e',
					),
					'atimmer'   => (object) array(
						'name'     => 'Anton Timmermans',
						'role'     => __( 'Developer', 'wordpress-seo' ),
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
					'CarolineGeven' => (object) array(
						'name'     => 'Caroline Geven',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'f2596a568c3974e35f051266a63d791f',
					),
					'jrfnl'         => (object) array(
						'name'     => 'Juliette Reinders Folmer',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'cbbac3e529102364dc3b026af3cc2988',
					),
					'garyjones'     => (object) array(
						'name'     => 'Gary Jones',
						'role'     => 'Developer, QA & Accessibility',
						'gravatar' => 'f00cf4e7f02e10152f60ec3507fa8ba8',
					),
					'andizer'       => (object) array(
						'name'     => 'Andy Meerwaldt',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'a9b43e766915b48031eab78f9916ca8e',
					),
					'rarst'         => (object) array(
						'name'     => 'Andrey Savchenko',
						'role'     => 'For the 100+ fixes that didn\'t make the about page',
						'gravatar' => 'ab89ce39f47b327f1c85e4019e865a71',
					),
					'boblinthorst'  => (object) array(
						'name'     => 'Bob Linthorst',
						'role'     => 'For testing ridiculously hard',
						'gravatar' => 'ab89ce39f47b327f1c85e4019e865a71',
					),
					'diedexx'       => (object) array(
						'name'     => 'Diede Exterkate',
						'role'     => 'For testing ridiculously hard',
						'gravatar' => 'ab89ce39f47b327f1c85e4019e865a71',
					),

				);

				wpseo_display_contributors( $contributors );
				?>
			</ul>
			<h4 class="wp-people-group"><?php _e( 'Contributors to this release', 'wordpress-seo' ); ?></h4>
			<?php
			$patches_from = array(
				'Pete Nelson'       => 'https://github.com/petenelson',
				'Ajay D\'Souza'     => 'https://github.com/ajaydsouza',
				'Filippo Buratti'   => 'https://github.com/fburatti',
				'Michael Nordmeyer' => 'https://github.com/michaelnordmeyer',
				'Lars Schenk'       => 'https://github.com/larsschenk',
			);
			?>
			<p>We're always grateful for patches from non-regular contributors, in Yoast SEO 2.2 and 2.3, patches from
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
