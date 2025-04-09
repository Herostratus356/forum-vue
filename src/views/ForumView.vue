<template>
	<div class="forum">

		<!-- Общий блок для пустого состояния -->
		<div v-if="filteredThreads.length === 0" class="forum__empty">
			<h2>
				{{ hasThreadsInOtherCategories ? `Нет тем в категории "${filter}"` : "Нет тем" }}
			</h2>
			<button @click="hasThreadsInOtherCategories ? resetFilter() : goToCreateThread()" class="forum__back-btn">
				{{ hasThreadsInOtherCategories ? "Вернуться назад" : "Создать тему" }}
			</button>
		</div>

		<!-- Блок с тредми, если они есть -->
		<div v-else>
			<div class="forum__controls">
				<select v-model="filter" class="forum__filter">
					<option v-for="category in categories" :key="category" :value="category">{{category}}</option>
				</select>
			</div>
			<TransitionGroup name="fade" tag="ul">
				<li v-for="thread in filteredThreads" :key="thread.id" class="forum__thread">
					<h2 class="forum__title">{{ thread.title }}</h2>
					<img v-if="thread.image" :src="thread.image" alt="Превью	изображения"/>
					<p class="forum__data">Дата создания: {{ formatDate(thread.createData) }}</p>
					<div class="forum__actions">
						<div class="forum__actions-likes-dislikes">
							<p class="forum__likes"> + {{thread.likes}}</p>
							<p class="forum__dislikes"> - {{thread.dislikes}}</p>
						</div>
						<div class="forum__actions-btn">
							<button @click="openThread(thread.id)" class="forum__open-btn">Открыть</button>
							<button @click="deleteThread(thread.id)" class="forum__delete-btn">Удалить</button>
						</div>
					</div>
				</li>
			</TransitionGroup>
		</div>
	</div>
</template>

<script	setup>
import { useForumStore } from '../stores/forum';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useForumStore();
const router = useRouter();
const filter = ref('Все');

const categories = ['Все', 'Общее', 'Технологии', 'Разное'];

const formatDate = (isoString) => new Date(isoString).toLocaleString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
// Фильтрация тредов по категории
const filteredThreads = computed(() => filter.value === 'Все' ? store.threads : store.threads.filter(t => t.category === filter.value)
);
// Проверка на наличие тредов в других категориях
const hasThreadsInOtherCategories = computed(() =>store.threads.some(t => t.category !== filter.value));

// Сброс фильтра
const resetFilter = () => filter.value = 'Все';
// Переход на страницу создания треда
const goToCreateThread = () => router.push('/new-thread');
// Открытие треда
const openThread = (id) => router.push(`/thread/${id}`);
// Удаление треда
const deleteThread = (threadId) => store.deleteThread(threadId);
</script>

<style lang="scss" scoped>
.forum {
	margin: 30px auto;
	padding: 20px;
	background: #ffffff;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

	&__back-btn {
		margin-top: 20px;
		padding: 0.5em 0.75em;
		font-size: 1rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		background-color: #007bff;
		color: #fff;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: #0056b3;
		}
	}

	&__controls {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	&__filter {
		padding: 0.5em 0.75em;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background: #f8f8f8;
		cursor: pointer;
		transition: border-color 0.3s ease;

		&:focus {
			outline: none;
			border-color: #007bff;
		}
	}

	&__data {
		font-size: 0.9rem;
		color: #777;
		margin-bottom: 10px;
	}

	&__empty {
		text-align: center;
		font-size: 1.1rem;
		color: #777;
		margin-top: 20px;
	}

	&__thread {
		padding: 15px;
		margin-bottom: 15px;
		background: #c4dae8c7;
		border-radius: 8px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__title {
		font-size: 1.2rem;
		color: #333;
		margin-bottom: 10px;
	}

	&__content {
		font-size: 1rem;
		color: #555;
		margin-bottom: 10px;
	}

	&__actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__actions-likes-dislikes,
	&__actions-btn {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	&__likes {
		font-size: 0.87rem;
		color: #f5f2f2;
		border: 1px solid #28a745;
		border-radius: 5px;
		background: #28a745;
		padding: 0.4em 0.6em;
	}

	&__dislikes {
		font-size: 0.87rem;
		color: #f5f2f2;
		border: 1px solid #dc3545;
		border-radius: 5px;
		background: #dc3545;
		padding: 0.4em 0.6em;
	}

	&__open-btn {
		padding: 0.4em 0.6em;
		font-size: 0.87rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
		background: #28a745;
		color: white;

		&:hover {
			transform: scale(1.05);
			background: #218838;
		}
	}

	&__delete-btn {
		padding: 0.4em 0.6em;
		font-size: 0.87rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
		background: #dc3545;
		color: white;

		&:hover {
			transform: scale(0.9);
			background: #c82333;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.4s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateX(10px);
		//	transition:	opacity	0.4s	ease,	transform	1s	ease;
	}
}
</style>
