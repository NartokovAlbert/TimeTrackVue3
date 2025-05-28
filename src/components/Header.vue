<template> 
  <div class="flex gap-4 mb-6 items-center">
    <input
      v-model="albumInput"
      placeholder="Введите ID альбомов через пробел (например, 1 2 3)"
      class="border p-2 rounded flex-1"
      @keyup.enter="searchPhotos"
      title="Введите ID альбомов через пробел и нажмите Enter или кнопку Поиск"
    />
    <button
      @click="searchPhotos"
      :disabled="loading"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
      title="Поиск фотографий по выбранным альбомам"
    >
      {{ loading ? 'Загрузка...' : 'Поиск' }}
    </button>
      <button
      @click="toggleTheme"
      class="ml-4 p-2 rounded border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
      :title="`Переключить тему (текущая: ${theme})`"
    >
      <img src="/free-icon-sun-3682916.png" alt="Theme Icon" class="h-6 w-6" />
    </button>
  </div>
</template> <!-- */разметка инпута*/ -->

<script setup>
import { ref, watch } from 'vue';
import { usePhotoStore } from '../stores/photoStore';

const photoStore = usePhotoStore();
const albumInput = ref(photoStore.albumIds.join(' '));
const loading = ref(photoStore.loading);
const theme = ref(photoStore.theme);

watch(() => photoStore.loading, (newVal) => {
  loading.value = newVal;
});

watch(() => photoStore.theme, (newVal) => {
  theme.value = newVal;
});

function searchPhotos() {
  const ids = albumInput.value
    .split(/\s+/)
    .map(id => parseInt(id))
    .filter(id => !isNaN(id));
  photoStore.setAlbumIds(ids);
  photoStore.fetchPhotos();
} // функция поиска фото по выбранным альбомам

function toggleTheme() {
  const newTheme = theme.value === 'light' ? 'dark' : 'light';
  photoStore.setTheme(newTheme);
}
</script>
