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
 * @param array $contributors
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

	<h1><?php _e( 'Thank you for updating WordPress SEO by Yoast!', 'wordpress-seo' ); ?></h1>

	<div class="about-text">
		<?php _e( 'On your way to better search rankings!', 'wordpress-seo' ); ?><br/>
		<br/>
		<?php _e( 'WordPress SEO by Yoast 2.0 helps you optimize your site by making you ready for Google\'s Knowledge Graph and simplifying the WordPress SEO by Yoast admin.', 'wordpress-seo' ); ?>
	</div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#new" id="new-tab">
			<?php
			/* translators: %s: '2.0' version number */
			echo sprintf( __( 'What’s New In %s', 'wordpress-seo' ), '2.0' );
			?>
		</a>
		<a class="nav-tab nav-tab-active" href="#top#v22" id="v22-tab">2.2</a>
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="new" class="wpseotab">
		<div class="changelog headline-feature">
			<h2><?php _e( 'Simplified Admin Menus', 'wordpress-seo' ); ?></h2>

			<div class="feature-section">
				<div class="col">
					<h3><?php _e( 'We’ve merged several menu items to make the most important settings stand out more.', 'wordpress-seo' ); ?></h3>

					<p><?php _e( 'Not all settings are created equal. Some require their own admin page and really need your attention. Others are more advanced and don’t need changing by everyone. This release helps you by focusing on what’s important.', 'wordpress-seo' ); ?></p>

					<p><?php printf( esc_html__( 'Several settings were moved to the %1$sAdvanced page%2$s, the bulk editor, file editor and import & export tools were all moved to the %3$sTools page%2$s.', 'wordpress-seo' ), '<a href="' . admin_url( 'admin.php?page=wpseo_advanced' ) . '">', '</a>', '<a href="' . admin_url( 'admin.php?page=wpseo_tools' ) . '">' ); ?></p>
				</div>
				<div class="col">
					<img class="aligncenter" src="http://uploads.yoast.nl/seo-menu_1A752658.png">
				</div>
			</div>

			<div class="clear"></div>
		</div>

		<hr>

		<div class="changelog headline-feature dfw">
			<h2><?php _e( 'Ready for Google’s Knowledge Graph', 'wordpress-seo' ); ?></h2>

			<div class="feature-image">
				<div class="dfw-container">
					<img src="http://uploads.yoast.nl/knowledge-graph_1A752930.png"/>
				</div>
				<h3><?php _e( 'Knowledge Graph: We’ve got your back!', 'wordpress-seo' ); ?></h3>

				<p>
					<?php printf( __( 'Google recently rolled out changes that let you specify you or your companies name, social profiles and logo<sup>*</sup>, to use in their %1$sKnowledge Graph%2$s boxes.', 'wordpress-seo' ), '<a href="http://yoa.st/knowledgegraph">', '</a>' ); ?>
					<?php printf( __( 'Decide whether you’re a company or a person and add the required info in the %1$sgeneral settings%2$s, then add your %3$ssocial profiles%2$s. We’ll do the rest.', 'wordpress-seo' ), '<a href="' . admin_url( 'admin.php?page=wpseo_dashboard#top#knowledge-graph' ) . '">', '</a>', '<a href="' . admin_url( 'admin.php?page=wpseo_social' ) . '">' ); ?>
				</p>

				<p><sup>*</sup>
					<small><?php _e( 'Logo only works for companies.', 'wordpress-seo' ); ?></small>
				</p>
			</div>
		</div>

		<hr>

		<div class="changelog feature-list finer-points">
			<h2><?php _e( 'More in this release', 'wordpress-seo' ); ?></h2>

			<div class="feature-section col two-col">
				<div>
					<span class="dashicons dashicons-twitter"></span>
					<h4><?php _e( 'Twitter Galleries', 'wordpress-seo' ); ?></h4>
					<h2>WordPress SEO 2.0.1</h2>
					<p><small>Release date: April 1st, 2015</small></p>
					<p>This update fixes a few small bugs:</p>
					<ul class="ul-disc">
						<li>Fixes an issue where (in rare cases) people upgrading to 2.0 got stuck in a redirect loop on their admin.</li>
						<li>Fixes a broken link in the Dutch translation, causing the Pinterest tab on the Social settings page to overflow into the Google+ tab.</li>
						<li>Fixes a small typo on the about page.</li>
					</ul>
					<p>
						<?php printf( __( 'If you use galleries in your posts and have Twitter meta data enabled on %1$sSocial → Twitter%2$s, galleries will now be auto-detected and put out as Gallery Cards. All that’s left for your is to %3$sverify the cards with Twitter%2$s.', 'wordpress-seo' ), '<a href="' . admin_url( 'admin.php?page=wpseo_social#top#twitterbox' ) . '">', '</a>', '<a target="_blank" href="http://yoa.st/twittercardsverify">' ); ?>
					</p>
				</div>

				<div class="last-feature">
					<span class="dashicons dashicons-performance"></span>
					<h4><?php _e( 'Performance Improvements', 'wordpress-seo' ); ?></h4>

					<p>
						<?php _e( 'This release has made the code of WordPress SEO by Yoast that runs on the frontend of your site approximately 30% faster.', 'wordpress-seo' ); ?>
					</p>
				</div>

				<div>
					<span class="dashicons dashicons-admin-generic"></span>
					<h4><?php _e( 'Improved Settings Screens', 'wordpress-seo' ); ?> </h4>

					<p>
						<?php _e( 'All the settings screens have been updated to use exactly the same, tab-based, styling, making them much more comprehensible.', 'wordpress-seo' ); ?>
					</p>
				</div>

				<div class="last-feature">
					<span class="dashicons dashicons-translation"></span>
					<h4><?php _e( 'More Translations', 'wordpress-seo' ); ?></h4>

					<p>
						<?php printf( __( 'WordPress SEO by Yoast ships, at time of release, with 26 translations, of which 10 are complete. That\'s a huge improvement from last time, and we\'re improving every week. Join us at %1$stranslate.yoast.com%2$s!', 'wordpress-seo' ), '<a target="_blank" href="https://translate.yoast.com/projects/wordpress-seo">', '</a>' ); ?>
					</p>
				</div>
			</div>
		</div>

		<hr>

		<div class="return-to-dashboard">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ); ?>"><?php _e( 'Go to The General settings page →', 'wordpress-seo' ); ?></a>
		</div>

	</div>

	<div id="v22" class="wpseotab">

		<h2>WordPress SEO 2.2-RC</h2>
		<p><small>Release Date: June 3rd, 2015</small></p>

		<h4>Bugfixes:</h4>

		<ul class="ul-disc">
			<li>Fixes a bug where the widgets were removed from every XML file. This is now only the case for the sitemaps.</li>
			<li>Fixes a bug where validation errors were shown for the wrong variables in the titles and metas settings.</li>
			<li>Fixes a bug where the SEO toolbar was broken.</li>
			<li>Fixes a few typo's, props <a href="https://github.com/GaryJones" target="_blank">Gary Jones</a>.</li>
			<li>Fixes a bug where links in tooltips were not impossible to click.</li>
			<li>Fixes a broken link to the permalinks section of the advanced settings, props <a href="https://github.com/michaelnordmeyer" target="_blank">Michael Nordmeyer</a>.</li>
			<li>Fixes settings import on multisite.</li>
			<li>Fixes a bug where the sitemap could contain datetimes in the wrong timezone.</li>
			<li>Fixes a bug where the wrong Facebook user ID was added to the fb:admins meta tag. Adding FB admin user id is now a manual process.</li>
			<li>Fixed Open Graph and Twitter cards on static posts pages</li>
		</ul>

		<h4>Enhancements:</h4>

		<ul class="ul-disc">
			<li>Contains several accessibility improvements, including 'for' attributes for labels and several links to explanatory articles.</li>
			<li>Adds support for creating partial sitemaps with WP CLI, props <a href="https://github.com/larsschenk" target="_blank">Lars Schenk</a>.</li>
			<li>Add Google's mobile friendly test to the SEO toolbar, props <a href="https://github.com/bhubbard" target="_blank">Brandon Hubbard</a>.</li>
			<li>Makes sure slugs are not being stripped if the remaining slug is less than 3 characters, props <a href="https://github.com/andyexeter" target="_blank">andyexeter</a>.</li>
			<li>Shows an activation error when dependencies were not installed properly with composer.</li>
			<li>Added a filter to allow the the RSS footer to be dynamically shown/hidden, props <a href="https://github.com/hlashbrooke" target="_blank">Hugh Lashbrooke</a>.</li>
			<li>Added many translator comments to help translators more easily get the context.</li>
			<li>Made sure Open Graph article tags are added separately, following up on the Open Graph specification.</li>
			<li>Adds recommended image sizes per Social network in the social tab of the 	SEO metabox.</li>
			<li>Removes the tracking functionality.</li>
			<li>Shows a dismissible notice with a link to the about page that is shown after every update. The user is no longer being redirected and only has to dismiss the notice once for all sites (in case of multisite).</li>
			<li>Makes the tour dismissible on user level.</li>
			<li>Adds Twitter profile to JSON LD output.</li>
		</ul>

		<h2>WordPress SEO 2.1</h2>
		<p><small>Release date: April 20th, 2015</small></p>
		<p>WordPress SEO 2.1 adds some more features on top of this release. Read the release notes for more info.</p>
		<ul class="ul-disc">
			<li>See the <a href="https://wordpress.org/plugins/wordpress-seo/changelog/" target="_blank">changelog</a> for a complete list of changes.</li>
			<li>Read our <a href="https://yoast.com/wordpress-seo-2-1-release-notes" target="_blank">release blogpost</a> for a more detailed explanation of the important changes in this release.</li>
			<li>Read our <a href="https://yoast.com/coordinated-security-release/" target="_blank">security blogpost</a> for the backstory about a security fix that was included in this release, in coordination with a significant part of the WordPress community.</li>
			<li>We've added support for Google's new URL representation in mobile search results. You can read more about it in <a href="https://yoast.com/changing-urls-in-search-results/" target="_blank">this blogpost</a>.</li>
		</ul>
		<h2>WordPress SEO 2.0.1</h2>
		<p><small>Release date: April 1st, 2015</small></p>
		<p>This update fixes a few small bugs:</p>
		<ul class="ul-disc">
			<li>Fixes an issue where (in rare cases) people upgrading to 2.0 got stuck in a redirect loop on their admin.</li>
			<li>Fixes a broken link in the Dutch translation, causing the Pinterest tab on the Social settings page to overflow into the Google+ tab.</li>
			<li>Fixes a small typo on the about page.</li>
		</ul>
	</div>

	<div id="credits" class="wpseotab">
		<p class="about-description">
			<?php
				printf( __( 'While most of the development team is at %1$sYoast%2$s in the Netherlands, WordPress SEO by Yoast is created by a worldwide team.', 'wordpress-seo' ), '<a target="_blank" href="https://yoast.com/">', '</a>' );
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
				'jrfnl'     => (object) array(
					'name'     => 'Juliette Reinders Folmer',
					'role'     => __( 'Lead Developer', 'wordpress-seo' ),
					'gravatar' => 'cbbac3e529102364dc3b026af3cc2988',
				),
				'omarreiss' => (object) array(
					'name'     => 'Omar Reiss',
					'role'     => __( 'Lead Developer', 'wordpress-seo' ),
					'gravatar' => '86aaa606a1904e7e0cf9857a663c376e',
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
				'petervw'       => (object) array(
					'name'     => 'Peter van Wilderen',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'e4662ebd4b59d3c196e2ba721d8a1efc',
				),
				'rarst'         => (object) array(
					'name'     => 'Andrey Savchenko',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'ab89ce39f47b327f1c85e4019e865a71',
				),
				'CarolineGeven' => (object) array(
					'name'     => 'Caroline Geven',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'f2596a568c3974e35f051266a63d791f',
				),
			);

			wpseo_display_contributors( $contributors );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributors to this release', 'wordpress-seo' ); ?></h4>
		<?php
		$patches_from = array(
			'Jack Neary'             => 'https://github.com/xeeeveee',
			'Koen Van den Wijngaert' => 'https://github.com/vdwijngaert',
			'Ezra Pool'              => 'https://github.com/Zae',
			'Andy Sozot'             => 'https://github.com/sozot',
		);
		?>
		<p><?php _e( 'We\'re always grateful for patches from non-regular contributors, this release, patches from the following people made it in:', 'wordpress-seo' ); ?></p>
		<ul class="ul-square">
			<?php
			foreach ( $patches_from as $patcher => $link ) {
				echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
			}
			?>
		</ul>
	</div>
</div>
