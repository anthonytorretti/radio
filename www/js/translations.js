angular.module('starter')

.config(function ($translateProvider) {
  $translateProvider.translations('it', {
  	'PlayerAlertMessage':'Attendere ancora un secondo',
    'TITLE': 'TEST TRADUZIONE',
    'FOO': 'paragrafo'
  });
  
  $translateProvider.preferredLanguage('it');
});