// custom component for registering an event handler
export default function onEvent(event, cb) {
	return {
		id: "on",
		add() {
			this.on(event, cb);
		},
	};
}
