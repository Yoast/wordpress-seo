import React from "react";

// Exported from redux-devtools
import { createDevTools } from "redux-devtools";

// Monitors are separate packages, and you can make a custom one
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";

// CreateDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
	/**
	 * Monitors are individually adjustable with props.
	 * Consult their repositories to learn about those props.
	 * Here, we put LogMonitor inside a DockMonitor.
	 * Note: DockMonitor is visible by default.
	 */
	<DockMonitor
		toggleVisibilityKey="ctrl-h"
		changePositionKey="ctrl-q"
		defaultIsVisible={ false }
	>
		<LogMonitor theme="tomorrow" />
	</DockMonitor>
);

export default DevTools;
