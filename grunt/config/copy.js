module.exports = {
	copy: {
			files: [ {
				expand: true,
				options: {
					noProcess:[ "**/*, png" ]
				},
				src:  "<%= paths.images %>*.png",
				dest: "dist/"
			} ]
	}
};
