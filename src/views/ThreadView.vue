<template>
	<div v-if="thread" class="thread">
		<!-- Заголовок и контент треда -->
		<h1>{{ thread.title }}</h1>
		<img :src="thread.image" class="thread-img" />

		<!-- Контент треда -->
		<div class="thread-content" v-html="thread.content"></div>

		<!-- Кнопки реакций -->
		<button @click="store.likeThread(thread.id)" class="thread__like-btn">
			👍 {{ thread.likes }}
		</button>
		<button @click="store.dislikeThread(thread.id)" class="thread__dislike-btn">
			👎 {{ thread.dislikes }}
		</button>

		<!-- Комментарии -->
		<h2>Комментарии:</h2>
		<div v-for="comment in thread.comments" :key="comment.id" class="comment">
			{{ comment.text }}
		</div>

		<!-- Форма добавления комментария -->
		<div class="comment-form">
			<input
				v-model="newComment"
				placeholder="Написать комментарий"
				class="comment-input"
			/>
			<button @click="addComment" class="comment-button">Добавить</button>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useForumStore } from "../stores/forum";

const store = useForumStore();
const route = useRoute();

//Поиск конкретного треда (темы/обсуждения) в массиве threads из хранилища
const thread = store.threads.find((t) => t.id == route.params.id);

// Форма добавления комментария
const newComment = ref("");
// Добавление комментария
const addComment = () => {
	store.addComment(thread.id, newComment.value);
	newComment.value = "";
};
</script>

<style lang="scss" scoped>
.thread {
	padding: 20px;
	margin-bottom: 30px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	.thread-img {
		margin-bottom: 20px;
	}

	.thread-content {
		font-size: 16px;
		line-height: 1.5;
		color: #555;
		margin-bottom: 25px;

		img {
			max-width: 100%;
			height: auto;
			margin: 10px 0;
			display: block;
			border-radius: 5px;
		}
	}

	&__like-btn,
	&__dislike-btn {
		margin-bottom: 20px;
		padding: 10px 15px;
		font-size: 0.9rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;

		&:hover {
			transform: scale(1.05);
		}
	}

	&__like-btn {
		margin-right: 10px;
		background: #ffcc00;
		color: #333;

		&:hover {
			background: #e6b800;
		}
	}

	&__dislike-btn {
		background: #dc3545;
		color: white;

		&:hover {
			background: #c82333;
		}
	}

	h2 {
		font-size: 1.1rem;
		margin-bottom: 15px;
		color: #333;
	}

	.comment {
		margin-bottom: 15px;
		padding: 15px;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		background-color: #f9f9f9;
		font-size: 1.1rem;
		color: #555;
	}

	.comment-form {
		display: flex;
		gap: 15px;
		margin-top: 25px;

		.comment-input {
			flex: 1;
			padding: 10px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			font-size: 0.9rem;
			outline: none;

			&:focus {
				border-color: #3498db;
			}
		}

		.comment-button {
			padding: 10px 15px;
			background-color: #3498db;
			color: #fff;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			font-size: 0.85rem;
			transition: background-color 0.3s ease;

			&:hover {
				background-color: #3498db, 10%;
			}
		}
	}
}
</style>
