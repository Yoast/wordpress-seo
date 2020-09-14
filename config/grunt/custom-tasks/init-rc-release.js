'use strict';

/**
 * helper function that takes the grunt option name as argument and the option as second argument to set whenever the option name is not defined as grunt option
 * @param {array} 
 * @returns {bool}
 */
function gruntOptionLogicToPreseveFalseValue( gruntOptionName, fallbackValue ) {
	const gruntOptionValue = grunt.option( gruntOptionName ) ;
    return (typeof gruntOptionValue === 'undefined' ) ? fallbackValue: gruntOptionValue;
}

/**
 * helper function adds a function to a string to determan is that sctring in the list specified list 
 * @param {array} 
 * @returns {bool}
 */

if (!String.prototype.isInList) {
	String.prototype.isInList = function() {
		let value = this.valueOf();
		for (let i = 0, l = arguments.length; i < l; i += 1) {
			if (arguments[i] === value) return true;
		}
		return false;
	}
 }

/**
 * Grunt task Initializes the configuration needed to do an RC release..
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"init-rc-release",
		"Initializes the configuration needed to do an RC release.",
		function() {
			const options = this.options({
				failOnError: true,
				enableSvnDeploy: false,
				githubOwner: '',
				githubRepo: '',
				alternativeBranch: 'CI-rc-test',
				alternativeBranchPush: false,
				enableGithubRelease: false,
				noBump: false,
			});
        

			let owner;
			let repo;
			const pluginVersionArg = grunt.option( 'plugin-version' );
			const type = grunt.option( 'type' ) || options.type;
			const enableSvnDeploy = gruntOptionLogicToPreseveFalseValue( 'enableSvnDeploy', options.enableSvnDeploy );
			/*
			*const enableSvnDeployArg = grunt.option( 'enableSvnDeploy' ) ;
			*const enableSvnDeploy = (typeof enableSvnDeployArg === 'undefined' ) ? options.enableSvnDeploy: enableSvnDeployArg;
			*/
			const enableSlackArg = grunt.option( 'enableSlack' ) 
			const enableSlack = (typeof enableSlackArg === 'undefined' ) ? options.enableSlack: enableSlackArg ;
			const enableGithubReleaseArg = grunt.option( 'enableGithubRelease') 
			const enableGithubRelease = (typeof enableGithubReleaseArg === 'undefined' ) ? options.enableGithubRelease: enableGithubReleaseArg;
			
			
			
			const noBumpArg = grunt.option( 'no-version-bump' ) 
			const noBump = (typeof noBumpArg === 'undefined' ) ? options.noBump: noBumpArg ;


			const GithubRepository = process.env.GITHUB_REPOSITORY || ''
			if (GithubRepository === ''){
				owner = grunt.option( 'owner' ) || options.githubOwner;
				repo = grunt.option( 'repo' ) || options.githubRepo;
			} else {
				var repositoryUrlParts = GithubRepository.split("/")
				if (repositoryUrlParts.length == 1){
					owner = grunt.option( 'owner' ) || options.githubOwner;
					repo = grunt.option( 'repo' ) || repositoryUrlParts[0] || options.githubRepo ;
				}  
				if (repositoryUrlParts.length > 1){
					owner = grunt.option( 'owner' )  || repositoryUrlParts[0] || options.githubOwner;
					repositoryUrlParts.shift();				
					repo = grunt.option( 'repo' ) || repositoryUrlParts.join("/") || options.githubRepo ;
				}  	
			}

			if ( ! pluginVersionArg ) {
				grunt.fail.fatal( "Missing --plugin-version argument (i.e. x.x.x)" );
			}

			// If no type is specified, abort the task.
			if ( ! type ) {
				grunt.fail.fatal( "Missing --type argument (release or hotfix)" );
			}

			// Check here if type match release | hotfix
			if (! type.isInList('release', 'hotfix')){
				grunt.fail.fatal( "wrong --type argument is not one of: release, hotfix" );
			}

			const branchForRC = grunt.option( 'branchForRC' ) || type + "/" + pluginVersionArg;

			
			grunt.config( "create-github-release.seo-free-rc-pre-release.options.enable", enableGithubRelease);
			grunt.config( "deploy-to-wordpress.trunk.options.enable", enableSvnDeploy );
		
			grunt.config.data.noBump = noBump,
			grunt.config.data.pluginVersionArg = pluginVersionArg,
			grunt.config.data.type = type,
			grunt.config.data.branchForRC = branchForRC;
			grunt.config.data.enableSlack = enableSlack;
			grunt.config.data.githubOwner = owner;
			grunt.config.data.githubRepo = repo;
			grunt.config.data.owner = owner;
			grunt.config.data.repo = repo;
			grunt.config.data.alternativeBranch = options.alternativeBranch;
			grunt.config.data.alternativeBranchPush = options.alternativeBranchPush
			
			grunt.verbose.writeln("githubowner: " + owner);
			grunt.verbose.writeln("githubrepo: " + repo);
			grunt.verbose.writeln("plugin currend version: " + grunt.config.data.pluginVersion);
			grunt.verbose.writeln("plugin-version: " + grunt.option( 'plugin-version'));
			grunt.verbose.writeln("enableSlack: " + enableSlack);
			grunt.verbose.writeln("enableSvnDeploy: " + enableSvnDeploy);
			grunt.verbose.writeln("enableGithubRelease: " + enableGithubRelease);
		},
	)
}
