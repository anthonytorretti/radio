angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

    /* SERVICE PARSE M3U GIVE IN
      Input: http:\\someserver\file.m3u
      Returns: Json Formatted M3u file*/
.factory('ParseM3U',function($http,$q) {

  var list=null;
  var ParseM3U={

  getM3U: function (url) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {
      console.log(response.data);
      var playlist = self.parsePlaylist(response.data);
        angular.forEach(playlist, function(info){
          info.cover = "./img/icon.png";
        });
      deferred.resolve(playlist);


      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      deferred.reject(response.data);
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    return deferred.promise;
  }
  ,

  parsePlaylist: function (response) {

    var playlist = M3U.parse(response);
    ParseM3U.setList(playlist);
    console.log(playlist[0].file);
    return playlist;

  },

   setList: function(file){
     list=file;
   },

   getList: function(){
     return list;
   }

};

  var self=ParseM3U;
  return service = {
    getM3U: ParseM3U.getM3U,
    getList: ParseM3U.getList

  };



} )

.factory('streamService', function(ParseM3U,$http,$q){


var myaudioURL = 'http://74.86.113.231:8000/stream';
var metadataUrl = 'http://74.86.113.231:8000/7.html';
var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
var myaudio = new Audio();
var readyStateInterval = null;
var isPlaying = false;
var playing='none';
var isLoaded = false;
var timer=null;
var bufferOn=true;
var currentTime =0;
var IsPlaylist =false;
var PlayListArray = null;
var PlayElement =0;
var Genere=null;
var noInfo = {
  title:"loading",
  coverUrl:""
};

var playlistInfo={
                title: null,
                artist: null,
                genere: Genere,
                songid: PlayElement+1
};

  var streamStatus={
                IsPlaylist:null,
                isLoaded:isLoaded,
                isPlaying:isPlaying,
                info:noInfo
              };

var streamCtrl = {


  setStreamSource : function(genere) {
    var deferre = $q.defer();
    switch(genere) {
      case 'tophits':
      playlistInfo.genere="Top Hits";
        var url = 'http://superadio.biz/tophits.m3u';
        ParseM3U.getM3U(url).then(function(data){
        deferre.resolve(data);
        });
        break;
      case 'rock':
       playlistInfo.genere="Rock";
        myaudioURL = 'http://74.86.113.231:8000/stream;';
        deferre.resolve("false");
        break;
      case 'chillout':
       Genere="Chillout";
        myaudioURL = 'http://74.86.113.231:8000/stream;';
        deferre.reject();
        break;
      case 'metal':
       Genere="Metal";
        myaudioURL = 'http://74.86.113.231:8000/stream;';
        deferre.reject();
        break;
      case 'classicheita':
       Genere="Classiche Italiane";
        myaudioURL = 'http://74.86.113.231:8000/stream;';
        deferre.reject();
        break;
      default:
        deferre.resolve("false");
        break;
    }

    return deferre.promise;
  },


  getStatus: function() {
                self.updateStreamInfo();
    console.log("Get Stream Info "+streamStatus.isPlaying);
                return streamStatus;
                     },


  streamCtrlEvents :function(action) {
      switch(action) {
          case 'music-controls-next':
              // Do something
              break;
          case 'music-controls-previous':
              // Do something
              break;
          case 'music-controls-pause':
              self.pause();
              MusicControls.updateIsPlaying(false);
              break;
          case 'music-controls-play':
              self.play();
              MusicControls.updateIsPlaying(true);
              break;
          case 'music-controls-destroy':
              // Do something
              break;

          // Headset events (Android only)
          case 'music-controls-media-button' :
              // Do something
              break;
          case 'music-controls-headset-unplugged':
              // Do something
              break;
          case 'music-controls-headset-plugged':
              // Do something
              break;
          default:
              break;
      }
  },


  showCtrl: function()  {
          console.log(streamStatus.info.title);
                    MusicControls.create({
                              track       : streamStatus.info.title,        // optional, default : ''
                              artist      : "",                       // optional, default : ''
                              cover : "../img/adam.jpg",                               // cover url goes here
                              isPlaying   : true,                         // optional, default : true
                              dismissable : true,                         // optional, default : false

                              // hide previous/next/close buttons:
                              hasPrev   : false,      // show previous button, optional, default: true
                              hasNext   : false,      // show next button, optional, default: true
                              hasClose  : true,       // show close button, optional, default: false

                              // Android only, optional
                              // text displayed in the status bar when the notification (and the ticker) are updated
                              ticker    : 'Now playing '+streamStatus.info.title
                        }, function(){}, function(){});

                    MusicControls.subscribe(self.streamCtrlEvents);
                    MusicControls.listen();
                      },



  streamBuffer : function(action){
    var count=0;
    var bufferLenght=10; //Seconds of Buffer Keep
    switch(action){
      case 'keep':
              console.log("Keeping StreamBuffer");
              clearInterval(timer);
              break;
      case 'stop':
              console.log("BUFFER STOPPED");

              self.stop();
              bufferOn=false;
              break;
      case 'start':  timer = setInterval(function() {
             count++;
             console.log("Buffer Clear in "+ (bufferLenght-count)+" s");
              if(count>=bufferLenght) {
                clearInterval(timer);
                self.streamBuffer("stop");

              }
                  }, 1000);
            break;
      default:
            break;
        }


  },

  loadstream: function(genere) {
                    var deferred= $q.defer();
                     currentTime=0;
                     myaudio.src="";
                     playing=genere;
                          //Set Stream Source Depending on User Choice
                     self.setStreamSource(genere).then(function(playlist){

                     if ( playlist!="false"){
                      // self.streamBuffer("keep");   //STOP BUFFER COUNTDOWN
                       PlayListArray=playlist;      //COPY PLAYLIST TO SCOPE VARIABLE
                       //self.play();
                       deferred.resolve();
                     }
                     else{/radio/
                       console.log("STREAM "+myaudioURL);
                       bufferOn=true;
                      //self.streamBuffer("start");
                       myaudio.src=myaudioURL;
                       myaudio.volume=0.0;
                       myaudio.preload="none";
                       myaudio.play();
                       deferred.resolve();
                     }


                   });
return deferred.promise;
                    /* readyStateInterval = setInterval(function(){
                     console.log("Streaming Connection State "+ myaudio.readyState);
                      if(myaudio.readyState==4){

                       }
                     },5000);*/


                  //VERIFICA ERRORI CONNESSIONE DI RETE
                    },



  changeStream: function(stream) {
    var deferred= $q.defer();
                    if (playing!=stream) {
                       // console.log("CHANGING TO "+stream);
                        if(stream!='stream') {
                         streamStatus.IsPlaylist = true;
                          console.log("PLAYLIST SELEZIONAT0"+streamStatus.IsPlaylist);
                        }
                        else {
                         streamStatus.IsPlaylist = false;
                          console.log("STREAMING SELEZIONAT0");
                        }


                      self.loadstream(stream).then(function(resp){
                        self.play();
                        deferred.resolve();
                      });
                      //setTimeout(function(){ self.play(); }, 3000);
                      }
    return deferred.promise;
  },

  changeSong: function(id){
    PlayElement=id;
    currentTime==0;
    self.stopPlayList();
    self.playPlayList();

  },


  getCoverPlaylist: function(title){
    defaultUrl="./img/icon.png";

      return $http.get(itunesSearchUrl + title).then(function(response) {
                            var item = response.data.results[0];
                            if (!item) {
                              return defaultUrl ;
                            }
                              return item.artworkUrl100;

  });
},
    // ***************************************************************************


  getCover: function(title) {
                          var resolutionRegex = /100x100/;
                          return $http.get(itunesSearchUrl + title).then(function(response) {
                            var item = response.data.results[0];
                            if (!item || !item.artworkUrl100) {
                              return null;
                            }
                            return item.artworkUrl100.replace(resolutionRegex, '500x500');
                          });
                        },

  parseShoutcastResponse: function(html) {
                          var contentRegex = /<body>(.*)<\/body>/;
                          var content = html.match(contentRegex)[1];
                          var parts = content.split(',');
                          if (parts.length < 7 || !parts[6]) {
                            return null;
                          }
                          return parts[6];
                        },
  getPlaylistInfo: function(){
    return playlistInfo;
  },

  getStreamInfo: function() {

                        return $http.get(metadataUrl).then(function(response) {

                          var title = self.parseShoutcastResponse(response.data);

                          if (!title) {
                           return {};
                          }
                          return self.getCover(title).then(function(coverUrl) {
                             return {
                                      title: title,
                                      coverUrl: coverUrl
                                    };
                          });
                        },function errorCallback(response){


                        });
                      },
  updateStreamInfo: function() {

                      if(streamStatus.isPlaying==true){
                             self.getStreamInfo().then(function(info) {

                             streamStatus.info = info;
                             console.log(streamStatus.info);
                             self.showCtrl();
                              }, function() {
                                 streamStatus.info = null;
                              });
                            }
                      else
                         streamStatus.info=noInfo;
                        },


  playStream: function(){

                    if(bufferOn==false){
                      //POSSIBILE AVVISO DI ATTENDERE CARICAMENTO//
                    //  self.loadstream();
                    }

                     // self.streamBuffer("keep");
                      console.log(streamStatus.isPlaying);
                      streamStatus.isPlaying = true;
                      myaudio.volume=1.0;


                  },

  pauseStream: function(){

                      myaudio.volume=0.0;
                     // self.streamBuffer("start");
                      streamStatus.isPlaying = false;
                      clearInterval(readyStateInterval);
  },

  stopStream: function() {

                      self.pause();
                      myaudio.src= "";
                      myaudio = new Audio(myaudioURL);
                      myaudio.volume=0.0;
                      streamStatus.isPlaying = false;
                      clearInterval(readyStateInterval);
  },


  playPlayList: function() {
                    // console.log("PLAYING "+PlayListArray[PlayElement].file);
                     if(currentTime==0) {
                      myaudio.preload = "none";
                       myaudio.src = PlayListArray[PlayElement].file;

                       playlistInfo.artist=PlayListArray[PlayElement].artist;
                       playlistInfo.title=PlayListArray[PlayElement].title;



                     };
console.log( "PLAYYYY"+streamStatus.IsPlaylist);
    myaudio.volume=1.0;
                      streamStatus.isPlaying = true;
                      myaudio.play();


    myaudio.onended = function() {

          self.nextPlaylist();

    };

                  },


  pausePlayList: function(){
                      currentTime=myaudio.currentTime;
                      myaudio.pause();
                      //myaudio.src="";
                      streamStatus.isPlaying = false;
                   //  myaudio = new Audio(PlayListArray[PlayElement].file);
                    //  myaudio.preload = "none";
                   },

  stopPlayList: function(){
                  console.log("STOPLIST");
                  currentTime=myaudio.currentTime;
                  myaudio.pause();
                  myaudio.src="";
                  streamStatus.isPlaying = false;
                  myaudio = new Audio(PlayListArray[PlayElement].file);
                  myaudio.preload = "none";
  },

  nextPlaylist: function(){
    currentTime==0;

    if(PlayElement < PlayListArray.length-1) {
      PlayElement++;
      self.stopPlayList();
      self.playPlayList();

    }
    else {
      PlayElement = 0;
      self.stopPlayList();
      self.playPlayList();
    }

  },

  prevPlaylist: function(){
    currentTime==0;

    if(PlayElement >0) {
      PlayElement--;
      self.stopPlayList();
      self.playPlayList();

    }
    else {
      self.stopPlayList();
      self.playPlayList();
    }
  },

  play: function(){

          if(streamStatus.IsPlaylist) {

            self.playPlayList();
          }
          else {
            self.playStream();
          }
  },

  pause: function(){
    if(streamStatus.IsPlaylist)
    self.pausePlayList();
    else
   self.pauseStream();
  },

  stop: function(){
    if(streamStatus.IsPlaylist)
      self.stopPlayList();
    else
      self.stopStream();
  },

  toggleplay: function() {

                  if(streamStatus.isPlaying==false){

                          self.play();
                  }
                  else{
                          self.pause();
                  }
                }
  };

  var self=streamCtrl;
  return service = {
    IsPlaylist: streamStatus.IsPlaylist,
    getPlaylistInfo: streamCtrl.getPlaylistInfo,
    getStatus: streamCtrl.getStatus,
    toggleplay: streamCtrl.toggleplay,
    loadstream: streamCtrl.loadstream,
    changeStream: streamCtrl.changeStream,
    changeSong: streamCtrl.changeSong,
    getCoverPlaylist: streamCtrl.getCoverPlaylist,
    next: streamCtrl.nextPlaylist,
    prev: streamCtrl.prevPlaylist
  };


});
