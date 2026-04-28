/**
 * Gets the position of the notification that is triggered inside a modal. Breaks out of the modal and is positioned at the bottom left of the screen.
 *
 * @param {number} panelHeight The height of the modal panel.
 *
 * @returns {Object} The CSS value for the bottom position of the notification.
 */
export const getModalNotificationPosition = ( panelHeight ) => {
	// The 32px is distance from the bottom of the screen for notifications. As done in the ui-library when the notification in not inside a modal.
	return { bottom: `calc( (${ panelHeight + "px" } - 100vh) / 2 + 32px )` };
};
