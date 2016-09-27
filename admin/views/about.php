<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$version = '3.4';

/**
 * Display a list of contributors
 *
 * @param array $contributors Contributors' data, associative by GitHub username.
 */
function wpseo_display_contributors( $contributors ) {
	foreach ( $contributors as $username => $dev ) {
		echo '<li class="wp-person" id="wp-person-', $username, '">';
		echo '<a href="https://github.com/', $username, '" class="web"><img src="//gravatar.com/avatar/', $dev->gravatar, '?s=60" class="gravatar" alt="">', $dev->name, '</a>';
		echo '<span class="title">', $dev->role, "</span></li>\n";
	}
}

?>

<div class="wrap about-wrap">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( 'Thank you for updating %1$s!', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>

	<p class="about-text">
		<?php
		/* translators: %1$s and %2$s expands to anchor tags, %3$s expands to Yoast SEO */
		printf( __( 'While most of the development team is at %1$sYoast%2$s in the Netherlands, %3$s is created by a worldwide team.', 'wordpress-seo' ), '<a target="_blank" href="https://yoast.com/">', '</a>', 'Yoast SEO' );
		echo ' ';
		printf( __( 'Want to help us develop? Read our %1$scontribution guidelines%2$s!', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/wpseocontributionguidelines">', '</a>' );
		?>
	</p>

	<div class="wp-badge"></div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" href="#top#integrations" id="integrations-tab"><?php _e( 'Integrations', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="credits" class="wpseotab">
		<h2 class="screen-reader-text"><?php esc_html_e( 'Team and contributors', 'wordpress-seo' ); ?></h2>

		<h3 class="wp-people-group"><?php _e( 'Product Management', 'wordpress-seo' ); ?></h3>
		<ul class="wp-people-group " id="wp-people-group-project-leaders">
			<?php
			$people = array(
				'jdevalk'     => (object) array(
					'name'     => 'Joost de Valk',
					'role'     => __( 'Project Lead', 'wordpress-seo' ),
					'gravatar' => 'f08c3c3253bf14b5616b4db53cea6b78',
				),
				'mariekerakt' => (object) array(
					'name'     => 'Marieke van de Rakt',
					'role'     => __( 'Head R&D', 'wordpress-seo' ),
					'gravatar' => '1d83533e299c379140f9fcc2cb0015cb',
				),
				'irenestr'    => (object) array(
					'name'     => 'Irene Strikkers',
					'role'     => __( 'Linguist', 'wordpress-seo' ),
					'gravatar' => '074d67179d52561e36e57e8e9ea8f8cf',
				),
			);

			wpseo_display_contributors( $people );
			?>
		</ul>
		<h3 class="wp-people-group"><?php _e( 'Development Leaders', 'wordpress-seo' ); ?></h3>
		<ul class="wp-people-group " id="wp-people-group-development-leaders">
			<?php
			$people = array(
				'omarreiss' => (object) array(
					'name'     => 'Omar Reiss',
					'role'     => __( 'CTO', 'wordpress-seo' ),
					'gravatar' => '86aaa606a1904e7e0cf9857a663c376e',
				),
				'atimmer'   => (object) array(
					'name'     => 'Anton Timmermans',
					'role'     => __( 'Architect', 'wordpress-seo' ),
					'gravatar' => 'b3acbabfdd208ecbf950d864b86fe968',
				),
				'moorscode' => (object) array(
					'name'     => 'Jip Moors',
					'role'     => __( 'Architect', 'wordpress-seo' ),
					'gravatar' => '1751c5afc377ef4ec07a50791db1bc52',
				),
			);

			wpseo_display_contributors( $people );
			?>
		</ul>
		<h3 class="wp-people-group"><?php _e( 'Yoast Developers', 'wordpress-seo' ); ?></h3>
		<ul class="wp-people-group " id="wp-people-group-core-developers">
			<?php
			$people = array(
				'andrea'        => (object) array(
					'name'     => 'Andrea Fercia',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '074af62ea5ff218b6a6eeab89104f616',
				),
				'rarst'         => (object) array(
					'name'     => 'Andrey Savchenko',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'c445c2491f9f55409b2e4dccee357961',
				),
				'andizer'       => (object) array(
					'name'     => 'Andy Meerwaldt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'a9b43e766915b48031eab78f9916ca8e',
				),
				'boblinthorst'  => (object) array(
					'name'     => 'Bob Linthorst',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
				),
				'CarolineGeven' => (object) array(
					'name'     => 'Caroline Geven',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'f2596a568c3974e35f051266a63d791f',
				),
				'terw-dan'      => (object) array(
					'name'     => 'Danny Terwindt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '20a04b0736e630e80ce2dbefe3f1d62f',
				),
				'diedexx'       => (object) array(
					'name'     => 'Diede Exterkate',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '59908788f406037240ee011388db29f8',
				),
				'irenestr2'      => (object) array(
					'name'     => 'Irene Strikkers',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '074d67179d52561e36e57e8e9ea8f8cf',
				),
				'jcomack'       => (object) array(
					'name'     => 'Jimmy Comack',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '41073ef9e1f3e01b03cbee75cee33bd4',
				),
				'rensw90'       => (object) array(
					'name'     => 'Rens Weerman',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'b0a3b8fed2b5ac66a082f0e915d4ea6f',
				),
			);

			wpseo_display_contributors( $people );
			?>
		</ul>
		<h3 class="wp-people-group"><?php _e( 'Quality Assurance & Testing', 'wordpress-seo' ); ?></h3>
		<ul class="wp-people-group " id="wp-people-group-qa-testing">
			<?php
			$people = array(
				'tacoverdo'    => (object) array(
					'name'     => 'Taco Verdonschot',
					'role'     => __( 'QA & Translations Manager', 'wordpress-seo' ),
					'gravatar' => 'd2d3ecb38cacd521926979b5c678297b',
				),
				'monbauza'     => (object) array(
					'name'     => 'Ramon Bauza',
					'role'     => __( 'Tester', 'wordpress-seo' ),
					'gravatar' => 'de09b8491ab1d927e770f7519219cfc9',
				),
				'boblinthorst2' => (object) array(
					'name'     => 'Bob Linthorst',
					'role'     => __( 'Tester', 'wordpress-seo' ),
					'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
				),
			);

			wpseo_display_contributors( $people );
			?>
		</ul>
		<?php
		$patches_from = array();
		if ( ! empty( $patches_from ) ) :
			?>
			<h3 class="wp-people-group"><?php _e( 'Community contributors', 'wordpress-seo' ); ?></h3>
			<p><?php printf( __( 'We\'re always grateful for patches from non-regular contributors, in %1$s %2$s, patches from the following people made it in:', 'wordpress-seo' ), 'Yoast SEO', $version ); ?></p>
			<ul class="ul-square">
				<?php
				foreach ( $patches_from as $patcher => $link ) {
					echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
				}
				?>
			</ul>
		<?php endif; ?>
	</div>

	<div id="integrations" class="wpseotab">
		<h2>Yoast SEO Integrations</h2>
		<p class="about-description">
			Yoast SEO 3.0 brought a way for theme builders and custom field plugins to integrate with Yoast SEO. These
			integrations make sure that <em>all</em> the data on your page is used for the content analysis. On this
			page, we highlight the frameworks that have nicely working integrations.
		</p>

		<ol>
			<li><a target="_blank" href="https://wordpress.org/plugins/yoast-seo-acf-analysis/">Yoast ACF
					Integration</a> - an integration built by <a href="https://forsberg.ax">Marcus Forsberg</a> and Team
				Yoast
			</li>
			<li><a target="_blank" href="https://www.elegantthemes.com/plugins/divi-builder/">Divi Builder</a></li>
			<li><a target="_blank" href="https://vc.wpbakery.com/">Visual Composer</a></li>
		</ol>

		<h3>Other integrations</h3>
		<p class="about-description">
			We've got another integration we'd like to tell you about:
		</p>

		<ol>
			<li><a target="_blank" href="https://wordpress.org/plugins/glue-for-yoast-seo-amp/">Glue for Yoast SEO &amp;
					AMP</a> - an integration between <a href="https://wordpress.org/plugins/amp/">the WordPress AMP
					plugin</a> and Yoast SEO.
			</li>
			<li>
				<a target="_blank" href="https://wordpress.org/plugins/fb-instant-articles/">Instant Articles for WP</a>
				- Enable Instant Articles for Facebook on your WordPress site and integrates with Yoast SEO.
			</li>
		</ol>
	</div>
</div>
