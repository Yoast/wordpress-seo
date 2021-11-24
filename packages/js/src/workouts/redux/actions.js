export const REGISTER_WORKOUT = "REGISTER_WORKOUT";
export const FINISH_STEPS = "FINISH_STEPS";
export const REVISE_STEP = "REVISE_STEP";
export const TOGGLE_WORKOUT = "TOGGLE_WORKOUT";
export const SET_WORKOUTS = "SET_WORKOUTS";
export const OPEN_WORKOUT = "OPEN_WORKOUT";
export const CLEAR_ACTIVE_WORKOUT = "CLEAR_ACTIVE_WORKOUT";
export const TOGGLE_STEP = "TOGGLE_STEP";
export const MOVE_INDEXABLES = "MOVE_INDEXABLES";
export const CLEAR_INDEXABLES = "CLEAR_INDEXABLES";
export const CLEAR_INDEXABLES_IN_STEPS = "CLEAR_INDEXABLES_IN_STEPS";

/**
 * An action creator for registering a workout.
 *
 * @param {string} key      The identifier key for this workout.
 * @param {number} priority The priority for the card belonging to this workout.
 *
 * @returns {Object} The REGISTER_WORKOUT action.
 */
export const registerWorkout = ( key, priority ) => {
	return { type: REGISTER_WORKOUT, payload: { key, priority } };
};

/**
 * An action creator for finishing a workout step.
 *
 * @param {String} workout The workout key.
 * @param {array} steps The step key.
 *
 * @returns {object} The action object.
 */
export const finishSteps = ( workout, steps ) => {
	return { type: FINISH_STEPS, workout, steps };
};

/**
 * An action creator for revising a finished workout step.
 *
 * @param {String} workout The workout key.
 * @param {string} step The step key.
 *
 * @returns {object} The action object.
 */
export const reviseStep = ( workout, step ) => {
	return { type: REVISE_STEP, workout, step };
};

/**
 * An action creator for toggling an entire workout.
 *
 * @param {String} workout The workout key.
 *
 * @returns {object} The action object.
 */
export const toggleWorkout = ( workout ) => {
	return { type: TOGGLE_WORKOUT, workout };
};

/**
 * An action creator to initialize the workouts.
 *
 * @param {object} workouts the workouts.
 *
 * @returns {object} The action object.
 */
export const initWorkouts = ( workouts ) => {
	return { type: SET_WORKOUTS, workouts };
};

/**
 * An action creator for opening a workout.
 *
 * @param {String} workout The workout key.
 *
 * @returns {object} The action object.
 */
export const openWorkout = ( workout ) => {
	window.location.hash = workout;
	return { type: OPEN_WORKOUT, workout };
};

/**
 * An action creator for clearing the active workout.
 *
 * @returns {object} The action object.
 */
export const clearActiveWorkout = () => {
	window.location.hash = "";
	return { type: CLEAR_ACTIVE_WORKOUT };
};

/**
 * Toggles a workout step for a workout.
 *
 * @param {string} workout The workout for which to toggle the step.
 * @param {string} step The name of the step.
 *
 * @returns {object} The action that toggles the step.
 */
export const toggleStep = ( workout, step ) => {
	return { type: TOGGLE_STEP, workout, step };
};

/**
 * Saves an indexable for a workout.
 * This allows a workout to remember indexables that are being worked on.
 *
 * @param {string} workout The workout for which to toggle the step.
 * @param {object[]} indexables The indexables.
 * @param {string} fromStep The step from which to move the indexables.
 * @param {string} toStep The step to which to move the indexables.
 *
 * @returns {object} The action that moves the indexables.
 */
export const moveIndexables = ( workout, indexables, fromStep, toStep ) => {
	return { type: MOVE_INDEXABLES, workout, indexables, fromStep, toStep };
};

/**
 * Clears the indexables as stored for a workout.
 *
 * @param {string} workout The workout for which to toggle the step.
 *
 * @returns {object} The action that clears the indexables.
 */
export const clearIndexables = ( workout ) => {
	return { type: CLEAR_INDEXABLES, workout };
};

/**
 * Clears the indexables in specific steps as stored for a workout.
 *
 * @param {string}   workout The workout for which to toggle the step.
 * @param {string[]} steps   The steps to clear.
 *
 * @returns {object} The action that clears the indexables in specific steps.
 */
export const clearIndexablesInSteps = ( workout, steps ) => {
	return { type: CLEAR_INDEXABLES_IN_STEPS, workout, steps };
};
