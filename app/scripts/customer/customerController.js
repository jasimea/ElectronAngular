(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', ['customerService', '$q', '$mdDialog', CustomerController]);
    
    function CustomerController(customerService, $q, $mdDialog) {
        var self = this;
        
        self.selected = null;
        self.customers = [];
        self.selectedIndex = 0;
        self.filterText = null;
        self.selectCustomer = selectCustomer;
        self.deleteCustomer = deleteCustomer;
        self.saveCustomer = saveCustomer;
        self.createCustomer = createCustomer;
        self.filter = filterCustomer;
        
        // Load initial data
        getAllCustomers();
        
        //----------------------
        // Internal functions 
        //----------------------
        
        function selectCustomer(customer, index) {
            self.selected = angular.isNumber(customer) ? self.customers[customer] : customer;
            self.selectedIndex = angular.isNumber(customer) ? customer: index;
        }
        
        function deleteCustomer($event) {
            var confirm = $mdDialog.confirm()
                                   .title('Are you sure?')
                                   .content('Are you sure want to delete this customer?')
                                   .ok('Yes')
                                   .cancel('No')
                                   .targetEvent($event);
            
            
            $mdDialog.show(confirm).then(function () {
                customerService.destroy(self.selected.customer_id).then(function (affectedRows) {
                    self.customers.splice(self.selectedIndex, 1);
                });
            }, function () { });
        }
        
        function saveCustomer($event) {
            if (self.selected != null && self.selected.customer_id != null) {
                customerService.update(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Updated Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
            else {
                //self.selected.customer_id = new Date().getSeconds();
                customerService.create(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Added Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
        }
        
        function createCustomer() {
            self.selected = {};
            self.selectedIndex = null;
        }
        
        function getAllCustomers() {
            customerService.getCustomers().then(function (customers) {
                self.customers = [].concat(customers);
                self.selected = customers[0];
            });
        }
        
        function filterCustomer() {
            if (self.filterText == null || self.filterText == "") {
                getAllCustomers();
            }
            else {
                customerService.getByName(self.filterText).then(function (customers) {
                    self.customers = [].concat(customers);
                    self.selected = customers[0];
                });
            }
        }
    }

})();