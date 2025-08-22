<template>
  <footer class="bg-gray-800 border-t border-gray-700 mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo y descripción -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">CS</span>
            </div>
            <span class="text-xl font-bold text-white">CSGO Upgrade</span>
          </div>
          <p class="text-gray-400 text-sm mb-4">
            La plataforma más confiable para hacer upgrade de tus skins de Counter-Strike. 
            Probabilidades justas, pagos instantáneos y soporte 24/7.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Plataforma</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/upgrade" class="text-gray-400 hover:text-white transition-colors text-sm">Upgrade</NuxtLink></li>
            <li><span class="text-gray-500 text-sm cursor-not-allowed">Cases (Próximamente)</span></li>
            <li><span class="text-gray-500 text-sm cursor-not-allowed">Roulette (Próximamente)</span></li>
            <li><span class="text-gray-500 text-sm cursor-not-allowed">Casino (Próximamente)</span></li>
          </ul>
        </div>

        <!-- Soporte -->
        <div>
          <h3 class="text-white font-semibold mb-4">Soporte</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Términos de Servicio</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Política de Privacidad</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Contacto</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 CSGO Upgrade. Todos los derechos reservados.
          </p>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <span class="text-gray-400 text-sm">Powered by CSGOFloat API</span>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-green-400 text-sm">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>