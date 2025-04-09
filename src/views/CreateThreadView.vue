<template>
	<div class="container">
		<h1>Создать тему</h1>

		<!-- Форма добавления треда -->
		<div v-for="(value, field) in form" :key="field" class="form-group">
			<p v-if="errors[field]" class="error-message">{{ errors[field] }}</p>

			<!-- Выбор категории -->
			<div v-if="field === 'category'">
				<select v-model="form[field]" :class="{ error: errors[field] }">
					<option disabled value="">Выберите категорию</option>
					<option>Общее</option>
					<option>Технологии</option>
					<option>Разное</option>
					</select>
			</div>

			<!-- Редактор -->
			<div v-else-if="field === 'content'">
					<TextEditor v-model="form[field]" />
			</div>

			<!-- Остальные поля -->
			<div v-else>
				<input v-model="form[field]" :placeholder="placeholders[field]" :class="{ error: errors[field] }" />
			</div>
		</div>

		<!-- Кнопка -->
		<button @click="createThread">Опубликовать</button>
	</div>
</template>

<script setup>
import TextEditor from '../components/TextEditor.vue';
import { ref } from 'vue';
import { useForumStore } from '../stores/forum';
import { useRouter } from 'vue-router';

// Хранилище тредов
const store = useForumStore();
// Маршрутизатор
const router = useRouter();

// Данные формы
const form = ref({
	title: '',
	content: '',
	category: '',
});

// Плейсхолдеры
const placeholders = {
	title: 'Заголовок',
	content: 'Текст',
};

// Ошибки
const errors = ref({});
// Файл изображения
const imageFile = ref(null);

// Проверка формы на ошибки и валидацию
const validateForm = () => {
	errors.value = {};
	for (const field in form.value) {
		// Проверка на пустое поле
		if (!form.value[field].trim()) {
			errors.value[field] = `Введите ${placeholders[field] || 'значение'}`;
		}
	}
	return Object.keys(errors.value).length === 0;
};

// Создание темы и переход на главную страницу после создания треда
const createThread =  () => {
	if (!validateForm()) return;
// Добавление треда
	store.addThread({
		...form.value,
		image: imageFile.value || null,
	});
// Переход на главную страницу
	router.push('/')
};
</script>

<style lang="scss" scoped>
.container {
	max-width: 1350px;
	margin: 30px auto;
	padding: 20px;
	background: #ffffff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
	margin-bottom: 20px;
	font-size: 24px;
	color: #333;
	text-align: center;
}

.form-group {
	display: flex;
	flex-direction: column;
	margin-bottom: 15px;
}

.error-message {
	color: red;
	font-size: 14px;
	margin-bottom: 5px;
}

.error {
	border: 2px solid red !important;
	background: #ffe6e6;
}

input,
textarea,
select {
	width: 99.5%;
	height: 3em;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 16px;
	padding: 5px;

	&:focus {
		outline: none;
		border-color: #66afe9;
		box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
	}
}

textarea {
	min-height: 120px;
	resize: vertical;
}

button {
	width: 100%;
	padding: 12px;
	background-color: #007bff;
	border: none;
	border-radius: 4px;
	color: #fff;
	font-size: 18px;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #0056b3;
	}
}
</style>