"use strict";

angular
  .module("admin")
  .controller("AdminCtrl", [
    "$window",
    "$route",
    function($window, $route) {
      const ctrl = this;

      ctrl.isAdmin = $window.localStorage.getItem("isAdmin");

      ctrl.checkCode = function() {
        if (ctrl.code === "only4Admin") {
          alert("Доступ подтвержден!");
          $window.localStorage.setItem("isAdmin", "true");
          $route.reload();
        } else {
          alert("Код неверный!");
        }
      };

      ctrl.cancelSession = function() {
        $window.localStorage.removeItem("isAdmin");
        alert("Сессия завешена!");
        $route.reload();
      };
    }
  ])
  .component("admin", {
    templateUrl: "admin/admin.template.html",
    controller: "AdminCtrl"
  });
