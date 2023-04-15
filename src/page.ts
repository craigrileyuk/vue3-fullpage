import { defineComponent, h, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

export default defineComponent({
	emit: ['update:active'],
	props: {
		active: {
			type: Number,
			default: null
		},
		id: {
			type: String,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		updateHistory: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { slots, emit }) {
		const pageRef = ref(null);
		const isActive = ref(false);
		useIntersectionObserver(pageRef, ([{ isIntersecting }]) => {
			isActive.value = isIntersecting;
			if (isIntersecting) {
				emit('update:active', props.index);
				if (props.updateHistory) window.history.replaceState({}, '', `#${props.id}`);
			}
		});
		return () =>
			h(slots.default()[0], {
				id: props.id,
				ref: pageRef,
				class: {
					'is-active': isActive.value
				}
			});
	}
});
