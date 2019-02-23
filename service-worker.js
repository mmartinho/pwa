let cacheName = 'notes-son-v.1.0.0';
let filesToCache = [
    './',
    'index.html',
    'css/colors.css',
    'css/styles.css',
    'js/array.observe.polyfill.js',
    'js/object.observe.polyfill.js',
    'js/scripts.js'
];

/**
 * Evento que define quais os arquivos da app
 * disponiveis offline
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installer');
    e.waitUntil(
        caches.open(cacheName)
            .then(function(cache){
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

/**
 * Evento que exclui caches diferentes do declarado. Dessa forma,
 * alterando-se a versao do nome do cache, os "antigos" serão excluídos.
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if(key !== cacheName){
                        console.log('[ServiceWorker] Removing old cache');
                        return caches.delete(key);
                    }
                }));
            })
    );
});

/**
 * Evento que interrompe a request/response convencional
 * do browser, respondendo o que foi armazenado no cache
 */
self.addEventListener('fetch', function (e) {
   console.log('[ServiceWorker] Fetch', e.request.url);
   e.respondWith(
       caches
           .match(e.request)
           .then(function (response) {
                return response || fetch(e.request); // responde com o cache ou busca no servidor.
            })
   );
});