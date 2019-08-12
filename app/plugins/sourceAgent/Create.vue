<template>
	<div id="upload-file" class="ms-p-2">
		<form ref="uploadFile" name="uploadFile" v-show="canUpload">
			<input type="file" ref="file" @change="tips" />
		</form>
		<div id="like-file-upload">
			<f-button
				text="选择上传文件"
				variant="primary"
				:disabled="!canUpload"
			/>
			<f-label class="ms-d-inline-block ms-ml-2 ms-textTruncate">{{ fileMessage }}</f-label>
		</div>
		<div class="ms-mt-3" v-if="state !== -1">
			<f-progress
				title="文件上传进度："
				:data="progress"
				v-show="state === 0"
			/>
			<div v-if="message" :class="['ms-center', message.variant]">
				<i :class="message.class" style="font-size: 16px"></i>
				<f-label>{{ message.info }}</f-label>
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
			progress: {
				value: 0,
				variant: 'success'
			}
		}
	},
	computed: {
		message() {
			const mapping = {
				'1': {
					class: 'ms-Icon ms-Icon--LocationCircle',
					variant: 'default',
					info: '文件解压中'
				},
				'2': {
					class: 'ms-Icon ms-Icon--CompletedSolid',
					variant: 'success',
					info: '上传成功'
				},
				'3': {
					class: 'ms-Icon ms-Icon--ErrorBadge',
					variant: 'fail',
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
					console.log(progressEvent.loaded, progressEvent.total, 100);

					// this.progress = progressEvent.loaded / progressEvent.total * 100;

					// if (this.progress === 100) {
					// 	this.state = 1;
					// }
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

		label {
			height: 26px;
			width: 170px;
		}
	}

	input[type="file"] {
		z-index: 200;
	}

	.default {
		opacity: .5;
	}
}
</style>
