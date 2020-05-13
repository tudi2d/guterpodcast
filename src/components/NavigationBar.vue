<template>
  <div
    class="flex sm:flex-row flex-col w-full justify-between items-center z-50"
  >
    <router-link
      class="flex flex-row items-baseline ml-2 sm:ml-4 mt-2 text-3xl font-bold opacity-75 hover:opacity-100"
      to="/"
    >
      <i class="fas fa-podcast mr-2"></i>
      <span>guter podcast</span>
    </router-link>
    <div class="text-base flex flex-row sm:flex-row font-mono text-right">
      <a
        class="mr-3 mt-2 opacity-50 hover:opacity-100"
        target="_blank"
        href="https://github.com/tudi2d/guterpodcast"
        >github.</a
      >
      <router-link
        class="mr-3 sm:mr-6 mt-2 opacity-50 hover:opacity-100"
        :class="{ 'opacity-100': $route.path === '/impressum' }"
        to="/impressum"
        >impressum.</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar"
};
</script>
