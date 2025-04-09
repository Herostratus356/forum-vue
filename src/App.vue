<template>
	<div class="app-container" >
		<div :class="['content', isDark ? 'dark-theme' : 'light-theme']">
		<header >
			<!-- Навигация -->
			<nav>
				<RouterLink to="/"><h1>Форум</h1></RouterLink>
				<RouterLink to="/new-thread"><p>Создать тему</p></RouterLink>
				<!-- Кнопка для переключения тем -->
				<button @click="toggleTheme" class="theme-btn">
					{{ isDark ? '🌞 Светлая' : '🌙 Тёмная' }}
				</button>
			</nav>
		</header>
		<!-- Основной контент -->
		<main >
			<RouterView />
		</main>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const isDark = ref(false);

// Функция для переключения темы 
const toggleTheme = () => {
	isDark.value = !isDark.value;
	localStorage.setItem('theme', isDark.value ? 'true' : 'false');
	document.documentElement.classList.toggle('dark', isDark.value); // Добавляем класс
};

// При монтировании проверяем сохранённую тему
onMounted(() => {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		isDark.value = savedTheme === 'true';
		document.documentElement.classList.toggle('dark', isDark.value);
	}
});

// Следим за изменением темы
watch(isDark, (newValue) => {
	localStorage.setItem('theme', newValue ? 'true' : 'false');
	document.documentElement.classList.toggle('dark', newValue);
});
</script>

<style lang="scss" scoped>
header {
	background: #222;
	color: white;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	nav {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0.5em 1em;
		display: flex;
		gap: 15px;
		align-items: center;
		h1 {
			font-size: 1.6rem;
			font-weight: bold;
		}
		a {
			color: white;
			text-decoration: none;
			font-size: 1rem;
			padding: 0.5em 0.75em;
			border-radius: 6px;
			transition: background 0.3s ease;
			&:hover {
				background: rgba(255, 255, 255, 0.2);
			}
			&.router-link-active {
				background: #007bff;
				border-radius: 6px;
				padding: 8px 12px;
			}
		}
	}
}

main {
	width: 100%;
	max-width: 1400px;
	min-height: 100vh;
	padding: 20px;
	margin: 0 auto;
}
.theme-btn {
	color: white;
	text-decoration: none;
	font-size: 1rem;
	padding: 0.5em 0.75em;
	border-radius: 6px;
	border-color: #a61313;
	background: #73c521;
	transition: background 0.3s ease;
		&:hover {
			background: rgba(5, 242, 195, 0.2);
	}
}
/* Темные стили */
.dark-theme {
	background: #121212;
}
/* Светлые стили */
.light-theme {
	background: white;
}
</style>
