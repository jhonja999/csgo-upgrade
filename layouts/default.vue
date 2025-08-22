<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Chat Component -->
    <Chat />
    
    <!-- Win Popup -->
    <WinPopup />
    
    <!-- Audio Player -->
    <AudioPlayer />
  </div>
</template>

<script setup lang="ts">
// Layout para toda la aplicación
</script>

<style scoped>
/* Estilos específicos del layout */
</style>