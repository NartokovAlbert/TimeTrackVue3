<script setup>
import Header from './components/Header.vue';
import PhotoTable from './components/PhotoTable.vue';
import { usePhotoStore } from './stores/photoStore';
import { watchEffect } from 'vue';

const photoStore = usePhotoStore();

// Автоматический запрос при загрузке страницы
photoStore.fetchPhotos().catch(error => {
  console.error('Ошибка загрузки данных:', error);
});

//Смена темы при изменении темы
watchEffect(() => {
  if (photoStore.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div class="p-6">
    <Header />
    <PhotoTable />
  </div>
</template>
