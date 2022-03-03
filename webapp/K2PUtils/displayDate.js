			todaydate: function() {
				var todayDate = new Date();
				var myyear = todayDate.getYear();
				var mymonth = todayDate.getMonth() + 1;
				var mytoday = todayDate.getDate();
				document.write(myyear + "/" + mymonth + "/" + mytoday);
			}