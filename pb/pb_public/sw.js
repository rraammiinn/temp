const cacheVersion = 0;

const staticCacheVersion = 0;
const dynamicCacheVersion = 0;

const staticCacheName = `cache${cacheVersion}-static${staticCacheVersion}`;
const dynamicCacheName = `cache${cacheVersion}-dynamic${dynamicCacheVersion}`;


self.addEventListener("install", (event) => {
    event.waitUntil(preCache())
}
)


self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCaches())
}
)


self.addEventListener("fetch", handleFetch)

async function handleFetch(event) {
    const url = event.request.url;
    const request = event.request;
    if(request.method != 'GET' || !(url.startsWith('/') || url.startsWith(origin) || url.startsWith(origin.split('//').at(-1)) || url.startsWith('https://fonts.')) || url.startsWith(origin + '/_') || url.startsWith('/_')){console.log('mmmiiisssccc',request);return;};
    if(url.startsWith('/api/files/') || url.startsWith(origin + '/api/files/')){
        event.respondWith(responseWhithDynamicCache(request))
    }else if(!(url.startsWith('/api/') || url.startsWith(origin + '/api/'))){
        event.respondWith(responseWhithStaticCache(request))
    }else{
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
        response = await fetch(request)
        try{
            await cache.put(request, response.clone());
        }catch{}
    }
    return response
}

// async function handleActivate(){
//     await deleteOldCaches()
//     await preCache()
// }




async function deleteOldCaches() {
    const keys = await caches.keys();
    keys.filter(key => (key != staticCacheName && key != dynamicCacheName)).forEach(key => caches.delete(key))
  }


async function preCache(){
    const cache = await caches.open(`cache${cacheVersion}-static${staticCacheVersion}`);
    cache.add(['/'])
}







// const cacheFirst = async (request) => {
//     const responseFromCache = await caches.match(request);
//     if (responseFromCache) {
//       return responseFromCache;
//     }
//     return fetch(request);
//   };
  
//   self.addEventListener("fetch", (event) => {
//     event.respondWith(cacheFirst(event.request));
//   });