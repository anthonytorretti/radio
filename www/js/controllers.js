angular.module('starter.controllers',[])

.controller('MainCtrl', function($scope,$rootScope,$css,$interval,streamService,ParseM3U,$timeout) {

  //CONTROLLER OF ABSTRACT METHOD PRESENT IN ALL CONTROLLERS////
            //PLAY CONTROL OF GENERAL PLAYER//

               // var alertshowed=false;
               streamService.loadstream('stream');

               $scope.changestream=function(genere){
                 streamService.changeStream(genere).then(function(){
                   console.log(ParseM3U.getList());
                   playlist=ParseM3U.getList();
                   $scope.$broadcast('updateplaylist',playlist);

                 });

               }
                     //START GETTING STREAM INFO
                $scope.streamInfo=streamService.getStatus();
                timer = $interval(function() {
                  $scope.streamInfo=streamService.getStatus();
                 //ALERT TO WAIT A LITTLE MORE FOR STREAMING TO START
                /* if(streamStatus.info.title!="loading" && streamStatus.isPlaying==true && alertshowed==false){

                     $scope.alertactive=true;
                     $timeout(function() {
                     $scope.alertactive=false;
                     alertshowed=true;
                     }, 2000);
                 }
                 */
                }, 5000);

                $scope.play= function(){
                  streamService.toggleplay();
              }

               $scope.next=function () {
                 streamService.next();
               }
  $scope.prev=function () {
    streamService.prev();
  }


            //DYNAMIC BINDING OF CUSTOM CSS//
             $css.bind({
                href: 'resources/play-widget/css/play-widget.css'
              }, $scope);


            //HIDE PLAYER FROM CERTAIN VIEWS//
              $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){

                  if(toState.url=="/stream"){
                    $scope.hide=true;

                  }
                  else{
                    $scope.hide=false;
                  }
              })
})

.controller('DashCtrl', function($scope) {

  var deploy = new Ionic.Deploy();

  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



.controller('StreamController', function($scope,$rootScope,$interval,streamService,$css,$timeout) {



// *********************************************************************

var streamStatus=streamService.getStatus();


  $timeout(function(){
    $scope.vm=streamStatus;
  },50);

   timer = $interval(function() {
   $scope.vm=streamService.getStatus();
  }, 5000);

  $scope.play= function(){
  
  if(streamStatus.isPlayList){

    streamService.changestream("stream");
  }
  else{

      streamService.toggleplay();

  }


    $scope.vm=streamService.getStatus();
  }


var myaudioURL = 'http://74.86.113.231:8000/;';

})




.controller('PlaylistController', function($scope,$rootScope,$css,streamService,$timeout,ParseM3U) {



  $scope.$on('updateplaylist', function(event,playlist){
    $scope.playlist=playlist;
    angular.forEach(playlist, function(info){
      streamService.getCoverPlaylist(info.artist,info.title).then(function(cover){

        info.cover = cover;
      })
    });

    $scope.info=streamService.getPlaylistInfo();

   });


   //$scope.cover=

// *********************************************************************

  $scope.changeSong= function(id){
      id=id-1;

      streamService.changeSong(id);
  }

});
