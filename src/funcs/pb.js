import PocketBase from 'pocketbase';

let pb = new PocketBase('/');

function reCreatePB() {
    pb = new PocketBase('/');
}

export {pb, reCreatePB}