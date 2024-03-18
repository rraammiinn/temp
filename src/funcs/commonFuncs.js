import { getType } from "mime";

import faceImage from '@/assets/images/face.svg'
import groupImage from '@/assets/images/group.svg'
import bellImage from '@/assets/images/bell.svg'


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

  function getFileIcon(fileName){
    if(fileName=='voice.mp3')return 'mdi-microphone';
    else if(fileName=='video.mp4')return 'mdi-webcam';
    else return getIcon(getFileType(fileName));
  }










  function getUserAvatarUrl(userId, userAvatar){
    return userAvatar ? `/api/files/users/${userId}/${userAvatar}` : faceImage;
  }

  function getGroupAvatarUrl(groupId, groupAvatar){
    return groupAvatar ? `/api/files/groups/${groupId}/${groupAvatar}` : groupImage;
  }

  function getChannelAvatarUrl(channelId, channelAvatar){
    return channelAvatar ? `/api/files/channels/${channelId}/${channelAvatar}` : bellImage;
  }

  export{getFileType, getIcon, getFileIcon, getUserAvatarUrl, getGroupAvatarUrl, getChannelAvatarUrl}