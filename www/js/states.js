angular.module('starter')

.config(function ($stateProvider, $urlRouterProvider) {


 $stateProvider

  // setup an abstract state for the tabs directive

    .state('menu', {
      url:'/menu',
      abstract:true,
      templateUrl: 'templates/menu.html',
      controller: 'MainCtrl',
      css: 'resources/play-widget/css/play-widget.css'



    })

    .state('menu.tab', {
    url: '/tab',
     views:{
        'menuContent':{
        templateUrl: 'templates/tabs.html'

      }
    }

  })
  // Each tab has its own nav history stack:

  .state('menu.tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('menu.tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('menu.tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('menu.tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('menu.tab.stream', {
    url: '/stream',
    views: {
      'tab-stream': {
        templateUrl: 'templates/tab-stream.html',
        controller: 'StreamController as vm'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('menu/tab/dash');

});
