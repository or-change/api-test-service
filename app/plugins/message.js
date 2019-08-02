export default function install(Vue) {
	Vue.mixin({
		data() {
			return {
				message: {
					state: '',
					content: ''
				}
			};
		},
		methods: {
			resetMessage() {
				this.setMessage('', '');
			},
			setMessage(state, content) {
				this.message.state = state;
				this.message.content = content;
			}
		}
	});
}