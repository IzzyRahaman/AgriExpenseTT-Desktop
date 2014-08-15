var app = angular.module('ExpenseApp', []);

app.service('Utilities', function () {

    this.substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });

            cb(matches);
        };
    };

})

app.service('ResourceService', ['$http', function ($http) {

    // The base resources available to every farmer
    this.planting_materials = ["HOT PEPPER", "SWEET PEPPER", "PIGEON PEAS", "SOYABEAN – LEGUMES", "COCOA", "CITRUS",
                          "COCONUT", "GOLDEN APPLE \\ POMMECYTHERE", "MANGO", "WATERMELON", "CASSAVA", "DASHEEN",
                          "EDDOES","SWEET POTATO", "TANNIA", "YAM", "BROCCOLI", "CARROTS", "CABBAGE", "CAULIFLOWER",
                          "CHRISTOPHENE", "EGGPLANT \\ MELONGENE", "ESCALLION \\ CHIVE", "LETTUCE",
                          "ONIONS", "TOMATOES", 'CORN', "MALAY ROSE APPLE \\ POMMERAC"]

    this.fertilizers = ["Fersan (7.12.40 + 1TEM)", "Magic Grow (7.12.40 + TE HYDROPHONIC)", "Hydro YARA Liva (15.0.15)", "Techni - Grow (7.12.27 + TE)",
		"Ferqidd (10.13.32 + TE)", "Plant Prod (7.12.27 + TE)", "Flower Plus (9.18.36 + TE)", "Iron Chelate Powder (FE - EDTA)",
		"Magnesium Sulphate (Mg SO4)", "12-24-12 FERTILIZER", "HARVEST MORE 10-55-10", "HARVEST MORE 13-0-44", "HARVEST MORE 5-5-45",
		"NPK 12-12-17", "UREA 46-0-0", "PLANT BOOSTER", "MIRACLE GRO ALL PROPOSE PLANT FOOD", "SCOTTS FLOWER AND VEGETABLE PLANT FOOD"]

    this.soil_amendments = ["Cow manure", "Compost", "Gypsum", "Limestone", "Sulphur", "Molasses", "Chicken manure", "Horse manure", "Calphos",
		"Sharp sand"]

    this.chemicals = ["Fungicide", "Insecticide", "Weedicide", "Algicides", "Antimicrobials", "Biopesticides", "Biocides", "Fumigants",
		"Herbicides", "Miticides", "Microbial pesticides", "Molluscicides", "Nematicides", "Ovicides", "Pheromones",
		"Repellents", "Rodenticides"]

    // Load the resources into a single object for easy reference
    this.base_resources = {};
    this.base_resources['Planting Materials'] = this.planting_materials;
    this.base_resources['Fertilizers'] = this.fertilizers;
    this.base_resources['Soil Amendments'] = this.soil_amendments;
    this.base_resources['Chemicals'] = this.chemicals;
    this.resource_types = ['Planting Materials', 'Fertilizers', 'Soil Amendments', 'Chemicals',
        'Labour', 'Other']




}]);

app.service('PurchaseInsertService', ['$http', function ($http) {

    this.insert_purchase = function (resource_type, date, resource_name, qty_purchased,
        cost, quantifier, fn) {
        var user_id = 0;
        var url = "http://127.0.0.1:5555/purchases/make";

        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: url,
            data: $.param({
                date: date,
                user: user_id,
                type: resource_type,
                name: resource_name,
                qty: qty_purchased,
                cost: cost,
                quantifier: quantifier,
                qty_remaining: qty_purchased
            })
        };

        // Make post request to insert persist purchase
        $http(options).success(fn);

    }

}]);

app.service('PurchaseRetrievalService', ['$http', function ($http) {


    var that = this;
    this.observers = [];
    this.register_observer = function (fn) {
        this.observers.push(fn);
    }

    this.notify_observers = function (data) {
        var len = this.observers.length;
        for (var idx = 0; idx < len; idx++) {
            this.observers[idx](data);
        }
    }

    this.user = 0;
    this.url = "http://127.0.0.1:5555/purchases/" + this.user;
    this.purchases = [];

    this.retrieve_purchases = function () {
        
        $http.get(that.url).success(function (data) {
            that.purchases = data;
            that.notify_observers(data);
            console.log('Retrieved: ');
            console.log(data);
        })
        
    }

    this.retrieve_purchases();

}]);

app.controller('PurchaseController', ['$scope', 'ResourceService', 'PurchaseInsertService',
    'PurchaseRetrievalService', 'Utilities',
    function ($scope, ResourceService, PurchaseInsertService,
        PurchaseRetrievalService, Utilities) {

        // For form fields

        console.log(ResourceService.base_resources);
        $scope.purchases = [];
        $scope.resource_types = ResourceService.resource_types;
        $scope.quantifiers = ['Bags', 'Kg', 'L', 'ml', 'oz', 'Seed', 'Stick'];
        $scope.resource_names = ResourceService.base_resources;
        PurchaseRetrievalService.register_observer(function (data) {
            $scope.purchases = data;
        })
        // Property for model

        $scope.resource_type = $scope.resource_types[0];
        $scope.resource = $scope.resource_names[$scope.resource_type][0];
        $scope.quantifier = 'Kg';
        $scope.qty = 0;
        $scope.cost = 0.0;
        $scope.date = "";

        $scope.submit_purchase = function () {
            console.log($scope.resource_type);
            console.log($scope.resource);
            console.log($scope.quantifier);
            console.log($scope.qty);
            console.log($scope.cost);
            var date = $('#date').val();
            console.log(date);
            console.log('Logging data');
            PurchaseInsertService.insert_purchase($scope.resource_type, date, $scope.resource, $scope.qty,
            $scope.cost, $scope.quanitifier, function (data) {
                console.log(data);
                $scope.purchases.push(data);
            })
            console.log('Logged data');
        }
        $scope.load_purchase = function () {
            PurchaseRetrievalService.retrieve_purchases();
        }


    }]);


app.service('CycleWriterService', ['$http', function ($http) {

    var that = this;
    this.insert_purchase = function (user_id, crop, land_quantifier, land_amt, date, response) {
        var url = "http://127.0.0.1:5555/cycles/new";
        var options = {
            method: 'POST',
            data: $.param({
                userId: user_id, crop: crop,
                quantifier: land_quantifier, amt: land_amt, date: date
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: url
        };

        $http(options).success(response);
    }


}]);

app.service('CycleReaderService', ['$http', function ($http) {

    var that = this;
    this.user_id = 0;
    this.observers = [];
    this.data = [];
    this.notify_observers = function (data) {
        that.observers.forEach(function (fn) {
            fn(data);
        })
    };

    this.add_observer = function(fn) {
        that.observers.push(fn);
    };
    
    this.url = "http://127.0.0.1:5555/cycles/" + this.user_id;
    $http.get(this.url).success(function(data) {
        that.data = data;
        that.notify_observers(data);
    })

}]);

app.controller('CycleController', ['$scope', 'ResourceService', 'CycleWriterService', 'CycleReaderService',
    function ($scope, ResourceService, CycleWriterService, CycleReaderService) {

    $scope.quantifiers = ['Acre', 'Hectre', 'Beds'];
    $scope.crops = ResourceService.base_resources['Planting Materials'];
    //alert('Cycle controller loaded');
    console.log($scope.quantifiers);
    console.log($scope.crops);

    $scope.amt = 0.0;
    $scope.quantifier = $scope.quantifiers[0];
    $scope.crop = $scope.crops[0];
    $scope.date = "";

    $scope.submit_cycle = function () {
        var user_id = 0;
        console.log(date);
        CycleWriterService.insert_purchase(user_id, $scope.crop,
            $scope.quantifier, $scope.amt, $scope.date, function (data) {
                console.log(data);
                $scope.cycles.push(data);
            });
    }

    $scope.cycles = [];
    CycleReaderService.add_observer(function (data) {
        $scope.cycles = data;
        console.log($scope.cycles);
    });


}]);
