import { defineStore } from 'pinia';

export const useForumStore = defineStore('forum', {
	state: () => ({
		// Массив тредов 
		threads: JSON.parse(localStorage.getItem('threads')) || [],
	}),

	getters: {
		// Поиск конкретного треда  в массиве threads
		getThreadById: (state) => (id) => state.threads.find((t) => t.id === id),
	},

	actions: {
		// Добавление треда
		addThread(threadData) {
			const newThread = {
				id: Date.now(),
				...threadData,
				image: threadData.image,
				likes: 0,
				dislikes: 0,
				comments: [],
				createData: new Date().toISOString(),
			};
			this.threads.push(newThread);
			this.saveToLocalStorage();
		},

		// Удаление треда
		deleteThread(threadId) {
			this.threads = this.threads.filter((t) => t.id !== threadId);
			this.saveToLocalStorage();
		},

		// Добавление комментария
		addComment(threadId, comment) {
			const thread = this.threads.find((t) => t.id === threadId);
			if (thread) {
				thread.comments.push({
					id: Date.now(),
					text: comment,
					createData: new Date().toISOString(),
				});
				this.saveToLocalStorage();
			}
		},

		// Лайк треда
		likeThread(threadId) {
			const thread = this.threads.find((t) => t.id === threadId);
			if (thread) {
				thread.likes++;
				this.saveToLocalStorage();
			}
		},

		// Дизлайк треда
		dislikeThread(threadId) {
			const thread = this.threads.find((t) => t.id === threadId);
			if (thread) {
				thread.dislikes++;
				this.saveToLocalStorage();
			}
		},

		// Сохранение данных в localStorage
		saveToLocalStorage() {
			localStorage.setItem('threads', JSON.stringify(this.threads));
		},
	},
});

