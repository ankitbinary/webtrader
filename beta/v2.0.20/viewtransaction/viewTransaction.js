define(["jquery","windows/windows","websockets/binary_websockets","portfolio/portfolio","charts/chartingRequestMap","common/rivetsExtra","moment","lodash","jquery-growl","common/util"],function(a,b,c,d,e,f,g,h){"use strict";function i(a,b){var c=[],d="";if(b.history){d="line";for(var e=b.history,f=e.times,g=e.prices,i=0;i<f.length;++i)c.push([1e3*f[i],1*g[i]])}b.candles&&(d="candlestick",c=b.candles.map(function(a){return[1e3*a.epoch,1*a.open,1*a.high,1*a.low,1*a.close]}));var j=b.title,k=a.find(".transaction-chart")[0],b={credits:{href:"https://www.binary.com",text:"Binary.com"},chart:{type:"line",renderTo:k,backgroundColor:null,width:0,height:0,events:{load:function(){this.credits.element.onclick=function(){window.open("https://www.binary.com","_blank")}}}},title:{text:j,style:{fontSize:"16px"}},tooltip:{xDateFormat:"%A, %b %e, %H:%M:%S GMT"},xAxis:{type:"datetime",categories:null,startOnTick:!1,endOnTick:!1,min:h.first(c)[0],max:h.last(c)[0],labels:{overflow:"justify",format:"{value:%H:%M:%S}"}},yAxis:{labels:{align:"left",x:0,y:-2},title:""},series:[{name:j,data:c,type:d}],exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1},navigator:{enabled:!0},plotOptions:{line:{marker:{radius:2}},candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},rangeSelector:{enabled:!1}},l=new Highcharts.Chart(b);return l.addPlotLineX=function(a){l.xAxis[0].addPlotLine({value:a.value,id:a.id||a.value,label:{text:a.label||"label",x:a.text_left?-15:5},color:a.color||"#e98024",width:a.width||2})},l.addPlotLineY=function(a){l.yAxis[0].addPlotLine({id:a.id||a.label,value:a.value,label:{text:a.label,align:"center"},color:a.color||"green",width:2})},k.chart=l}function j(a){return c.cached.send({trading_times:(new Date).toISOString().slice(0,10)}).then(function(b){for(var c=b.trading_times.markets,d=0;d<c.length;++d)for(var e=c[d].submarkets,f=0;f<e.length;++f)for(var g=e[f].symbols,h=0;h<g.length;++h)if(g[h].symbol===a)return g[h].name;return"Transaction"})}function k(a,b){return c.send({ticks_history:a,granularity:0,style:"ticks",start:b,end:b+2,count:1})["catch"](function(a){})}function l(b,d){return new Promise(function(e,f){c.cached.send({proposal_open_contract:1,contract_id:b}).then(function(a){var b=a.proposal_open_contract;b.transaction_id=d,b.symbol=b.underlying,j(b.symbol).then(function(a){b.symbol_name=a,n(b),e()})["catch"](function(a){f()})})["catch"](function(b){a.growl.error({message:b.message}),f()})})}function m(a,b){{var c=a.proposal_open_contract,d=c.contract_id;c.bid_price}d===b.contract_id&&(b.is_sold_at_market&&(c.is_expired=1,c.is_valid_to_sell=0),c.validation_error?b.validation=c.validation_error:c.is_expired?b.validation="This contract has expired":c.is_valid_to_sell&&(b.validation="Note: Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price."),b.table.current_spot=c.current_spot,b.table.current_spot_time=c.current_spot_time,b.table.bid_price=c.bid_price,b.sell.bid_prices.length>40&&b.sell.bid_prices.shift(),b.sell.bid_prices.push(c.bid_price),b.sell.bid_price.value=c.bid_price,b.sell.bid_price.unit=c.bid_price.split(/[\.,]+/)[0],b.sell.bid_price.cent=c.bid_price.split(/[\.,]+/)[1],b.sell.is_valid_to_sell=!1,b.sell.is_valid_to_sell=c.is_valid_to_sell,b.chart.manual_reflow())}function n(e){require(["text!viewtransaction/viewTransaction.html"],function(g){var h=a(g),i=p(e,h),j=function(a){m(a,i)},k=b.createBlankWindow(h,{title:e.symbol_name+" ("+e.transaction_id+")",width:700,minWidth:490,minHeight:370,destroy:function(){},close:function(){l&&l.unbind(),c.events.off("proposal_open_contract",j);for(var b=0;b<i.onclose.length;++b)i.onclose[b]();a(this).dialog("destroy").remove()},open:function(){d.proposal_open_contract.subscribe(),c.events.on("proposal_open_contract",j)},resize:function(){i.chart.manual_reflow()},"data-authorized":"true"});k.dialog("open");var l=f.bind(h[0],i)})}function o(b,d){b.sell.sell_at_market_enabled=!1,require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"]),c.send({sell:b.contract_id,price:0}).then(function(c){var e=c.sell;require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"],function(c){var g=b.table.buy_price,h={longcode:b.longcode,buy_price:g,sell_price:e.sold_for,return_percent:(100*(e.sold_for-g)/g).toFixed(2)+"%",transaction_id:e.transaction_id,balance:e.balance_after,currency:b.table.currency},i=a(c);d.after(i);var j=f.bind(i[0],h);b.onclose.push(function(){j&&j.unbind()})})})["catch"](function(b){a.growl.error({message:b.message})})}function p(a,b){var d={route:{value:"table",update:function(a){d.route.value=a}},contract_id:a.contract_id,longcode:a.longcode,validation:a.validation_error||!a.is_valid_to_sell&&"Resale of this contract is not offered"||a.is_expired&&"This contract has expired"||"-",table:{is_expired:a.is_expired,currency:(a.currency||"USD")+" ",current_spot_time:void 0,current_spot:void 0,date_start:a.date_start,date_expiry:a.date_expiry,entry_tick:a.entry_tick||a.entry_spot,entry_tick_time:a.entry_tick_time,exit_tick:a.exit_tick,exit_tick_time:a.exit_tick_time,buy_price:a.buy_price&&formatPrice(a.buy_price),bid_price:void 0,final_price:a.sell_price&&formatPrice(a.sell_price),tick_count:a.tick_count,prediction:a.prediction,sell_time:void 0,sell_spot:void 0,sell_price:void 0,is_sold_at_market:!1},chart:{chart:null,symbol:a.symbol,symbol_name:a.symbol_name,barrier:a.barrier,high_barrier:a.high_barrier,low_barrier:a.low_barrier,loading:"Loading "+a.symbol_name+" ...",type:"ticks"},sell:{bid_prices:[],bid_price:{unit:void 0,cent:void 0,value:void 0},sell_at_market_enabled:!0,is_valid_to_sell:!1},onclose:[]};d.sell.sell=function(){o(d,b)},d.chart.manual_reflow=function(){var a=-1*(b.find(".longcode").height()+b.find(".tabs").height()+b.find(".footer").height())-16;if(d.chart.chart){var c=b,e=c.width(),f=c.height();d.chart.chart.setSize(e,f+a,!1),d.chart.chart.hasUserSize=null}};var e=r(d,b);return c.send({profit_table:1,date_from:a.date_start,date_to:a.date_start+1}).then(function(b){var c=b.profit_table.transactions||[];if(c=c.filter(function(b){return b.contract_id+""==a.contract_id+""}),c&&1===c.length){var f=c[0];f.sell_time>=a.date_expiry||(d.table.sell_time=f.sell_time,d.table.sell_price=f.sell_price,d.table.sell_spot="-",d.table.final_price=void 0,d.table.is_sold_at_market=!0,d.validation="This contract has expired",e.then(function(){d.chart.chart.addPlotLineX({value:1e3*d.table.sell_time,label:"Sell Time"})}),k(d.chart.symbol,d.table.sell_time-2).then(function(a){var b=a.history;1===b.times.length&&(d.table.sell_spot=b.prices[0])}))}})["catch"](function(a){}),d}function q(b,d){var f=e.keyFor(b.chart.symbol,d);if(e[f])e.subscribe(f);else{var g={symbol:b.chart.symbol,subscribe:1,granularity:d,style:0===d?"ticks":"candles"};e.register(g)["catch"](function(b){a.growl.error({message:b.message})})}var h=void 0,i=void 0;0===d?h=c.events.on("tick",function(a){if(a.tick&&a.tick.symbol===b.chart.symbol){var c=b.chart.chart,d=a.tick;c&&c.series[0].addPoint([1e3*d.epoch,1*d.quote]),1*d.epoch>1*b.table.date_expiry&&k()}}):i=c.events.on("ohlc",function(a){var c=e.keyFor(a.ohlc.symbol,a.ohlc.granularity);if(f==c){var d=b.chart.chart;if(d){var g=d.series[0],h=g.data[g.data.length-1],i=a.ohlc,j=[1e3*i.open_time,1*i.open,1*i.high,1*i.low,1*i.close];h.x!=j[0]?g.addPoint(j,!0,!0):h.update(j,!0),1*i.epoch>1*b.table.date_expiry&&k()}}});var j=!1,k=function(){j||(j=!0,e.unregister(f),h&&c.events.off("tick",h),i&&c.events.off("candles",i))};b.onclose.push(k)}function r(a,b){var d=(a.table,Math.min(1*a.table.date_expiry,g.utc().unix())-a.table.date_start),e=0,f=0;e=3600>=d?0:7200>=d?60:21600>=d?120:86400>=d?300:3600,f=0===e?Math.max(3,30*d/3600|0):3*e;var j={ticks_history:a.chart.symbol,start:a.table.date_start-f,end:a.table.date_expiry?1*a.table.date_expiry+f:"latest",style:"ticks",count:4999};return 0!==e&&(j.granularity=e,j.style="candles",a.chart.type="candles"),a.table.is_expired||q(a,e),c.send(j).then(function(c){a.chart.loading="";var d={title:a.chart.symbol_name};c.history&&(d.history=c.history),c.candles&&(d.candles=c.candles);var e=i(b,d);c.history&&!a.table.entry_tick_time&&(a.table.entry_tick_time=c.history.times.filter(function(b){return 1*b>1*a.table.date_start})[0],a.table.entry_tick||(a.table.entry_tick=c.history.prices.filter(function(b,d){return 1*c.history.times[d]>1*a.table.date_start})[0])),c.candles&&!a.table.entry_tick_time&&k(a.chart.symbol,a.table.date_start).then(function(b){var c=b.history;1===c.times.length&&(a.table.entry_tick_time=c.times[0],e.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot"}))}),c.history&&!a.table.exit_tick_time&&a.table.is_expired&&(a.table.exit_tick_time=h.last(c.history.times.filter(function(b){return 1*b<=1*a.table.date_expiry})),a.table.exit_tick=h.last(c.history.prices.filter(function(b,d){return 1*c.history.times[d]<=1*a.table.date_expiry}))),c.candles&&!a.table.exit_tick_time&&k(a.chart.symbol,a.table.date_expiry-2).then(function(b){var c=b.history;1===c.times.length&&(a.table.exit_tick_time=c.times[0],a.table.exit_tick=c.prices[0],e.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot",text_left:!0}))}),a.table.entry_tick_time&&e.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot"}),a.table.exit_tick_time&&e.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot",text_left:!0}),a.table.date_expiry&&e.addPlotLineX({value:1e3*a.table.date_expiry,label:"End Time"}),a.table.date_start&&e.addPlotLineX({value:1e3*a.table.date_start,label:"Start Time",text_left:!0}),a.chart.barrier&&e.addPlotLineY({value:1*a.chart.barrier,label:"Barrier ("+a.chart.barrier+")"}),a.chart.high_barrier&&e.addPlotLineY({value:1*a.chart.high_barrier,label:"High Barrier ("+a.chart.high_barrier+")"}),a.chart.low_barrier&&e.addPlotLineY({value:1*a.chart.low_barrier,label:"Low Barrier ("+a.chart.low_barrier+")",color:"red"}),a.chart.chart=e,a.chart.manual_reflow()})["catch"](function(b){a.chart.loading=b.message})}return require(["css!viewtransaction/viewTransaction.css"]),require(["text!viewtransaction/viewTransaction.html"]),{init:l}});