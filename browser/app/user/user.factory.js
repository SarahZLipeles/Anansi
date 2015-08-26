var UserFactory = function($http){
    function transformData(response){
        return response.data;
    }
    return {
        signUp: function(userInfo){
            return $http.post('/signup', userInfo)
                .then(transformData)
                .then(function(data){
                    return data;
                });
        },
        login: function(email){
            return $http.get('/login/' + email)
                .then(transformData)
                .then(function(data){
                    return data;
                })
        }
    }
}

UserFactory.$inject = ["$http"];

module.exports = UserFactory;
