define(["jquery","jquery-ui","color-picker","ddslick"],function(a){function b(){a(this).dialog("close"),a(this).find("*").removeClass("ui-state-error")}function c(c,d){require(["css!charts/indicators/aroonosc/aroonosc.css"]);var e=function(a,b,c,d){this.level=a,this.stroke=b,this.strokeWidth=c,this.dashStyle=d},f=[new e(30,"red",1,"Dash"),new e(70,"red",1,"Dash")];require(["text!charts/indicators/aroonosc/aroonosc.html"],function(e){var g="#cd0a0a";e=a(e),e.appendTo("body"),e.find("input[type='button']").button(),e.find("#aroonosc_stroke").colorpicker({part:{map:{size:128},bar:{size:128}},select:function(b,c){a("#aroonosc_stroke").css({background:"#"+c.formatted}).val(""),g="#"+c.formatted},ok:function(b,c){a("#aroonosc_stroke").css({background:"#"+c.formatted}).val(""),g="#"+c.formatted}});var h="Solid";a("#aroonosc_dashStyle").ddslick({imagePosition:"left",width:118,background:"white",onSelected:function(b){a("#aroonosc_dashStyle .dd-selected-image").css("max-width","85px"),h=b.selectedData.value}}),a("#aroonosc_dashStyle .dd-option-image").css("max-width","85px");var i=e.find("#aroonosc_levels").DataTable({paging:!1,scrollY:100,autoWidth:!0,searching:!1,info:!1,columnDefs:[{className:"dt-center",targets:[0,1,2,3]}],aoColumnDefs:[{bSortable:!1,aTargets:[1,3]}]});a.each(f,function(b,c){a(i.row.add([c.level,'<div style="background-color: '+c.stroke+';width:100%;height:20px;"></div>',c.strokeWidth,'<div style="width:50px;overflow:hidden;"><img src="images/dashstyle/'+c.dashStyle+'.svg" /></div>']).draw().node()).data("level",c).on("click",function(){a(this).toggleClass("selected")})}),e.find("#aroonosc_level_delete").click(function(){i.rows(".selected").indexes().length<=0?require(["jquery","jquery-growl"],function(a){a.growl.error({message:"Select level(s) to delete!"})}):i.rows(".selected").remove().draw()}),e.find("#aroonosc_level_add").click(function(){require(["indicator_levels"],function(b){b.open(c,function(b){a.each(b,function(b,c){a(i.row.add([c.level,'<div style="background-color: '+c.stroke+';width:100%;height:20px;"></div>',c.strokeWidth,'<div style="width:50px;overflow:hidden;"><img src="images/dashstyle/'+c.dashStyle+'.svg" /></div>']).draw().node()).data("level",c).on("click",function(){a(this).toggleClass("selected")})})})})}),e.dialog({autoOpen:!1,resizable:!1,width:350,modal:!0,my:"center",at:"center",of:window,dialogClass:"aroonosc-ui-dialog",buttons:[{text:"OK",click:function(){var c=a(".aroonosc_input_width_for_period");if(!_.isInteger(_.toNumber(c.val()))||!_.inRange(c.val(),parseInt(c.attr("min")),parseInt(c.attr("max"))+1))return require(["jquery","jquery-growl"],function(a){a.growl.error({message:"Only numbers between "+c.attr("min")+" to "+c.attr("max")+" is allowed for "+c.closest("tr").find("td:first").text()+"!"})}),void c.val(c.prop("defaultValue"));var d=[];a.each(i.rows().nodes(),function(){var b=a(this).data("level");b&&d.push({color:b.stroke,dashStyle:b.dashStyle,width:b.strokeWidth,value:b.level,label:{text:b.level}})});var f={period:parseInt(e.find(".aroonosc_input_width_for_period").val()),stroke:g,strokeWidth:parseInt(e.find("#aroonosc_strokeWidth").val()),dashStyle:h,levels:d};a(a(".aroonosc").data("refererChartID")).highcharts().series[0].addIndicator("aroonosc",f),b.call(e)}},{text:"Cancel",click:function(){b.call(this)}}]}),e.find("select").selectmenu({width:120}),"function"==typeof d&&d(c)})}return{open:function(b){return 0==a(".aroonosc").length?void c(b,this.open):void a(".aroonosc").data("refererChartID",b).dialog("open")}}});