// These passive auxiliaries start with be-, ge- or er- en and with -t, and therefore look like a participle.
var participleLike = [ "bekommst", "bekommt", "bekamst", "bekommest", "bekommet", "bekämest", "bekämst", "bekämet", "bekämt",
	"gekriegt", "gehörst", "gehört", "gehörtest", "gehörtet", "gehörest", "gehöret", "erhältst", "erhält", "erhaltet", "erhielt",
	"erhieltest", "erhieltst", "erhieltet", "erhaltest" ];

// These are all other passive auxiliaries.
var otherAuxiliaries = [ "werde", "wirst", "wird", "werden", "werdet", "wurde", "ward", "wurdest", "wardst", "wurden", "wurdet",
	"worden", "werdest", "würde", "würdest", "würden", "würdet", "bekomme", "bekommen", "bekam", "bekamen", "bekäme", "bekämen",
	"kriege", "kriegst", "kriegt", "kriegen", "kriegte", "kriegtest", "kriegten", "kriegtet", "kriegest", "krieget", "gehöre",
	"gehören", "gehörte", "gehörten", "erhalte", "erhalten", "erhielten", "erhielte" ];

/**
 * Returns lists with auxiliaries.
 * @returns {Array} The lists with auxiliaries.
 */
module.exports = function() {
	return {
		participleLike: participleLike,
		otherAuxiliaries: otherAuxiliaries,
		allAuxiliaries: participleLike.concat( otherAuxiliaries ),
	};
};
