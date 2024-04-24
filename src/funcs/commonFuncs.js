import { getType } from "mime";

// import faceImage from '@/assets/images/face.svg'
// import groupImage from '@/assets/images/group.svg'
// import bellImage from '@/assets/images/bell.svg'


import userAvatarAlt from '@/assets/images/user-avatar-alt.svg'
import groupAvatarAlt from '@/assets/images/group-avatar-alt.svg'
import channelAvatarAlt from '@/assets/images/channel-avatar-alt.svg'

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
    return userAvatar ? `/api/files/users/${userId}/${userAvatar}` : userAvatarAlt;
  }

  function getGroupAvatarUrl(groupId, groupAvatar){
    return groupAvatar ? `/api/files/groups/${groupId}/${groupAvatar}` : groupAvatarAlt;
  }

  function getChannelAvatarUrl(channelId, channelAvatar){
    return channelAvatar ? `/api/files/channels/${channelId}/${channelAvatar}` : channelAvatarAlt;
  }

  function getAvatarUrl(id, avatar, avatarType){
    if(avatarType == 'chat')avatarType='user';
    let fallbackImage = userAvatarAlt;
    if(avatarType == 'group')fallbackImage = groupAvatarAlt;
    else if(avatarType == 'channel')fallbackImage = channelAvatarAlt;
    return avatar ? `/api/files/${avatarType}s/${id}/${avatar}` : fallbackImage;
  }
  
  
  function formatDate(date){
    if(!date)return;
    const d = new Date(date);
    const now = new Date();
    if(now.getFullYear() != d.getFullYear())return d.toLocaleDateString()
    if((now.getMonth() != d.getMonth() || (now.getDate() - d.getDate() > 6)))return Intl.DateTimeFormat(undefined,{month:'long',day:'numeric'}).format(d)
    if(now.getDate() - d.getDate() == 0)return 'Today'
    if(now.getDate() - d.getDate() == 1)return 'Yesterday'
    if(now.getDate() - d.getDate() > 1)return Intl.DateTimeFormat(undefined,{weekday: "long"}).format(d)
  }

  function formatTime(date, now){
    if(!date)return;
    const d = new Date(date);
    const n = new Date(now);
    const minutes = Math.max(Math.floor((n.getTime() - d.getTime()) / 60000 ), 0)
    if(minutes / 60 >= 1)return d.toLocaleTimeString()
    else if(minutes == 0)return 'just now'
    else return `${minutes} min ago`
  }

  export{getFileType, getIcon, getFileIcon, getUserAvatarUrl, getGroupAvatarUrl, getChannelAvatarUrl, getAvatarUrl, formatDate, formatTime}