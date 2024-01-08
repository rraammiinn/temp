import { getType } from "mime";

function getFileType(name){
    const fileType=getType(name) ?? 'misc'
    if (fileType.startsWith('image')) {return 'image'}
    else if (fileType.startsWith('video')) {return 'video'}
    else if (fileType.startsWith('audio')) {return 'audio'}
    else {return 'misc'}
  }
  
  function getIcon(fileType){
    if(fileType=='misc') return 'mdi-file';else if(fileType=='audio') return 'mdi-music';else return `mdi-${fileType}`;
  }

  export{getFileType, getIcon}