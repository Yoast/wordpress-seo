'use strict';

/**
 * helper function
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





module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"init-rc-release",
		"central entry point to set options in one place",
		function() {
            const options = this.options({
                failOnError: true,
                enableSvnDeploy: false,
                githubOwner: '',
                githubRepo: '',
                alternativeBranch: 'CI-test',
                alternativeBranchPush: false,
                enableGithubRelease: false,
        });
        

        let owner;
        let repo;
        const version = grunt.option( "plugin-version" );
        const type = grunt.option( 'type' ) || options.type;
        const enableSvnDeployArg = grunt.option( 'enableSvnDeploy' ) ;
        const enableSvnDeploy = (typeof enableSvnDeployArg === 'undefined' ) ? options.enableSvnDeploy: enableSvnDeployArg;
        const enableSlackArg = grunt.option( 'enableSlack' ) 
        const enableSlack = (typeof enableSlackArg === 'undefined' ) ? options.enableSlack: enableSlackArg ;
        const enableGithubReleaseArg = grunt.option( 'enableGithubRelease') 
        const enableGithubRelease = (typeof enableGithubReleaseArg === 'undefined' ) ? options.enableGithubRelease: enableGithubReleaseArg;

        const GithubRepository = process.env.GITHUB_REPOSITORY || ''
        if (GithubRepository === ''){
            owner = grunt.option( 'owner' ) || options.githubOwner;
            repo = grunt.option( 'repo' ) || options.githubRepo;
        } else {
            var res = GithubRepository.split("/")
            if (res.length == 1){
                owner = grunt.option( 'owner' ) || options.githubOwner;
                repo = grunt.option( 'repo' ) || options.githubRepo || res[0];
            }  
            if (res.length > 1){
                owner = grunt.option( 'owner' ) || options.githubOwner || res[0];
                res.shift();				
                repo = grunt.option( 'repo' ) || options.githubRepo || res.join("/");
            }  	
        }

        if ( ! version ) {
            grunt.fail.fatal( "Missing --plugin-version argument (i.e. x.x.x)" );
        }

        // If no type is specified, abort the task.
        if ( ! type ) {
            grunt.fail.fatal( "Missing --type argument (release or hotfix)" );
        }

        // Check here if type match release | hotfix
        if (! type.isInList('release', 'hotfix')){
            grunt.fail.fatal( "wrong --type argument (release or hotfix)" );
        }

        const branchForRC =  grunt.option( 'branchForRC' ) || type + "/" + version ;

        
        grunt.option( 'type' , type);
       
        grunt.config( "add-github-release.seo-free-rc-pre-release.options.enable", enableGithubRelease);
        grunt.config( "deploy-to-wordpress.trunk.options.enable", enableSvnDeploy);
        
        grunt.config.data.branchForRC = branchForRC;
        grunt.config.data.enableSlack = enableSlack;
        grunt.config.data.owner = owner;
        grunt.config.data.repo =  repo;
        grunt.config.data.alternativeBranch = options.alternativeBranch;
        grunt.config.data.alternativeBranchPush = options.alternativeBranchPush
        

        grunt.verbose.writeln("plugin-version:" + grunt.option( 'plugin-version'));
        grunt.verbose.writeln("type:" + grunt.option( 'type' ));
        grunt.verbose.writeln("enableSlack:" + enableSlack);
        grunt.verbose.writeln("enableSvnDeploy:" + enableSvnDeploy);
        grunt.verbose.writeln("enableGithubRelease:" + enableGithubRelease);

    },
    
    )
}