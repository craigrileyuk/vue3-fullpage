<template>
	<Vue3Fullpage update-history tag="main" navigation-gap="1rem" @page-enter="onPageEnter" @page-leave="onPageLeave">
		<section style="background-color: black"><h2>One</h2></section>
		<section style="background-color: aqua"><h2>Two</h2></section>
		<section id="who-are-we" style="background-color: seagreen"><h2>Three</h2></section>
		<section style="background-color: rebeccapurple"><h2>Four</h2></section>
		<AsyncPage style="background-color: white" />
	</Vue3Fullpage>
</template>

<script setup>
import { defineAsyncComponent, h } from 'vue';
import { Vue3Fullpage } from '../src';

const AsyncPage = defineAsyncComponent({
	loader: () =>
		new Promise((resolve) =>
			resolve({
				setup() {
					return () => h('section', [h('h2', 'Five')]);
				}
			})
		)
});

const onPageEnter = (index) => {
	console.log('Page ' + index + ' is in the building');
};
const onPageLeave = (index) => {
	console.log('Page ' + index + ' has left the building');
};
</script>

<style>
html,
body,
#app {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

section {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 2em;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
		'Open Sans', 'Helvetica Neue', sans-serif;
}

section h2 {
	mix-blend-mode: difference;
	color: white;
}
</style>
