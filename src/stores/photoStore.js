import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const usePhotoStore = defineStore('photos', () => {
  const photos = ref([]);
  const loading = ref(false);
  const albumIds = ref(JSON.parse(localStorage.getItem('albumIds') || '[]'));
  const cache = ref({}); // Кэширование данных
  const limit = ref(30);  // Количество отображаемых записей
  const theme = ref(localStorage.getItem('theme') || 'light');

  async function fetchPhotos() {
    loading.value = true;
    const key = albumIds.value.join(',');

    // Проверка кэша
    if (cache.value[key]) {
      photos.value = cache.value[key];
      loading.value = false;
      return;
    }

    // Формирование URL
    const baseUrl = 'https://jsonplaceholder.typicode.com/photos';
    const params = albumIds.value.length 
      ? `?albumId=${albumIds.value.join('&albumId=')}` 
      : '';

    try {
      const res = await fetch(baseUrl + params);
      const data = await res.json();
      photos.value = data;
      cache.value[key] = data; // Сохранение в кэш
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      loading.value = false;
    }
  }

  function setAlbumIds(ids) {
    albumIds.value = ids;
  }

  function incrementLimit() {
    limit.value += 30;
  }

  function setTheme(newTheme) {
    theme.value = newTheme;
  }

  // отслеживает хранилище
  watch(albumIds, (newVal) => {
    localStorage.setItem('albumIds', JSON.stringify(newVal));
  }, { deep: true });

  watch(theme, (newVal) => {
    localStorage.setItem('theme', newVal);
  });

  return { photos, loading, albumIds, limit, theme, fetchPhotos, setAlbumIds, incrementLimit, setTheme };
});
