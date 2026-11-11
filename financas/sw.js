// Mantém a página de entrada do Controle Gastos PRO instalável como app.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => { if (e.request.method === 'GET' && new URL(e.request.url).origin === location.origin) e.respondWith(fetch(e.request)); });
