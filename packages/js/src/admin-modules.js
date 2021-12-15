import CornerstoneWorkoutCard from "./workouts/components/CornerstoneWorkoutCard";
import OrphanedWorkoutCard from "./workouts/components/OrphanedWorkoutCard";

window.yoast = window.yoast || {};
window.yoast.adminModules = {
	components: {
		workouts: {
			CornerstoneWorkoutCard,
			OrphanedWorkoutCard,
		},
	},
};
