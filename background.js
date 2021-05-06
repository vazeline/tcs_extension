$(function(){
var interval = setInterval(function(){
	if(/.*\/invest\/stocks\/.+\/events\//.test(location.href)){
		if($("table.tinvest-count_stocks").length !== 0)
			return;

		var amntAll = 0;
		var currency = '';
		$('div[class^=SecurityCommonBlocks__content]')
		.find('div>span[class^=Money__money]')
		.each(function(e,i){
			var amount = $(this).text().trim();
			if(!currency){
				currency = amount[amount.length-1];
			}
			var value = amount.replace('−','-')
					.replace(',','.')
					.replace(/[\s]/,'');
					
			var amt = parseFloat(value);
			if(amt !== NaN)
				amntAll += amt;
			else
				$(this).css({'background':'yellow'});
		});
			var contClass = $('div[class^=EventsItem__container]').attr("class");
			$('div[class^=SecurityCommonBlocks__content]:last')
			.prepend('<table class="tinvest-count_stocks ' +contClass+ '" style="font-size:16px"><tr><td>Сумма всех операций:&nbsp;</td><td style="font-weight:bold"> ' + Math.round(amntAll*100)/100 + ' ' + currency +'</td></tr></table>');
		
		
		//alert(amntAll);
	}
	if(/.*\/invest\/margin\/equities/.test(location.href)){
		if($("tbody tr[class*=Table__row_clickable]").length === 0)
			return;
		var btn = $('<button>Добавить в избранное</button>').insertAfter('h1:first-child');
		btn.on('click',function(){
			var getSessionid = function() {
            for (var t = document["co" + "okie"].split(";"); t.length; ) {
                var n = t.pop();
                var r = n.indexOf("=");
                if (r = r < 0 ? n.length : r, decodeURIComponent(n.slice(0, r).replace(/^\s+/, "")) === 'psid')
                    return decodeURIComponent(n.slice(r + 1));
            }
            return null;
			}
			var psid = getSessionid();
			if(!psid)
			{
				alert('не удалось получить id сессии');
			}
			var tickers = [];
			$("tr td:nth-child(1) a span div[data-qa-file='LiquidPapersPure']:nth-child(2)").map(function(x,y){
				var tick = $(y).text();
				if(tick){
					var splitted = tick.split(',');
					if(splitted.length > 1)
					tickers.push(splitted[0]);
				}
			});
			if(!tickers.length){alert('не удалось добавить');return;}
			$.ajax({
					url: "https://www.tinkoff.ru/api/trading//user/add_to_favorites?sessionId=" + psid,
					type: 'post',
					data: JSON.stringify({tickers: tickers}),
					headers: {
						'Content-Type': 'application/json',
					},
					dataType: 'json',
					success: function(data){
						if(data.status === "Ok")
						alert('Добавлено ' + tickers.length + ' бумаг в избранное');
					else alert('Произошла какая-то ошибка , не получилось добавить ;-(');
					}
				});
			
		});
	}
	clearInterval(interval);
	
	
}, 100);
});