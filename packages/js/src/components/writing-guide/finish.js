import { Title } from "@yoast/ui-library";
import { ClipboardCheckIcon } from "@heroicons/react/outline";

const Finish = () => {
	return (
		<div className="yst-mt-16 yst-text-center">
			<img src="https://yoast.com/app/uploads/2020/03/iets_terugdoen_bubble.png" className="yst-mb-4 yst-w-32 yst-inline-block" />
			<Title className="yst-mb-4 yst-text-2xl">Great work!</Title>
			<p className="yst-text-lg">You’ve entered all the information we need. Start writing!</p>
		</div>
	);
};

export default Finish;
