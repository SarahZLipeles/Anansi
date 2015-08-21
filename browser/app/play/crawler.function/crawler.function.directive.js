define([], function () {
	var crawler = {name: "crawler"};
	
    crawler.func = function(){
        return {
            restrict: 'E',
            templateUrl: '/app/play/crawler.function/crawler.function.html'
        };
    };
    return crawler;
});