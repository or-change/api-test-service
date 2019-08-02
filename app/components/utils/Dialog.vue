<template>
	<f-modal
		:id="id"
		type="dialog"
		v-model="show" 
		:title="title"
		:size="size"
		center
		@input="$emit('input', show)"
	>
		<div
			slot="ms-modal-body"
			class="ms-modal-body"
		>
			<slot></slot>
		</div>

		<div
			slot="ms-modal-footer"
			class="ms-modal-footer">
			<div class="ms-modal-action">
				<f-button 
					theme="primary"
					:text="okText"
					@click.native="ok" />
				<f-button
					:text="cancelText"
					@click.native="cancel" />
			</div>
		</div>
	</f-modal>
</template>

<script>
export default {
	data() {
		return {
			show: false
		}
	},
	props: {
		id: {
			type: String
		},
		title: {
			type: String
		},
		size: {
			type: String,
			default: 'md'
		},
		okText: {
			type: String,
			default: '保存'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		value: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		ok() {
			this.$emit('ok');
		},
		cancel() {
			this.$emit('cancel');

			this.$emit('input', false);
		}
	},
	watch: {
		value() {
			this.show = this.value;
		}
	},
	mounted() {
		this.show = this.value;
	}
}
</script>

