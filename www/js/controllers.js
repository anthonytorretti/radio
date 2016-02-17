angular.module('starter.controllers',[])

.controller('MainCtrl', function($scope,$rootScope,$css,$interval,streamService,$timeout) {



 


  //CONTROLLER OF ABSTACT METHOD PRESENT IN ALL CONTROLLERS////
            //PLAY CONTROL OF GENERAL PLAYER//
                streamService.loadstream();

                var streamStatus;
                var alertshowed=false;
                 $scope.stream=streamService.getStatus();
  

                timer = $interval(function() {
                  streamStatus=streamService.getStatus();
  
                  $scope.stream=streamStatus;
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
    // transitionTo() promise will be rejected with 
    // a 'transition prevented' error
})
})

.controller('DashCtrl', function($scope) {})

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

.controller('StreamController', function($scope,$interval,streamService,$css,$timeout) {

// *********************************************************************

var streamStatus=streamService.getStatus();
  
  $timeout(function(){
   
   $scope.vm=streamStatus;
  },50);

   timer = $interval(function() {
   $scope.vm=streamService.getStatus();
  }, 5000);

  $scope.play= function(){
    streamService.toggleplay();
    $scope.vm=streamService.getStatus();
  }

  //TEST//

var myaudioURL = 'http://74.86.113.231:8000/;';


  


});