sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (MessageBox,BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.Reportes.registroPesos", {
     
	onRegistroPesos: function(){

		var current_operatorS=this.getView().byId("operadorReal").getValue();
            	var current_supS=this.getView().byId("supervisor").getSelectedItem();
            	var current_maquinaS=this.getView().byId("maquina").getSelectedItem();
		var current_tripS=this.getView().byId("tripulacion").getSelectedItem();
		console.log(current_maquinaS+"--"+current_operatorS+"--"+current_supS+"--"+current_tripS);

		if(current_operatorS!=null && current_supS!=null && current_maquinaS!=null && current_tripS!=null){
			var current_operator=this.getView().byId("operadorReal").getValue();
			var current_sup=this.getView().byId("supervisor").getSelectedItem().getText();
			var peso1=this.getView().byId("peso1").getValue();
			var peso2=this.getView().byId("peso2").getValue();
			var peso3=this.getView().byId("peso3").getValue();
			var peso4=this.getView().byId("peso4").getValue();
			var peso5=this.getView().byId("peso5").getValue();
			var peso6=this.getView().byId("peso6").getValue();
			var peso7=this.getView().byId("peso7").getValue();
			var peso8=this.getView().byId("peso8").getValue();
			var peso9=this.getView().byId("peso9").getValue();
			var peso10=this.getView().byId("peso10").getValue();

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

    var fecha= dia+ "/" +mes+ "/" + anio;
    var tiempo= horas+":"+ minutos + ":" + segundos;
    var hora= fecha + " " + horas+":"+ minutos + ":" + segundos;

var wind = window.open("", "prntExample");

var lines = ' <head>\
<meta charset="utf-8" />\
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\
    <title>SAP MII- Reporte de Pesos</title>\
    <meta name="description" content="">\
    <meta name="viewport" content="width=device-width">\
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">\
    <link rel="stylesheet" type="text/css" href="css/custom.css">\
</head>\
<body>\
<br>\
<br>\
<br>\
<br>\
<br>\
  <div class="row">\
         <img src="images/bayco.PNG" width="70%" class="img-responsive center-block">\
</div>\
<br>\
  <div>\
	<h2 class="text-center"><em>SAP Manufacturing Integration and Intelligence</em></h2>\
<br>\
<br>\
<br>\
<br>\
	<h2 class="text-center">Industria Farmacéutica</h2>\
<br>\
<br>\
<br>\
 <h2 class="text-center"><strong>REGISTRO DE PESOS</strong></h2>\
  </div>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
  <div class="row">\
         <img src="images/bayco.PNG" width="30%">\
</div>\
<br>\
<div class="table-responsive">\
<table class="table table-hover">\
<tr class="active">\
       <th>6. VERIFICACIÓN DE PESO E INSPECCIÓN VISUAL DE PREFORMA</th>\
</tr>\
<tr>\
  <td>6.1 Realizar al Inicio de lote y cada 6 horas la verificación de peso e Inspección visual de la preforma a las 72 cavidades del equipo de inyección,  registrar el resultado en el espacio correspondiente.<p><p>6.2 En caso de encontrar alguna desviación notificar inmediatamente al Supervisor  de Procesos. </td>\
</tr>\
</table>\
</div>\
<div class="row">\
</div>\
<div class="table-responsive">\
<table class="table table-hover">\
<tr class="active">\
     <th>  6.3 VERIFICAR VIGENCIA DE CALIBRACIÓN DE LOS INSTRUMENTOS ANTES DE SU USO</th>\
</tr>\
</table>\
</div>\
<div class="table-responsive">\
<table class="table table-bordered">\
<tr class="active">\
       <th>Parámetro</th>\
       <th>Actual</th>\
       <th>Realizado</th>\
       <th>Fecha</th>\
       <th>Verificado</th>\
       <th>Fecha</th>\
</tr>\
<tr>\
  <td>Báscula/Balanza ID</td>\
  <td><span id="actual1"></span></td>\
  <td><span id="realizo01"></span></td>\
  <td><span id="fechaRealizado1"></span></td>\
  <td><span id="verificado01"></span></td>\
  <td><span id="fechaVerificado1"></span></td>\
</tr>\
<tr>\
  <td>Marco de Pesas ID</td>\
  <td><span id="actual2"></span></td>\
  <td><span id="realizo02"></span></td>\
  <td><span id="fechaRealizado2"></span></td>\
  <td><span id="verificado02"></span></td>\
  <td><span id="fechaVerificado2"></span></td>\
</tr>\
</table>\
</div>\
<div class="row">\
</div>\
<div class="table-responsive">\
<table class="table table-hover">\
<tr class="active">\
     <th>  6.4 REGISTRO DE PESOS</th>\
</tr>\
</table>\
</div>\
<div class="table-responsive">\
<table class="table table-bordered">\
<tr class="active">\
<th>Cavidad</th>\
<th>Rango de pesos</th>\
</tr>\
<tr>\
     <td>1</td>\
     <td><span id="peso1"></span></td>\
</tr>\
<tr>\
     <td>2</td>\
     <td><span id="peso2"></span></td>\
</tr>\
<tr>\
     <td>3</td>\
     <td><span id="peso3"></span></td>\
</tr>\
<tr>\
     <td>4</td>\
     <td><span id="peso4"></span></td>\
</tr>\
<tr>\
     <td>5</td>\
     <td><span id="peso5"></span></td>\
</tr>\
<tr>\
     <td>6</td>\
     <td><span id="peso6"></span></td>\
</tr>\
<tr>\
     <td>7</td>\
     <td><span id="peso7"></span></td>\
</tr>\
<tr>\
     <td>8</td>\
     <td><span id="peso8"></span></td>\
</tr>\
<tr>\
     <td>9</td>\
     <td><span id="peso9"></span></td>\
</tr>\
<tr>\
     <td>10</td>\
     <td><span id="peso10"></span></td>\
</tr>\
</table>\
</div>\
  <div class="row">\
         <img src="images/bayco.PNG" width="30%">\
</div>\
<br>\
<div class="table-responsive">\
<table class="table table-hover">\
<tr class="active">\
  <th>Cantidad Producto encontrado (defectos)</th>\
</tr>\
</table>\
</div>\
<div class="table-responsive">\
<table class="table table-bordered">\
<tr class="active">\
<th>Defecto</th>\
<th>6 horas después</th>\
</tr>\
<tr>\
     <td>Partículas incrustadas</td>\
     <td><span id="def1"></span></td>\
</tr>\
<tr>\
     <td>Burbujas</td>\
     <td><span id="def2"></span></td>\
</tr>\
<tr>\
     <td>Manchas</td>\
     <td><span id="def3"></span></td>\
</tr>\
<tr>\
     <td>Deformación de rosca</td>\
     <td><span id="def4"></span></td>\
</tr>\
<tr>\
     <td>Preforma amarilla</td>\
     <td><span id="def5"></span></td>\
</tr>\
<tr>\
     <td>Otros (1)</td>\
     <td><span id="def6"></span></td>\
</tr>\
<tr>\
     <td>Otros (2)</td>\
     <td><span id="def7"></span></td>\
</tr>\
<tr>\
     <td>Otros (3)</td>\
     <td><span id="def8"></span></td>\
</tr>\
<tr>\
     <td>Realizado por</td>\
     <td><span id="def9"></span></td>\
</tr>\
<tr>\
     <td>Fecha</td>\
     <td><span id="def10"></span></td>\
</tr>\
<tr>\
     <td>Hora</td>\
     <td><span id="def11"></span></td>\
</tr>\
</table>\
</div>\
</body>';


wind.document.write(lines);

wind.document.getElementById("realizo01").innerHTML = current_operator;
wind.document.getElementById("realizo02").innerHTML = current_operator;
wind.document.getElementById("fechaRealizado1").innerHTML = hora;
wind.document.getElementById("fechaRealizado2").innerHTML = hora;
wind.document.getElementById("verificado01").innerHTML = current_sup;
wind.document.getElementById("verificado02").innerHTML = current_sup;
wind.document.getElementById("fechaVerificado1").innerHTML = hora;
wind.document.getElementById("fechaVerificado2").innerHTML = hora;
wind.document.getElementById("peso1").innerHTML = peso1;
wind.document.getElementById("peso2").innerHTML = peso2;
wind.document.getElementById("peso3").innerHTML = peso3;
wind.document.getElementById("peso4").innerHTML = peso4;
wind.document.getElementById("peso5").innerHTML = peso5;
wind.document.getElementById("peso6").innerHTML = peso6;
wind.document.getElementById("peso7").innerHTML = peso7;
wind.document.getElementById("peso8").innerHTML = peso8;
wind.document.getElementById("peso9").innerHTML = peso9;
wind.document.getElementById("peso10").innerHTML = peso10;
wind.document.getElementById("def9").innerHTML = current_operator;
wind.document.getElementById("def10").innerHTML = fecha;
wind.document.getElementById("def11").innerHTML = tiempo;


setTimeout(function(){ 
        wind.print();
wind.close();
         //wind.document.getElementById("imprimible").style.display = "none";
    }, 3000); 

	}else{
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				"Debe de llenar los campos obligatorios"
			);
	}
},

        	onInit: function () {
		this._getUsuario("username");
          		var operador=this.obtenerUsuario();
	         	console.log(operador);
            	var oRouter = this.getRouter();
            	oRouter.getRoute("registroPesos").attachMatched(this._onRouteMatched, this);
        	},

	onAfterRendering:function(){
		var op="operadorReal";
		this.getCurrentUser(op);
	},

	onChangeComboMaquina:function(){
		//this.getView().byId("supervisor").setEditable(true);
		//this.getView().byId("tripulacion").setEditable(true);
		var maquinaKey=this.getView().byId("maquina").getSelectedKey();
		this._base_onloadCOMBO("supervisor", {"ID_OBJETO":maquinaKey}, "FARMA_EBR/DatosMaestros/Usuario/Transaction/supervisor_sel", "", "Supervisor"); 	
		this._base_onloadCOMBO("tripulacion", {"ID_OBJETO":maquinaKey}, "FARMA_EBR/DatosMaestros/Usuario/Transaction/tripulacion_sel", "", "Tripulacion"); 	
	},

	onChangeComboSupervisor:function(){
		var maquinaKey=this.getView().byId("maquina").getSelectedKey();
		//this._base_onloadCOMBO("tripulacion", {"ID_OBJETO":maquinaKey}, "FARMA_EBR/DatosMaestros/Usuario/Transaction/tripulacion_sel", "", "Tripulacion"); 	
	},
	
	onInitialState:function(){
		this.getView().byId("supervisor").setEditable(false);
		this.getView().byId("tripulacion").setEditable(false);
		//onNav	Back();
	},

        getCurrentUser: function (id) {
            var oThis = this;

            $.ajax({
                type: "GET",
                url: "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                dataType: "xml",
                cache: false,
                success: function (xml) {
                    var nombre = $(xml).find('Profile').attr('firstname');
                    var apellido = $(xml).find('Profile').attr('lastname');

                    oThis.byId(id).setValue(nombre + ' ' + apellido);
		console.log(nombre + apellido);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("ERROR");
                }
            });
        },

  _onRouteMatched: function (oEvent) {


            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable = oView.byId("GestionTurnoTable");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({});
            //oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/"
            });

            this._base_onloadCOMBO("maquina", {}, "FARMA_EBR/DatosMaestros/Usuario/Transaction/maquina_user_sel", "", "Maquina"); 	
            //this._base_onloadTable("GestionTurnoTable", "", "FARMA_EBR/DatosMaestros/Turno/Transaction/gestion_sel", "Tabla Gestion Turnos", "");           
        },

        onIniciar: function(){
	var current_operator=this.getView().byId("operadorReal").getValue();
            var current_sup=this.getView().byId("supervisor").getSelectedItem();
            var current_maquina=this.getView().byId("maquina").getSelectedItem();
	var current_trip=this.getView().byId("tripulacion").getSelectedItem();
	if(current_operator!=null && current_sup!=null && current_maquina!=null && current_trip!=null){
			MessageBox.success(
				"Sesión iniciada"
			);
var current_operator=this.getView().byId("Imprimir").setEnabled(true);
	}else{

	var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				"Debe de llenar los campos obligatorios"
			);

	}
	},

        obtenerUsuario: function() {
        var server="localhost:8010/proxy";
  	    var operador="";
              jQuery.ajax({
                  type: "GET",
                  url: "http://" + server + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                  dataType: "xml",
                  cache: false,
                  success: function (xml) { // results ready from lookup of current status details in CCstatus
                      operador = $(xml).find('Profile').attr('IllumLoginName');
                      console.log("Obtener User"+ operador);
                      return operador;
                  }
              });
          },

        getTurno: function(operador) {
        var server="localhost:8010/proxy";  
        var idTurno="";
        var t=this;
            $.ajax
                     ({
                         type: "GET",
                         url: "http://" + server + "/XMII/Runner?transaction=FARMA_EBR/Dashboards/OEE/Transaction/TurnoActualTrx&OutputParameter=XMLOutput",
                         dataType: "xml",
                         success: function (xml) {
                             $(xml).find('Row').each(function () {
                                 // Show the data
                                 idTurno = $(this).find('ID_TURNO').text();
                                 console.log("GetTurno"+ idTurno);
                                 t.getOEEGeneral();
                                 //obtenerDatosOperador(operador);
                             });
                         }
                     });
        },

        getOEEGeneral: function() {
          var server="localhost:8010/proxy";
          var desempeno="";
          var disponibilidad="";
          var calidad="";
          var oee="";  
          console.log("Hola"+ idObjeto);
            $.ajax
                     ({
                         type: "GET",
                         url: "http://" + server + "/XMII/Runner?transaction=FARMA_EBR/Dashboards/OEE/Transaction/CalculoOEE&ID_OBJETO=" + idObjeto + "&ID_TURNO=" + idTurno + "&FECHA_INICIO=&FECHA_FIN=&OutputParameter=XMLOutput",
                         dataType: "xml",
                         success: function (xml) {
                             $(xml).find('Row').each(function () {
                                 // Show the data
         		 desempeno = parseFloat($(this).find('PERFORMANCE').text()).toFixed(2);
                                 disponibilidad = parseFloat($(this).find('DISPONIBILIDAD').text()).toFixed(2);
                                 calidad = parseFloat($(this).find('CALIDAD').text()).toFixed(2);
                                 oee = parseFloat($(this).find('OEE').text());
                                 oee = ((desempeno * disponibilidad * calidad) / 10000).toFixed(2);
        console.log("Inside"+disponibilidad);
        												 $('#oeeCalidad').html(calidad+'%');
        						 						$('#oeeDisponibilidad').html(disponibilidad+'%');
        						 						$('#oeeDesempenio').html(desempeno+'%');
        						 						$('#oeeOEE').html(oee+'%');
        
                             });
                             setTimeout(function () {
                                 getOEEGeneral();
                             }, 15000);
                         }
                     });
        },

        getUserInfo: function () {
            var oThis = this;
            jQuery.ajax({
                type: "GET",
                url: "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                dataType: "xml",
                cache: false,
                success: function (xml) { // results ready from lookup of current status details in CCstatus
                    var operador = $(xml).find('Profile').attr('IllumLoginName');
                    var nombrecompleto = $(xml).find('Profile').attr('FullName');                    
                    var CadenaNombre = nombrecompleto.split(',');
                    var Nombre = CadenaNombre[1];
                    var Apellido = CadenaNombre[0];

                    console.log(CadenaNombre);                            
                }
            });
        }

    });
});


      