module.exports = {
	"default": {
		options: {
			githubOwner: "yoast",
			githubRepo: "<%= pluginSlug %>",
			enableSlack: true,
			type: "release",
			enableSvnDeploy: false,
			enableGithubRelease: true,
			alternativeBranch: "CI-rc-test",
			alternativeBranchPush: true,
			noBump: false,
		},
	},
	"withrelease": {
		options: {
			githubOwner: "yoast",
			githubRepo: "<%= pluginSlug %>",
			enableSlack: true,
			type: "release",
			enableSvnDeploy: true,
			enableGithubRelease: true,
			alternativeBranch: "CI-rc-test",
			alternativeBranchPush: false,
			noBump: false,
		},
	},
};
