"use strict";

angular
  .module("admin")
  .controller("AdminCtrl", [
    function() {
      const ctrl = this;

      ctrl.checkCode = function() {
        if (ctrl.code === "only4Admin") {
          alert("Доступ подтвержден!");
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
