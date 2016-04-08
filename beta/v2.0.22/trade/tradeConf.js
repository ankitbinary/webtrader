define(["lodash","jquery","moment","websockets/binary_websockets","common/rivetsExtra","charts/chartingRequestMap","text!trade/tradeConf.html","css!trade/tradeConf.css"],function(a,b,c,d,e,f,g){function h(a,b){function e(e){a.ticks.array.push({quote:e.quote,epoch:e.epoch,number:a.ticks.array.length+1,tooltip:c.utc(1e3*e.epoch).format("dddd, MMM D, HH:mm:ss")+"<br/>"+b.symbol_name+" "+e.quote}),--f,0===f&&(a.ticks.update_status(),a.buy.update(),a.back.visible=!0,d.events.off("tick",i)),"Digits"!==a.ticks.category&&a.ticks.update_status()}var f=1*b.tick_count,g=b.symbol,h=1*a.buy.purchase_time,i=d.events.on("tick",function(a){0===f||!a.tick||a.tick.symbol!==g||1*a.tick.epoch<h||e(a.tick)})}function i(c,d,f,i){var j=b(g),k=c.buy,l={title:{text:"Contract Confirmation"},buy:{message:k.longcode,balance_after:k.balance_after,buy_price:k.buy_price,purchase_time:k.purchase_time,start_time:k.start_time,transaction_id:k.transaction_id,payout:k.payout,currency:d.currency,potential_profit:k.payout-k.buy_price,potential_profit_text:"Profit",show_result:!1},spreads:{amount_per_point:k.amount_per_point||"0",stop_loss_level:k.stop_loss_level||"0",stop_profit_level:k.stop_profit_level||"0"},ticks:{array:[],average:function(){for(var a=this.array,b=0,c=0;c<a.length;++c)b+=1*a[c].quote;var d=b/(a.length||1);return d},getPlotX:function(){var a=this.array.length;return 1===a?{value:a,label:"Entry Spot"}:a===this.tick_count?{value:a,label:"Exit Spot"}:null},getPlotY:function(){var a=this.array.length,b=this.array[a-1];if("Up/Down"===this.category&&1===a)return{value:1*b.quote,label:"Barrier ("+b.quote+")",id:"plot-barrier-y"};if("Asians"===this.category){var c=this.average().toFixed(5);return{value:c,label:"Average ("+c+")",id:"plot-barrier-y"}}return null},tick_count:d.tick_count,value:(d.digits_value||"0")+"",category:d.category,category_display:d.category_display,status:"waiting",chart_visible:d.show_tick_chart},arrow:{visible:!d.show_tick_chart&&"Digits"!==d.category},back:{visible:!1}};l.buy.update=function(){var a=l.ticks.status;l.title.text={waiting:"Contract Confirmation",won:"This contract won",lost:"This contract lost"}[a],"lost"===a&&(l.buy.potential_profit=-l.buy.buy_price,l.buy.payout=0,l.buy.potential_profit_text="Lost"),"won"===a&&(l.buy.balance_after=1*k.balance_after+1*l.buy.payout),l.buy.show_result=!0},l.ticks.update_status=function(){var b=a.head(l.ticks.array).quote+"",c=a.last(l.ticks.array).quote+"",d=l.ticks.value+"",e=l.ticks.average().toFixed(5),f=l.ticks.category,g=l.ticks.category_display,h={Digits:{matches:a.last(c)===d,differs:a.last(c)!==d,over:1*a.last(c)>1*d,under:1*a.last(c)<1*d,odd:1*a.last(c)%2===1,even:1*a.last(c)%2===0},"Up/Down":{rise:1*c>1*b,fall:1*b>1*c},Asians:{"asian up":1*c>e,"asian down":e>1*c}};l.ticks.status=h[f][g]?"won":"lost"},l.back.onclick=function(){i(j)},l.arrow.onclick=function(a){var c=b(a.target);c.addClass("disabled"),require(["viewtransaction/viewTransaction"],function(a){a.init(d.contract_id,d.transaction_id).then(function(){c.removeClass("disabled")})})},l.arrow.visible?l.back.visible=!0:h(l,d);e.bind(j[0],l);f(j)}require(["websockets/stream_handler"]);f.barsTable;return e.binders["tick-chart"]={priority:65,bind:function(a){var b=this.model;a.chart=new Highcharts.Chart({title:"",credits:{enabled:!1},chart:{type:"line",renderTo:a,backgroundColor:null,width:1*(a.getAttribute("width")||350),height:1*(a.getAttribute("height")||120)},tooltip:{formatter:function(){var a=b.array[this.x-1];return a&&a.tooltip||!1}},xAxis:{type:"linear",min:1,max:1*a.getAttribute("tick-count")+1,labels:{enabled:!1}},yAxis:{labels:{align:"left",x:0},title:"",gridLineWidth:0},series:[{data:[]}],exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1}})},routine:function(b,c){var d=this.model,e=function(a,b){a.xAxis[0].addPlotLine({value:b.value,id:b.id||b.value,label:{text:b.label||"label"},color:b.color||"#e98024",width:b.width||2})},f=function(a,b){a.yAxis[0].addPlotLine({id:b.id||b.label,value:b.value,label:{text:b.label,align:"center"},color:"green",width:2})},g=c.length;if(0!=g){var h=a.last(c);b.chart.series[0].addPoint([g,1*h.quote]);var i=d.getPlotX();i&&e(b.chart,i);var j=d.getPlotY();j&&b.chart.yAxis[0].removePlotLine(j.id),j&&f(b.chart,j)}}},{init:i}});