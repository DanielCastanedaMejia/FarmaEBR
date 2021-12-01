sap.ui.define([
	"jquery.sap.global",
    "sap/m/MessageBox",
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/demo/webapp/model/formatter"
], function (jQuery,MessageBox,BaseController, JSONModel, MessageToast, formatter) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.generarEBR", {
        formatter: formatter,
        onInit: function () {
            this._getUsuario("username");
                    var operador=this.obtenerUsuario();
                    //console.log(operador);
                    //var oRouter = this.getRouter();
                    //oRouter.getRoute("generarEBR").attachMatched(this._onRouteMatched, this);

            this._sValidPath="http://localhost:8010/proxy/XMII/CM/FARMA/POS/documentos/FormatoEBR.pdf" 
            //this._sValidPath = sap.ui.require.toUrl("http://localhost:8010/proxy/XMII/CM/FARMA_EBR/MII-Launchpad/files/EBR_SinCaratula_SoloLogoInicial_Separado_Ok.pdf");
            //this._sInvalidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerEmbedded") + "/sample_nonexisting.pdf";
            this._oModel = new JSONModel({
                Source: this._sValidPath,
                Title: "Formato EBR",
                Height: "600px"
            });
            this.getView().setModel(this._oModel);

            var oModel = this.getOwnerComponent().getModel("ordersModel");

            this.byId("PPOrders_list").setModel(oModel);
        },

 onIniciar: function(){
	var current_operator=this.getView().byId("operadorCombo").getSelectedItem();
            var current_sup=this.getView().byId("supervisorCombo").getSelectedItem();
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

                    oThis.getView().byId(id).setValue(nombre + ' ' + apellido);
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



	onGenerarEBR: function(){

		var current_operatorS=this.getView().byId("operadorReal").getValue();
            	var current_supS=this.getView().byId("supervisor").getSelectedItem();
            	var current_maquinaS=this.getView().byId("maquina").getSelectedItem();
		var current_tripS=this.getView().byId("tripulacion").getSelectedItem();
		console.log(current_maquinaS+"--"+current_operatorS+"--"+current_supS+"--"+current_tripS);

		if(current_operatorS!=null && current_supS!=null && current_maquinaS!=null && current_tripS!=null){

		var current_operator=this.getView().byId("operadorReal").getValue();
		var current_sup=this.getView().byId("supervisor").getSelectedItem().getText();
		console.log(current_operator);
var t_ciclo=this.getView().byId("tiempoCiclo").getValue();
var t_inyeccion=this.getView().byId("tiempoInyeccion").getValue();
var t_sostenimiento=this.getView().byId("tiempoSostenimiento").getValue();
var t_enfriamiento=this.getView().byId("tiempoEnfriamiento").getValue();
var p_maxima=this.getView().byId("presionMaxima").getValue();
var t_aceite=this.getView().byId("temperaturaAceite").getValue();
var t_entrada=this.getView().byId("temperaturaEntrada").getValue();
var p_entrada=this.getView().byId("presionEntrada").getValue();

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
    var hora= fecha + " " + horas+":"+ minutos + ":" + segundos;

  var wind = window.open("", "prntExample");

var lines = ' <head>\
<meta charset="utf-8" />\
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\
    <title>SAP MII- Generar EBR</title>\
    <meta name="description" content="">\
    <meta name="viewport" content="width=device-width">\
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">\
</head>\
<body>\
  <div class="row">\
         <img src="images/bayco.PNG" width="30%">\
</div>\
  <div class="table-responsive">\
  <table class="table table-hover">\
  <tr class="active">\
         <th>5. VERIFICACIÓN PROCESO DE INYECCIÓN DE PREFORMA</th>\
  </tr>\
  <tr>\
    <td>5.1 Verificar al inicio del lote las siguientes condiciones de operación del Equipo Inyección Husky, y registrar lo indicado. </td>\
  </tr>\
</table>\
</div>\
   <div class="table-responsive">\
 <table class="table table-bordered">\
 <tr class="active">\
<th>Registro</th>\
   <th>Valor Encontrado</th>\
   <th>Hora</th>\
   <th>Realizado por</th>\
   <th>Verificado por</th>\
 </tr>\
 <tr>\
      <td>Tiempo de Ciclo (min)</td>\
      <td><span id="valor1"></span></td>\
      <td><span id="HoraFin1"></span></td>\
      <td><span id="realizo1"></span></td>\
      <td><span id="verifico1"></span></td>\
 </tr>\
 <tr>\
    <td>Tiempo de Inyección (min)</td>\
    <td><span id="valor2"></span></td>\
    <td><span id="HoraFin2"></span></td>\
      <td><span id="realizo2"></span></td>\
      <td><span id="verifico2"></span></td>\
 </tr>\
 <tr>\
   <td>Tiempo total de Sostenimiento (min)</td>\
   <td><span id="valor3"></span></td>\
   <td><span id="HoraFin3"></span></td>\
      <td><span id="realizo3"></span></td>\
      <td><span id="verifico3"></span></td>\
 </tr>\
 <tr>\
   <td>Tiempo de Enfriamiento (min)</td>\
   <td><span id="valor4"></span></td>\
   <td><span id="HoraFin4"></span></td>\
      <td><span id="realizo4"></span></td>\
      <td><span id="verifico4"></span></td>\
 </tr>\
 <tr>\
   <td>Presión Máxima de Inyección (Pa)</td>\
   <td><span id="valor5"></span></td>\
   <td><span id="HoraFin5"></span></td>\
      <td><span id="realizo5"></span></td>\
      <td><span id="verifico5"></span></td>\
 </tr>\
 <tr>\
      <td>Cojín de inyección</td>\
      <td><span id="valor6"></span></td>\
      <td><span id="HoraFin6"></span></td>\
      <td><span id="realizo6"></span></td>\
      <td><span id="verifico6"></span></td>\
 </tr>\
 <tr>\
      <td>Temperatura de Aceite (°C)</td>\
      <td><span id="valor7"></span></td>\
      <td><span id="HoraFin7"></span></td>\
      <td><span id="realizo7"></span></td>\
      <td><span id="verifico7"></span></td>\
 </tr>\
 <tr>\
      <td>Tiempo de marcha del Husillo (min)</td>\
      <td><span id="valor8"></span></td>\
      <td><span id="HoraFin8"></span></td>\
      <td><span id="realizo8"></span></td>\
      <td><span id="verifico8"></span></td>\
 </tr>\
 <tr>\
      <td>Temperatura de entrada Agua Helada a Maquina (°C)</td>\
      <td><span id="valor9"></span></td>\
      <td><span id="HoraFin9"></span></td>\
      <td><span id="realizo9"></span></td>\
      <td><span id="verifico9"></span></td>\
 </tr>\
 <tr>\
      <td>Presión entrada de agua Helada a Maquina (bar)</td>\
      <td><span id="valorA"></span></td>\
      <td><span id="HoraFinA"></span></td>\
      <td><span id="realizoA"></span></td>\
      <td><span id="verificoA"></span></td>\
 </tr>\
 <tr>\
      <td>Presión de aire entrada a Maquina (bar)</td>\
      <td><span id="valorB"></span></td>\
      <td><span id="HoraFinB"></span></td>\
      <td><span id="realizoB"></span></td>\
      <td><span id="verificoB"></span></td>\
 </tr>\
 <tr>\
      <td>Nivel de tolva</td>\
      <td><span id="valorC"></span></td>\
      <td><span id="HoraFinC"></span></td>\
      <td><span id="realizoC"></span></td>\
      <td><span id="verificoC"></span></td>\
 </tr>\
 </table>\
</div>\
  </body>';


wind.document.write(lines);

wind.document.getElementById("valor1").innerHTML = t_ciclo;
wind.document.getElementById("valor2").innerHTML = t_inyeccion;
wind.document.getElementById("valor3").innerHTML = t_sostenimiento;
wind.document.getElementById("valor4").innerHTML = t_enfriamiento;
wind.document.getElementById("valor5").innerHTML = p_maxima;
wind.document.getElementById("valor7").innerHTML = t_aceite;
wind.document.getElementById("valor9").innerHTML = t_entrada;
wind.document.getElementById("valorB").innerHTML = p_entrada;
wind.document.getElementById("HoraFin1").innerHTML = hora;
wind.document.getElementById("HoraFin2").innerHTML = hora;
wind.document.getElementById("HoraFin3").innerHTML = hora;
wind.document.getElementById("HoraFin4").innerHTML = hora;
wind.document.getElementById("HoraFin5").innerHTML = hora;
wind.document.getElementById("HoraFin6").innerHTML = hora;
wind.document.getElementById("HoraFin7").innerHTML = hora;
wind.document.getElementById("HoraFin8").innerHTML = hora;
wind.document.getElementById("HoraFin9").innerHTML = hora;
wind.document.getElementById("HoraFinA").innerHTML = hora;
wind.document.getElementById("HoraFinB").innerHTML = hora;
wind.document.getElementById("HoraFinC").innerHTML = hora;
wind.document.getElementById("realizo1").innerHTML = current_operator;
wind.document.getElementById("verifico1").innerHTML = current_sup;
wind.document.getElementById("realizo2").innerHTML = current_operator;
wind.document.getElementById("verifico2").innerHTML = current_sup;
wind.document.getElementById("realizo3").innerHTML = current_operator;
wind.document.getElementById("verifico3").innerHTML = current_sup;
wind.document.getElementById("realizo4").innerHTML = current_operator;
wind.document.getElementById("verifico4").innerHTML = current_sup;
wind.document.getElementById("realizo5").innerHTML = current_operator;
wind.document.getElementById("verifico5").innerHTML = current_sup;
wind.document.getElementById("realizo6").innerHTML = current_operator;
wind.document.getElementById("verifico6").innerHTML = current_sup;
wind.document.getElementById("realizo7").innerHTML = current_operator;
wind.document.getElementById("verifico7").innerHTML = current_sup;
wind.document.getElementById("realizo8").innerHTML = current_operator;
wind.document.getElementById("verifico8").innerHTML = current_sup;
wind.document.getElementById("realizo9").innerHTML = current_operator;
wind.document.getElementById("verifico9").innerHTML = current_sup;
wind.document.getElementById("realizoA").innerHTML = current_operator;
wind.document.getElementById("verificoA").innerHTML = current_sup;
wind.document.getElementById("realizoB").innerHTML = current_operator;
wind.document.getElementById("verificoB").innerHTML = current_sup;
wind.document.getElementById("realizoC").innerHTML = current_operator;
wind.document.getElementById("verificoC").innerHTML = current_sup;
setTimeout(function(){ 
        wind.print();
wind.close();
//wind.document.getElementById("imprimible").style.display = "none";
    }, 2000); 

}else{
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				"Debe de llenar los campos obligatorios"
			);
	}


},

	onAfterRendering:function(){
		var op="operadorReal";
		//this.getCurrentUser(op);
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
	        return CadenaNombre;
                    console.log(CadenaNombre);                            
                }
            });
        },

        onShowEbr: function(oEvent) {
            var othis = this;
            if(!this.ebrDialog) {
                this.ebrDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.EbrPdf"
                });
            }
            this.ebrDialog.then(function(oDialog) {

                if(!othis.byId("PPOrders_list").getSelectedItem()){
                    MessageToast.show("Seleccione una orden");
                    return;
                }
                var oItem = othis.byId("PPOrders_list").getSelectedItem(),
                    oContext = oItem.getBindingContext(),
                    sPath = oContext.getPath(),
                    oModel = othis.getOwnerComponent().getModel("ordersModel"),
                    sProp = oModel.getProperty(sPath + "/EBR_STATUS"),
                    sSrc;

                switch(sProp) {
                    case "1":
                        sSrc = "http://baycomiidemo.ddns.net:50000/XMII/CM/FARMAP/POS/files/EBR_1.pdf";
                        break;
                    case "2":
                        sSrc = "http://baycomiidemo.ddns.net:50000/XMII/CM/FARMAP/POS/files/EBR_2.pdf";
                        
                        break;
                    case "3":
                        sSrc = "http://baycomiidemo.ddns.net:50000/XMII/CM/FARMAP/POS/files/EBR_3.pdf";
                        break;
                    case "4":
                        sSrc = "http://baycomiidemo.ddns.net:50000/XMII/CM/FARMAP/POS/files/EBR_4.pdf";
                        break;
                    case "5":
                        sSrc = "http://baycomiidemo.ddns.net:50000/XMII/CM/FARMAP/POS/files/EBR_5.pdf";
                        break;
                    default:
                        return;
                }

                othis.getView().byId("ebrPdfView").setSource(sSrc);
                oDialog.open();
            });
        },
        onCloseEbr: function() {
            this.byId("ebrDialog").close();
        }
 
    });
});


      