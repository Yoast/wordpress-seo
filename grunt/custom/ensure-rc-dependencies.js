module.exports = function( grunt ) {
	grunt.registerTask(
		"ensure-rc-dependencies",
		"Ensures the JavaScript packages are up-to-date.",

		/**
		 * Ensures that the JavaScript packages are updated.
		 *
		 * @returns {void}
		 */
		function() {
			const gruntFlags = grunt.option.flags();

			const componentsRC = -1 === gruntFlags.indexOf( '--yoast-components-no-rc' );
			const yoastSEORC   = -1 === gruntFlags.indexOf( '--yoastseo-no-rc' );

			let installComponents = "shell:yarn-add-yoast-components";
			if ( componentsRC ) {
				installComponents += "-rc";
			}

			let installYoastSEO = "shell:yarn-add-yoastseo";
			if ( yoastSEORC ) {
				installYoastSEO += "-rc";
			}

			grunt.task.run( "shell:unlink-monorepo" );
			grunt.task.run( installComponents );
			grunt.task.run( installYoastSEO );
			grunt.task.run( "shell:get-monorepo-versions" );
			grunt.task.run( "prompt:monorepoVersions" );
			grunt.task.run( "shell:composer-install" );
			grunt.task.run( "shell:composer-update-yoast-dependencies" );
		}
	);
};

