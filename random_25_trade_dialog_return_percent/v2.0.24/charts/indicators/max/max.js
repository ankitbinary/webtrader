define(["jquery","jquery-ui","color-picker","ddslick"],function(a){function b(){a(this).dialog("close"),a(this).find("*").removeClass("ui-state-error")}function c(c,d){require(["css!charts/indicators/max/max.css"]),require(["text!charts/indicators/max/max.html"],function(e){var f="#cd0a0a";e=a(e),e.appendTo("body"),e.find("input[type='button']").button(),e.find("#max_stroke").colorpicker({part:{map:{size:128},bar:{size:128}},select:function(b,c){a("#max_stroke").css({background:"#"+c.formatted}).val(""),f="#"+c.formatted},ok:function(b,c){a("#max_stroke").css({background:"#"+c.formatted}).val(""),f="#"+c.formatted}});var g="Solid";a("#max_dashStyle").ddslick({imagePosition:"left",width:138,background:"white",onSelected:function(b){a("#max_dashStyle .dd-selected-image").css("max-width","105px"),g=b.selectedData.value}}),a("#max_dashStyle .dd-option-image").css("max-width","105px"),e.dialog({autoOpen:!1,resizable:!1,modal:!0,width:280,my:"center",at:"center",of:window,dialogClass:"max-ui-dialog",buttons:[{text:"OK",click:function(){var c=a(".max_input_width_for_period");if(!_.isInteger(_.toNumber(c.val()))||!_.inRange(c.val(),parseInt(c.attr("min")),parseInt(c.attr("max"))+1))return require(["jquery","jquery-growl"],function(a){a.growl.error({message:"Only numbers between "+c.attr("min")+" to "+c.attr("max")+" is allowed for "+c.closest("tr").find("td:first").text()+"!"})}),void c.val(c.prop("defaultValue"));var d={period:parseInt(e.find(".max_input_width_for_period").val()),stroke:f,strokeWidth:parseInt(e.find("#max_strokeWidth").val()),dashStyle:g,appliedTo:parseInt(e.find("#max_appliedTo").val())};a(a(".max").data("refererChartID")).highcharts().series[0].addIndicator("max",d),b.call(e)}},{text:"Cancel",click:function(){b.call(this)}}]}),e.find("select").selectmenu({width:140}),"function"==typeof d&&d(c)})}return{open:function(b){return 0==a(".max").length?void c(b,this.open):void a(".max").data("refererChartID",b).dialog("open")}}});