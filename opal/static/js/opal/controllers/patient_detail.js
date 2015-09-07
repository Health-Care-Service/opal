//
// Editing/detail page for ward round episodes
//
angular.module('opal.controllers').controller(
   'PatientDetailCtrl', function($rootScope, $scope, $cookieStore,
                                episodes, options, profile, recordLoader,
                                EpisodeDetailMixin, ngProgressLite, $q
                                   ){

        microEpisodes = _.filter(episodes, function(e){
           return e.microbiology_input && e.microbiology_input.length;
       });
       $scope.episodes = _.sortBy(microEpisodes, function(e){
           var significantDate = e.date_of_discharge || e.date_of_episode || e.date_of_admission;
           if(significantDate){
               return significantDate.unix * -1;
           }
       });


       $scope.inlineForm = $cookieStore.get("patientView-inlineForm") || "";
       $scope.profile = profile;
       $scope.options = options;

       function getResistantOrganisms(episode){
           if(episode.microbiology_test){
               return _.reduce(episode.microbiology_test, function(r, mt){
                   if(mt.resistant_antibiotics){
                       r.push(mt.resistant_antibiotics);
                   }

                   return r;
               }, []);
           }
       }

       if($scope.episodes.length){
           $scope.episode = $scope.episodes[0];

           $scope.episode.resistantOrganisms = function(){
                   return _.reduce(episodes, function(r, e){
                   var resistantOrganisms = getResistantOrganisms(e);
                   if(resistantOrganisms.length){
                       r = r.concat(resistantOrganisms);
                   }

                   return r;
               }, []);
           };

           EpisodeDetailMixin($scope);
           $scope.lastInputId = _.last(_.last($scope.episodes).microbiology_input).id;
       }

       $scope.patient = episodes[0].demographics[0];

       $scope.getEpisodeLink = function(episode){
           return "/#/episode/" + episode.id;
       };
   }
);
