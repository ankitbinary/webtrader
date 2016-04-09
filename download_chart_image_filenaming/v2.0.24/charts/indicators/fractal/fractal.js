define(["jquery","lodash","jquery-ui","color-picker","ddslick"],function(a,b){function c(){a(this).dialog("close"),a(this).find("*").removeClass("ui-state-error")}function d(d,e){require(["css!charts/indicators/fractal/fractal.css"]),require(["text!charts/indicators/fractal/fractal.html"],function(f){var g="#cd0a0a";f=a(f),f.appendTo("body"),f.find("input[type='button']").button(),f.find("#fractal_color").colorpicker({part:{map:{size:128},bar:{size:128}},select:function(b,c){a(this).css({background:"#"+c.formatted}).val(""),defaultStrokeColor="#"+c.formatted},ok:function(b,c){a(this).css({background:"#"+c.formatted}).val(""),defaultStrokeColor="#"+c.formatted}}),f.dialog({autoOpen:!1,resizable:!1,width:315,modal:!0,my:"center",at:"center",of:window,dialogClass:"fractal-ui-dialog",buttons:[{text:"OK",click:function(){var d=a("#number_of_bars");if(!b.inRange(d.val(),parseInt(d.attr("min")),parseInt(d.attr("max"))))return void require(["jquery","jquery-growl"],function(a){a.growl.error({message:"Only numbers between "+d.attr("min")+" to "+d.attr("max")+" is allowed for "+d.closest("tr").find("td:first").text()+"!"})});if(0===Math.abs(parseInt(d.val()%2)))return void require(["jquery","jquery-growl"],function(a){a.growl.error({message:"The number of bars on sides should an odd number!"})});var e=a(a(".fractal").data("refererChartID")).highcharts().series[0],h={numberOfBars:parseInt(d.val()),color:g,onSeriesID:e.options.id};e.addIndicator("fractal",h),c.call(f)}},{text:"Cancel",click:function(){c.call(this)}}]}),b.isFunction(e)&&e(d)})}return{open:function(b){return 0==a(".fractal").length?void d(b,this.open):void a(".fractal").data("refererChartID",b).dialog("open")}}});