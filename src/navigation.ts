import { defineComponent, h, computed } from 'vue';
import { startCase } from 'lodash-es';

export default defineComponent({
	props: {
		active: {
			type: Number,
			required: true
		},
		dotClass: {
			type: String,
			default: ''
		},
		dotInnerClass: {
			type: String,
			default: ''
		},
		pages: {
			type: Number,
			default: 0
		},
		pageKeys: {
			type: Array,
			required: true
		},
		disableClasses: {
			type: Boolean,
			default: false
		}
	},
	emit: ['update:active'],
	setup(props, { emit }) {
		const dots = computed(() =>
			Array.from(Array(props.pages)).map((dot, index) => {
				return h(
					'a',
					{
						'aria-label': 'Go to ' + startCase(props.pageKeys[index]),
						class: [
							props.dotClass,
							{
								'vue3-fullpage__navigation-dot': !props.disableClasses,
								'is-active': props.active === index
							}
						],
						onClick: () => emit('update:active', index)
					},
					[
						h('div', {
							class: [
								{ 'vue3-fullpage__navigation-dot-inner': !props.disableClasses },
								props.dotInnerClass
							]
						})
					]
				);
			})
		);
		return () =>
			h(
				'div',
				{
					class: { 'vue3-fullpage__navigation': !props.disableClasses }
				},
				dots.value
			);
	}
});
