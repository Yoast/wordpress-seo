module.exports = {
	options: {
		githubOwner: "<%= githubOwner %>",
		githubRepo: "<%= githubRepo %>",
		srcZipFilename: "artifact.zip",
		dstZipFilename: "<%= pluginSlug %>.zip",
		uploadZip: true,
		enable: true,
	},
	"default": {

	},
	/* eslint-disable camelcase */
	"seo-free-rc-pre-release": {
		options: {
			manualEditChangelog: true,
			target_commitish: "<%= branchForRC %>",
			prerelease: true,
		},
	},
	"seo-free-release": {
		options: {
			manualEditChangelog: false,
			target_commitish: "master",
			prerelease: false,
		},
	},
	/* eslint-enable camelcase */
};
