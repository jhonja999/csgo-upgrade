# CSGO Upgrade - Plataforma de Upgrade de Skins

Una plataforma moderna y confiable para hacer upgrade de skins de Counter-Strike: Global Offensive, construida con Nuxt.js 3, Vue 3, TypeScript y Tailwind CSS.

## 🎮 Características

### ✅ Implementado
- **Sistema de Upgrade**: Mejora tus skins con probabilidades calculadas
- **Gestión de Inventario**: Visualiza y administra tus items
- **Sistema de Balance**: Manejo seguro de fondos virtuales
- **Interfaz Responsive**: Diseño optimizado para desktop y móvil
- **Animaciones Fluidas**: Experiencia visual atractiva
- **Sistema de Audio**: Efectos de sonido inmersivos
- **Chat Global**: Interacción en tiempo real con otros usuarios
- **Historial de Transacciones**: Seguimiento completo de actividades

### 🔄 Próximamente
- **Apertura de Cases**: Sistema de cajas con items aleatorios
- **Juegos de Casino**: Ruleta, Coinflip, Crash
- **Sistema de Trading**: Intercambio de items entre usuarios
- **Achievements**: Sistema de logros y recompensas
- **Leaderboards**: Clasificaciones de usuarios

## 🛠️ Tecnologías

- **Frontend**: Nuxt.js 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS, SCSS
- **State Management**: Pinia
- **API**: Nitro (SSR), CSGOFloat API
- **Animaciones**: CSS Animations, GSAP
- **Audio**: Web Audio API, Howler.js
- **Build**: Vite, PostCSS

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/csgo-upgrade.git
cd csgo-upgrade
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:
```env
# CSGOFloat API Key (requerida)
CSGOFLOAT_API_KEY=tu_clave_api_aqui

# Configuración de desarrollo
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configuración de APIs
NEXT_PUBLIC_API_PROVIDER=csgofloat
CACHE_DURATION_MINUTES=30
PRICE_UPDATE_INTERVAL_MINUTES=15
API_RATE_LIMIT_REQUESTS_PER_MINUTE=1000
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Utilidades
npm run generate     # Genera sitio estático
npm run postinstall  # Prepara Nuxt después de instalar
```

## 📁 Estructura del Proyecto

```
csgo-upgrade/
├── 📁 assets/              # Assets estáticos (CSS, imágenes, audio)
├── 📁 components/          # Componentes Vue reutilizables
│   ├── 📁 casino/          # Componentes de casino
│   ├── 📁 cases/           # Componentes de cajas
│   ├── 📁 common/          # Componentes comunes (Chat, Balance, etc.)
│   ├── 📁 games/           # Componentes de juegos
│   ├── 📁 inventory/       # Componentes de inventario
│   ├── 📁 layout/          # Componentes de layout
│   ├── 📁 ui/              # Componentes UI base
│   └── 📁 upgrade/         # Componentes de upgrade
├── 📁 composables/         # Composables Vue reutilizables
├── 📁 layouts/             # Layouts de página
├── 📁 middleware/          # Middleware de rutas
├── 📁 pages/               # Páginas de la aplicación
├── 📁 plugins/             # Plugins de Nuxt
├── 📁 public/              # Archivos públicos estáticos
├── 📁 server/              # API routes del servidor
├── 📁 stores/              # Stores de Pinia
├── 📁 types/               # Definiciones de TypeScript
└── 📁 utils/               # Utilidades y helpers
```

## 🎯 Funcionalidades Principales

### Sistema de Upgrade
- Selección de items del inventario
- Cálculo de probabilidades en tiempo real
- Animaciones de upgrade inmersivas
- Resultados provisionalmente justos

### Gestión de Inventario
- Vista en grilla y lista
- Filtros avanzados por rareza, tipo, precio
- Búsqueda en tiempo real
- Acciones rápidas (upgrade, vender, detalles)

### Sistema de Balance
- Manejo seguro de fondos virtuales
- Historial completo de transacciones
- Estadísticas detalladas
- Auto-guardado en localStorage

### Chat Global
- Mensajes en tiempo real
- Notificaciones de victorias
- Moderación automática
- Emojis y reacciones

## 🔧 Configuración Avanzada

### API de CSGOFloat
Para obtener precios reales de items, necesitas una clave API de CSGOFloat:

1. Regístrate en [CSGOFloat](https://csgofloat.com)
2. Obtén tu API key
3. Añádela a tu archivo `.env.local`

### Personalización de Temas
Los colores y estilos se pueden personalizar en:
- `assets/css/main.scss` - Estilos globales
- `utils/constants.ts` - Configuración de temas
- `tailwind.config.js` - Configuración de Tailwind

### Configuración de Audio
Los archivos de audio deben colocarse en `public/audio/`:
- `win.mp3` - Sonido de victoria
- `lose.mp3` - Sonido de derrota
- `click.mp3` - Sonido de click
- `background-music.mp3` - Música de fondo

## 📊 Estado del Proyecto

### Funcionalidades Completadas
- ✅ Sistema de upgrade con probabilidades
- ✅ Gestión completa de inventario
- ✅ Sistema de balance y transacciones
- ✅ Chat global funcional
- ✅ Animaciones y efectos visuales
- ✅ Sistema de audio
- ✅ Interfaz responsive
- ✅ Integración con CSGOFloat API

### En Desarrollo
- 🔄 Sistema de autenticación
- 🔄 Base de datos persistente
- 🔄 Apertura de cases
- 🔄 Juegos adicionales (Ruleta, Coinflip)

### Planificado
- 📋 Sistema de trading
- 📋 Achievements y logros
- 📋 Leaderboards
- 📋 Modo multijugador
- 📋 App móvil

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usa TypeScript para todo el código
- Sigue las convenciones de Vue 3 Composition API
- Mantén componentes pequeños y reutilizables
- Documenta funciones complejas
- Escribe tests para nuevas funcionalidades

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ⚠️ Disclaimer

Esta aplicación es solo para fines educativos y de demostración. No está destinada para apuestas reales con dinero. El uso de esta aplicación es bajo tu propia responsabilidad.

## 📞 Soporte

Si tienes problemas o preguntas:
- 📧 Email: support@csgo-upgrade.com
- 💬 Discord: [Únete a nuestro servidor](https://discord.gg/csgo-upgrade)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/csgo-upgrade/issues)

## 🙏 Agradecimientos

- [CSGOFloat](https://csgofloat.com) por la API de precios
- [Nuxt.js](https://nuxt.com) por el framework
- [Tailwind CSS](https://tailwindcss.com) por los estilos
- [Vue.js](https://vuejs.org) por el framework frontend

---

**Desarrollado con ❤️ para la comunidad de CS:GO**