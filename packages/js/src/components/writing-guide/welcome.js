import { Title } from "@yoast/ui-library";
import { ClipboardCheckIcon } from "@heroicons/react/outline";

const Welcome = () => (
	<div>
		<ClipboardCheckIcon />
		<Title>Welcome!</Title>
		<p>Welcome to the Yoast writing guide. We'll help you setup the best starting point for your post.</p>
	</div>
);

export default Welcome;
