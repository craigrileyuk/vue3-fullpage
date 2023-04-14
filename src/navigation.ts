import { defineComponent, h, computed } from 'vue';

export default defineComponent({
	props: {
		active: {
			type: Number,
			required: true
		},
		pages: {
			type: Number,
			default: 0
		}
	},
	emit: ['update:active'],
	setup(props, { emit }) {
		const dots = computed(() =>
			Array.from(Array(props.pages)).map((dot, index) => {
				return h(
					'a',
					{
						ariaLabel: 'Go to section ' + (index + 1),
						class: [
							'vue3-fullpage__navigation-dot',
							{
								'is-active': props.active === index
							}
						],
						onClick: () => emit('update:active', index)
					},
					[
						h('div', {
							class: 'vue3-fullpage__navigation-dot-inner'
						})
					]
				);
			})
		);
		return () =>
			h(
				'div',
				{
					class: 'vue3-fullpage__navigation'
				},
				dots.value
			);
	}
});
