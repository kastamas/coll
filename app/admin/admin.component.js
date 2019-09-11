"use strict";

angular
  .module("admin")
  .controller("AdminCtrl", [
    "$window",
    function($window) {
      const ctrl = this;

      ctrl.checkCode = function() {
        if (ctrl.code === "only4Admin") {
          alert("Доступ подтвержден!");
          $window.localStorage.setItem("isAdmin", "true");
        } else {
          alert("Код неверный!");
        }
      };
    }
  ])
  .component("admin", {
    templateUrl: "admin/admin.template.html",
    controller: "AdminCtrl"
  });
