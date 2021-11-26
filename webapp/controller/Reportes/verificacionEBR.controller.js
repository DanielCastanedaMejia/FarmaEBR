sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (MessageBox,BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.verificacionEBR", {
      
    onInit: function () {
      this._getUsuario("username");
    },

    onAfterRendering:function(){
      //--
    },
    
    onImprimirEtiqueta:function(){
      var wind = window.open("", "prntExample");

var lines = ' <head>\
  <meta charset="utf-8" />\
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\
      <title>Etiqueta</title>\
      <meta name="description" content="">\
      <meta name="viewport" content="width=device-width">\
      <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">\
      <link rel="stylesheet" type="text/css" href="css/custom.css">\
  </head>\
  <body>\
<div padding="5px">\
  <table width="65%">\
  <tr>\
      <th><h4>MOLINO:</h4></th>\
      <td style="float:right;"><h4>Hora: <span id="horaEmp"></span></h4></td>\
  <tr>\
  <tr>\
      <th><h4><span id="molino"></span></h4></th>\
      <td style="float:right;"><h4>Fecha: <span id="fechaEmp"></h4></span></td>\
  <tr>\
  </tr>\
      <tr>\
  </tr>\
  </table>\
</div>\
<hr>\
<div padding="5px">\
  <table>\
  <tr>\
      <td style="padding: 5px 0px 0px 40px;"><h4>LAM</h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4>CAL</h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4>GRADO</h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4>ANCHO</h4></td>\
  </tr>\
  <tr>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong>RCS</strong></h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="cal1"></span><strong></h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="grado1"></span></strong></h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="ancho1"></span></strong></h4></td>\
  </tr>\
  <tr>\
      <td style="padding: 5px 0px 0px 40px;"><h4>REAL</h3></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="cal2"></span><strong></h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="grado2"></span><strong></h4></td>\
      <td style="padding: 5px 0px 0px 40px;"><h4><strong><span id="ancho2"></span><strong></h4></td>\
  </tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%" border="1"; style="text-align:center;">\
  <tr>\
      <th><h2>COLADA</h2></th>\
      <td color="white" bgcolor="#000000"><h2><span id="colada"></span></h2></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%"; style="text-align:center;">\
  <tr>\
      <td><h4>PROV:</h4></th>\
      <td style="float:right;"><h4><span id="prov"></span></h4></td>\
  <tr>\
  <tr>\
      <td><h4>Serie PROV:</h4></th>\
      <td style="float:right;"><h4><span id="serie_prov"></span></h4></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%" border="1"; style="text-align:center;">\
  <tr>\
      <th color="white" bgcolor="000000" style="text-align:center;"><h3>Observaciones de Bascula</h3></th>\
  <tr>\
  <tr>\
      <td><h4><span id="observ"></span></h4></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%" style="text-align:center;">\
  <tr>\
      <td><h1>SERIE</h1></td>\
  <tr>\
  <tr>\
      <td><img src="images/CodigoBarras.PNG" width="100%" align="middle"></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%" style="text-align:center;">\
  <tr>\
      <td><h1><span id="etiqueta"></span></h1></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table  width="65%" style="text-align:right;">\
  <tr>\
      <td><h1><strong><span id="number"></span></h1></strong></td>\
  <tr>\
  </table>\
</div>\
<div padding="5px">\
  <table border="1" width="30%" style="text-align:center;">\
  <tr>\
      <td color="white" bgcolor="00000"><h5>Clase GSD</h5></td>\
      <td><h5><span id="gsd"></span></h5></td>\
  <tr>\
  </table>\
</div>\
  </body>';

      wind.document.write(lines);

       var d= new Date();
       var dia=d.getDate();
       var mes=d.getMonth()+1;
       var anio=d.getFullYear();
       var horas=d.getHours();
       var minutos=d.getMinutes();
       var segundos= d.getSeconds();
     
      if(mes<10){
        mes= "0" + mes;
      }
      if(dia<10){
        dia= "0" + dia;
      }
      if(horas<10){
        horas= "0" + horas;
      }
      if(minutos<10){
        minutos= "0" + minutos;
      }
      if(segundos<10){
        segundos= "0" + segundos;
      }
      
      var codigoBarra="1000002496";
      var nombreMaterial="POLIPROPILENO HOMOPOLIMERO";
      var material="MAT-001";
      var proveedor="PROV-001";
      var peso="NUM"+ "  KG";
      var lote="LOTE-001";
      var fechaEmp= dia+ "/" +mes+ "/" + anio;
      var horaEmp= horas + ":" + minutos;
      var molino="21449800";
      var cal1 = ".0984";
      var grado1 = "1008";
      var ancho1 = "46.87";
      var cal2 = ".0980";
      var grado2 = "1008";
      var ancho2 = "47.75";
      var colada ="1903178050";
      var prov ="TERNIUM MEXICO SA DE CV";
      var serie_prov="2A682156GS100";
      var etiqueta ="*90373561*";
      var observ ="Observaciones OK";
      var number="20,905";
      var gsd="SAE I008 * ";

      wind.document.getElementById("number").innerHTML = number;
      wind.document.getElementById("observ").innerHTML = observ;
      wind.document.getElementById("gsd").innerHTML = gsd;
      wind.document.getElementById("prov").innerHTML = prov;
      wind.document.getElementById("etiqueta").innerHTML = etiqueta;
      wind.document.getElementById("serie_prov").innerHTML = serie_prov;
      wind.document.getElementById("colada").innerHTML = colada;
      wind.document.getElementById("cal1").innerHTML = cal1;
      wind.document.getElementById("cal2").innerHTML = cal2;
      wind.document.getElementById("grado1").innerHTML = grado1;
      wind.document.getElementById("grado2").innerHTML = grado2;
      wind.document.getElementById("ancho1").innerHTML = ancho1;
      wind.document.getElementById("ancho2").innerHTML = ancho2;
      wind.document.getElementById("molino").innerHTML = molino;
      wind.document.getElementById("fechaEmp").innerHTML = fechaEmp;
      wind.document.getElementById("horaEmp").innerHTML = horaEmp;
      
      setTimeout(function(){ 
        wind.print();
        wind.close();
      }, 3000); 
    
    }

    });
});