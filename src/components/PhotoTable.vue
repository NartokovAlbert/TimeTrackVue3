<template>
  <div class="overflow-y-auto overflow-x-hidden max-h-[600px] max-w-[600px] mx-auto relative">
    <table class="min-w-full border-collapse">
      <thead class="sticky top-0 bg-gray-100 z-10">
        <tr>
          <th 
            v-for="(col, index) in columns" 
            :key="index" 
            @click="sortData(col.key)"
            class="cursor-pointer p-2 border-b select-none relative"
            :title="`Сортировать по ${col.label}`"
          >
            <div class="flex items-center justify-center space-x-1">
              <span>{{ col.label }}</span>
              <svg v-if="sortBy === col.key" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="sortDirection === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="photo in displayedPhotos" :key="photo.id" class="hover:bg-gray-50">
          <td 
            v-for="(col, index) in columns" 
            :key="index" 
            class="p-2 border-b truncate max-w-[150px]" 
            :title="photo[col.key]"
          >
            {{ photo[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
      <div class="animate-pulse space-y-2 w-full max-w-[600px] p-4">
        <div v-for="n in 10" :key="n" class="h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePhotoStore } from '../stores/photoStore';

const photoStore = usePhotoStore();
const sortBy = ref(null);
const sortDirection = ref('asc');
const loading = ref(photoStore.loading);

watch(() => photoStore.loading, (newVal) => {
  loading.value = newVal;
});

const columns = [
  { key: 'id', label: 'Ид' },
  { key: 'albumId', label: 'Альбом' },
  { key: 'title', label: 'Название' },
  { key: 'url', label: 'Ссылка' },
  { key: 'thumbnailUrl', label: 'Миниатюра' }
];

// Сортировка данных
function sortData(key) {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDirection.value = 'asc';
  }
}

// Отображение данных с учетом сортировки и пагинации
const displayedPhotos = computed(() => {
  let data = [...photoStore.photos];
  
  // Сортировка
  if (sortBy.value) {
    data.sort((a, b) => {
      const aValue = a[sortBy.value];
      const bValue = b[sortBy.value];
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Пагинация
  return data.slice(0, photoStore.limit);
});

// Подгрузка данных при прокрутке
onMounted(() => {
  const container = document.querySelector('.max-h-\\[600px\\]');
  container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      photoStore.incrementLimit();
    }
  });
});
</script>

