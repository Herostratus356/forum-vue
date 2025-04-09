<template>
	<div>
		<div class="editor">
			<!-- Выбор размера -->
			<select v-model="selectedSize" @change="applyStyle('fontSize', selectedSize + 'px')">
				<option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
			</select>
			<!-- Форматирование -->
			<button @click="toggleStyle('strong')" title="Жирный" >B</button>
			<button @click="toggleStyle('i')" title="Курсив">I</button>
			<button @click="toggleStyle('u')" title="Подчёркнутый">U</button>
			<!-- Цвет текста -->
			<input 
				type="color" 
				v-model="colorText"
				@input="applyStyle('color', colorText)" 
				title="Выбрать цвет" 
			/>
			<!-- Вставка изображения -->
			<button @click="uploadImage">🖼 Вставить изображение</button>
			<input 
				ref="fileInput"
				type="file" 
				@change="handleFileUpload" 
				accept="image/*" 
				hidden
			/>
		</div>
			<!-- Контент-редактор -->
		<p
			ref="editor" 
			class="editable" 
			contenteditable="true"
			@input="updateValue"
		>
		</p>
	</div>
</template>

<script setup>
import {  ref, watch} from 'vue';

const colorText = ref('#000000');
const editor = ref(null);
const fileInput = ref(null);

const selectedSize = ref(16);
const sizes = [16, 24, 32];

// Функция получения информации о выделении
const getSelectionInfo = () => {
	// 1. Получаем текущее выделение через Selection API
	const selection = window.getSelection();
	 // 2. Проверяем наличие действительного выделения:
	// - rangeCount: есть ли вообще какие-либо диапазоны
	// - isCollapsed: не является ли выделение "пустым" (как курсор без выбора)
	if (!selection.rangeCount || selection.isCollapsed) return null;
	// 3. Получаем первый (основной) диапазон выделения
	const range = selection.getRangeAt(0);
	// 4. Находим родительский элемент:
  // - commonAncestorContainer: ближайший общий родитель всего выделения
  // - parentElement: получаем именно элемент (не текстовый узел)
	const parentEl = range.commonAncestorContainer.parentElement;
	 // 5. Возвращаем собранные данные в виде объекта
	return { selection, range, parentEl };
};

// Следим за изменением выделения
document.addEventListener('selectionchange', () => {
	const selectionInfo = getSelectionInfo();
	if (!selectionInfo) return;

	const { selection, range, parentEl } = selectionInfo;
	// Если выделение не содержит <span>, то устанавливаем размер по умолчанию
	if (parentEl?.tagName === 'SPAN' && parentEl.style.fontSize) {
		selectedSize.value = parseInt(parentEl.style.fontSize);
	} else {
		selectedSize.value = 16;
	}
})
const applyStyle = (property, value) => {
	const selectionInfo = getSelectionInfo();
  if (!selectionInfo) return;

	const { selection, range, parentEl } = selectionInfo;
	// 1. Если уже есть <span> с таким стилем, удаляем его
	if (parentEl?.tagName === 'SPAN' && parentEl.style[property] === value) {
		// Создаем текстовый узел
		const textNode = document.createTextNode(parentEl.textContent);
		// Помещаем текст вместо <span>
		parentEl.replaceWith(textNode);
		return;
	}
	// 2. Создаем новый <span> только если стиль отличается
	const span = document.createElement('span');
	span.style[property] = value;
	// 3.Помещаем выделение внутрь <span>
	const content = range.extractContents();
	span.append(content);
	range.insertNode(span);
	// 4. Сбрасываем выделение и обновляем значение
	selection.empty();
	updateValue();
};


// Форматирование (жирный, курсив, подчёркнутый)
const toggleStyle = (tagName) => {
	const selectionInfo = getSelectionInfo();
	if (!selectionInfo) return;

	const { selection, range, parentEl } = selectionInfo;
// Если родительский элемент с таким тегом, удаляем его и вставляем содержимое вместо него, иначе создаем новый
	if (parentEl?.tagName === tagName.toUpperCase()) {
		parentEl.replaceWith(...parentEl.childNodes);
	} else {
		const newTag = document.createElement(tagName);
		newTag.append(range.extractContents());
		range.insertNode(newTag);
		mergeTags(newTag);
	}
	selection.empty();
	updateValue();
};

// Обработка вставки изображения
const uploadImage = () => fileInput.value.click();

// Обработка загрузки изображения
const handleFileUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = () => insertImage(reader.result);
		reader.readAsDataURL(file);
	}
};

// Вставка изображения
const insertImage = (src) => {
	const selection = window.getSelection();
	if (!selection.rangeCount) return;
	const range = selection.getRangeAt(0);

	const img = document.createElement('img');
	img.src = src;
	img.style.maxWidth = '80%';
	img.style.height = 'auto';
	img.style.objectFit = 'contain';
	img.style.display = 'block';
	img.style.margin = '0 auto';

	range.deleteContents();
	range.insertNode(img);
	selection.removeAllRanges(
		
	);
	updateValue();
};

const props = defineProps({ modelValue: String });
const emit = defineEmits(['update:modelValue']);

// Следим за modelValue и обновляем контент редактора
watch(() => props.modelValue, (newValue) => {
	if (editor.value && editor.value.innerHTML !== newValue) {
			editor.value.innerHTML = newValue;
	}
}, { immediate: true });


// Обновление значения редактора
const updateValue = () => {
	const content = editor.value.innerHTML;
	emit('update:modelValue', content);
};

</script>

<style lang="scss" scoped>
.editor {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 10px;
	max-width: 100%;
	select {
		font-size: 1rem;
		padding: 5px 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		option {
			font-size: 1rem;
			background: white;
			color: black;
		}
	}
	button {
		padding: 5px 10px;
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
}
.editable {
	min-height: 200px;
	border: 1px solid #ccc;
	padding: 10px;
	border-radius: 5px;
	background: white;
	overflow-y: auto;
	outline: none;
	position: relative;
}
.editable img {
	max-width: 100%;
	height: auto;
	margin: 10px 0;
	border-radius: 5px;
}
</style>