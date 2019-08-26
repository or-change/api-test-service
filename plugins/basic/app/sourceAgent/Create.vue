<template>
	<div id="upload-file">
		<form ref="uploadFile" name="uploadFile" v-show="canUpload">
			<input type="file" ref="file" @change="tips" />
		</form>
		<div id="like-file-upload">
			<b-button
				variant="primary"
				:disabled="!canUpload" size="sm"
			>选择上传文件</b-button>
			<label class="d-inline-block ml-2 mb-0 text-truncate align-middle">{{ fileMessage }}</label>
		</div>
		<div class="mt-3" v-if="state !== -1">
			<b-progress
				title="文件上传进度：" variant="success" height="2px"
				:value="progress"
				v-show="state === 0"
			/>
			<div v-if="message" :class="['text-center', message.variant]">
				<i :class="message.class" style="font-size: 16px"></i>
				<label>{{ message.info }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'create-source-config',
	data() {
		return {
			fileMessage: '未选择任何文件',
			state: -1,
			progress: 0
		}
	},
	computed: {
		message() {
			const mapping = {
				'1': {
					class: 'fas fa-question-circle',
					variant: 'text-default',
					info: '文件解压中'
				},
				'2': {
					class: 'fas fa-check-circle',
					variant: 'text-success',
					info: '上传成功'
				},
				'3': {
					class: 'fas fa-exclamation-circle',
					variant: 'text-fail',
					info: '上传失败'
				}
			};

			return mapping[`${this.state}`];
		},
		canUpload() {
			return this.state === -1 || this.state === 3;
		}
	},
	methods: {
		submit(sourceId) {
			const formData = new FormData();

			formData.append('source', this.$refs.file.files[0]);

			this.state = 0;

			return axios.post(`/api/plugin/com.oc.basic/source/${sourceId}/agent`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				onUploadProgress(progressEvent) {
					// console.log(progressEvent.loaded, progressEvent.total, 100);

					this.progress = progressEvent.loaded / progressEvent.total * 100;

					if (this.progress === 100) {
						this.state = 1;
					}
				}
			}).then(() => {
				this.state = 2;

				this.$emit('success');
			}).catch(() => {
				this.state = 3;

				this.$emit('fail');
			});
		},
		tips(file) {
			if (this.$refs.file && this.$refs.file.files[0]) {
				this.fileMessage = this.$refs.file.files[0].name;
			}
		}
	}
}
</script>

<style lang="scss">
#upload-file {
	position: relative;

	input[type="file"], .like-file-upload {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
	}

	#like-file-upload {
		z-index: -1;
	}

	input[type="file"] {
		z-index: 200;
	}

	.default {
		opacity: .5;
	}
}
</style>
