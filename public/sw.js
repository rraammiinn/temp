const cacheVersion = 0;

const staticCacheVersion = 0;
const dynamicCacheVersion = 0;

const staticCacheName = `cache${cacheVersion}-static${staticCacheVersion}`;
const dynamicCacheName = `cache${cacheVersion}-dynamic${dynamicCacheVersion}`;


self.addEventListener("install", (event) => {
    console.log('sw instaled ...')
    // event.waitUntil(handleInstall())
}
)


self.addEventListener("activate", (event) => {
    event.waitUntil(handleActivate())
}
)


self.addEventListener("fetch", handleFetch)

async function handleFetch(event) {
    const url = event.request.url;
    const request = event.request;
    if(request.method != 'GET' || !(url.startsWith('/') || url.startsWith(origin) || url.startsWith(origin.split('//').at(-1)) || url.startsWith('https://fonts.')) || url.startsWith(origin + '/_') || url.startsWith('/_')){console.log('mmmiiisssccc',request);return;};
    if(url.startsWith('/api/files/') || url.startsWith(origin + '/api/files/')){
        console.log('dynamic')
        event.respondWith(responseWhithDynamicCache(request))
    }else if(!(url.startsWith('/api/') || url.startsWith(origin + '/api/'))){
        console.log('static')
        event.respondWith(responseWhithStaticCache(request))
    }else{
        console.log('misc', request)
        // try{
        //     event.respondWith(responseWhithDynamicCache(request))
        // }catch{}
        return;
    }
}

async function responseWhithNetwork(request){
    return await fetch(request)
}

async function responseWhithStaticCache(request){
    const cache = await caches.open(staticCacheName);
    let response = await caches.match(request);
    if(!response){
        console.log('from network',request.url)
        response = await fetch(request)
        try{
            await cache.put(request, response.clone());
        }catch{}
    }
    return response
}

async function responseWhithDynamicCache(request){
    const cache = await caches.open(dynamicCacheName);
    let response = await caches.match(request);
    if(!response){
        console.log('from network',request.url)
        response = await fetch(request)
        try{
            await cache.put(request, response.clone());
        }catch{}
    }
    return response
}

async function handleActivate(){
    await deleteOldCaches()
    const cache = await caches.open(`cache${cacheVersion}-static${staticCacheVersion}`);
    cache.addAll(['/', '/index.html'])
}




async function deleteOldCaches() {
    const keys = await caches.keys();
    keys.filter(key => (key != staticCacheName && key != dynamicCacheName)).forEach(key => caches.delete(key))
  }







// const cacheFirst = async (request) => {
//     const responseFromCache = await caches.match(request);
//     if (responseFromCache) {
//         console.log('cache')
//       return responseFromCache;
//     }
//     return fetch(request);
//   };
  
//   self.addEventListener("fetch", (event) => {
//     event.respondWith(cacheFirst(event.request));
//   });