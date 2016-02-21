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

.factory('streamService', function($http,$q,$interval,$rootScope,$sce){



var myaudioURL = 'http://74.86.113.231:8000/stream;';
 var metadataUrl = 'http://74.86.113.231:8000/7.html';
 var contentRegex = /<body>(.*)<\/body>/;
 var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
 var resolutionRegex = /100x100/;
 var myaudio = null;
 var readyStateInterval = null;
 var isPlaying = false;
 var isLoaded = false;
 
var info = {
  title:"loading"
  coverUrl:""
}

 var streamStatus={
                isLoaded:isLoaded,
                isPlaying:isPlaying,
                info:info
              };


var streamCtrl = {

 
  getStatus: function() {
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
                              artist      : '',                       // optional, default : ''
                           // cover :'',                               // cover url goes here
                              isPlaying   : true,                         // optional, default : true
                              dismissable : true,                         // optional, default : false

                              // hide previous/next/close buttons:
                              hasPrev   : false,      // show previous button, optional, default: true
                              hasNext   : false,      // show next button, optional, default: true
                              hasClose  : true,       // show close button, optional, default: false

                              // Android only, optional
                              // text displayed in the status bar when the notification (and the ticker) are updated
                              ticker    : 'Now playing "Time is Running Out"'
                        }, function(){}, function(){});

                    MusicControls.subscribe(self.streamCtrlEvents);
                    MusicControls.listen();
                      },

  loadstream: function() {

                   clearInterval(readyStateInterval);
                   myaudio = null;
                   myaudio = new Audio(myaudioURL);

                   myaudio.volume=0.0;
                   myaudio.play();

                   readyStateInterval = setInterval(function(){
                     console.log(myaudio.readyState);
                      if(myaudio.readyState==4){
                    
                       }
                     },1000);
                   
                  
                  //VERIFICA ERRORI CONNESSIONE DI RETE
                    },
                


 



    // ***************************************************************************


  getCover: function(title) {
     
                          return $http.get(itunesSearchUrl + title).then(function(response) {
                            var item = response.data.results[0];
                            if (!item || !item.artworkUrl100) {
                              return null;
                            }
                            return item.artworkUrl100.replace(resolutionRegex, '500x500');
                          });
                        },

  parseShoutcastResponse: function(html) {
                          var content = html.match(contentRegex)[1];
                          var parts = content.split(',');
                          if (parts.length < 7 || !parts[6]) {
                            return null;
                          }
                          return parts[6];
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
                         streamStatus.info=null;
                        },


  play: function(){
   
                      
                      console.log(streamStatus.isPlaying);
                      streamStatus.isPlaying = true;
                      console.log(streamStatus.isPlaying);
                       
                      timer = $interval(function() {
                      self.updateStreamInfo();
                       }, 5000);

                     
                      myaudio.volume=1.0;
                      
                  },

  playList: function() {
                      myaudio.currentTime=currentTime;
                      myaudio.play();
                  },



  pauseList: function(){
                      currentTime=myaudio.currentTime;
                      myaudio.pause();
                      myaudio.src="";
                      myaudio = null;
                      myaudio = new Audio(myaudioURL);
                      myaudio.preload = "none";
                   },

  pause: function(){

                    


                      myaudio.volume=0.0;
                      streamStatus.isPlaying = false;
                      clearInterval(readyStateInterval);
                    },

  stop: function() {
                      myaudio.pause();
                      myaudio = null;
                      myaudio = new Audio(myaudioURL);
                      myaudio.volume=0.0;
                      streamStatus.isPlaying = false;
                      clearInterval(readyStateInterval);
                    },


  toggleplay: function() {
   
                  if(streamStatus.isPlaying==false){
                  
                    self.play();
                  
                  }
                  else{
                    self.pause();
                  }
                },                       
  };

    var self=streamCtrl;
    var service={
      getStatus: streamCtrl.getStatus,
      toggleplay: streamCtrl.toggleplay,
      loadstream: streamCtrl.loadstream
    }
    return service;

});

