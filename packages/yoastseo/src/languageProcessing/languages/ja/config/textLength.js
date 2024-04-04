export default {
	defaultAnalysis: {
		recommendedMinimum: 600,
		slightlyBelowMinimum: 500,
		belowMinimum: 400,
		veryFarBelowMinimum: 200,
	},
	defaultCornerstone: {
		recommendedMinimum: 1800,
		slightlyBelowMinimum: 800,
		belowMinimum: 600,
		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},
	},
	taxonomyAssessor: {
		recommendedMinimum: 60,
		slightlyBelowMinimum: 20,
		veryFarBelowMinimum: 1,
	},
	productSEOAssessor: {
		recommendedMinimum: 400,
		slightlyBelowMinimum: 300,
		belowMinimum: 200,
		veryFarBelowMinimum: 100,
	},
	productCornerstoneSEOAssessor: {
		recommendedMinimum: 800,
		slightlyBelowMinimum: 600,
		belowMinimum: 400,
		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},
	},
	collectionSEOAssessor: {
		recommendedMinimum: 60,
		slightlyBelowMinimum: 20,
		veryFarBelowMinimum: 1,
	},
	collectionCornerstoneSEOAssessor: {
		recommendedMinimum: 60,
		slightlyBelowMinimum: 20,
		veryFarBelowMinimum: 1,
	},
};
