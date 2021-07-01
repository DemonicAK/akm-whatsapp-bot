const path = require("path");
const axios = require("axios");
const {
  xreply
} = require(path.join(__dirname, "../xxx"));

function stripTags(string) {
  return string.replace(/<(.|\n)*?>/g, '').trim();
}

function searchTransformer(isIndex) {
  var matcher = '';
  if (isIndex) {
    matcher = /underlying=(.*?)&/;
  } else {
    matcher = /symbol=(.*?)&/;
  }

  return function (data) {
    var matches = data.match(/<li>(.*?)<\/li>/g);
    return matches.map(function (value1) {
      var symbol = value1.match(matcher);
      value1 = stripTags(value1).replace(symbol[1], '');
      return {
        name: value1 || '',
        symbol: symbol[1] || ''
      }
    });
  }
}

async function market(arg,infor,xxxx){
from=infor.from

switch (arg[1]) {
  case "status":
    axios
      .get("https://www1.nseindia.com//emerge/homepage/smeNormalMktStatus.json")
      .then((response) => {
        if (response.error) {
        console.log("err")
        } else {
          var msg ="Market status : ```" + response.data.NormalMktStatus + "```";
          xreply(from,msg,xxxx)        }
      }).catch(err=>{
        console.log(err)
      })
    break;
    case "gainer":
  case "gainers":
    axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json"
      )
      .then((response) => {
        var msg = "*Gainers* 📈";

        if (response.error) {
          console.log("err")
        } else {
          response.data.data.forEach((element) => {
            msg +=
              "\n\n\n📈 " +
              "*" +
              element.symbol +
              "*\n```Open Price: " +
              element.openPrice +
              "```\n" +
              "```High Price: " +
              element.highPrice +
              "```\n" +
              "```Low Price : " +
              element.lowPrice +
              "```\n" +
              "```turnoverInLakhs : " +
              element.turnoverInLakhs +
              "```\n" +
              "```Prev Price: " +
              element.previousPrice +
              "```";
          });
          xreply(from,msg,xxxx)
        }
      }).catch(err=>{
        console.log(err)
      })

    break;
    case "stock":
  case "stocks":
    axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_watch/stock_watch/nifty"
      )
      .then((response) => {
        var msg = "*Index Stocks NIFTY* 📈";
        if (response.error) {
          console.log("err")
        } else {
          response.data.data.forEach((element) => {
            msg +=
              "\n\n\n📈 " +
              "*" +
              element.symbol +
              "*\n```Open Price: " +
              element.open +
              "```\n" +
              "```High Price: " +
              element.high +
              "```\n" +
              "```Low Price : " +
              element.low +
              "```\n" +
              "```Prev Close: " +
              element.previousClose +
              "```\n" +
              "```Traded vol: " +
              element.trdVol +
              "```\n" +
              "```last tP   : " +
              element.ltP +
              "```";
          });
          xreply(from,msg,xxxx)
        }
      }).catch(err=>{
        console.log("err")
        console.log(err)
      })

    break;

  case "losers":
  case "loser":
    axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json"
      )
      .then((response) => {
        var msg = "*Losers* 📈";

        if (response.error) {
          console.log("err")
        } else {
          response.data.data.forEach((element) => {
            msg +=
              "\n\n\n📈 " +
              "*" +
              element.symbol +
              "*\n```Open Price: " +
              element.openPrice +
              "```\n" +
              "```High Price: " +
              element.highPrice +
              "```\n" +
              "```Low Price : " +
              element.lowPrice +
              "```\n" +
              "```Prev Price: " +
              element.previousPrice +
              "```\n"; +
            "```turnoverInLakhs : " + element.turnoverInLakhs + "```";
          });
          xreply(from,msg,xxxx)
        }
      }).catch(err=>{
        console.log(err)
      })

    break;

  case "search":
    axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxCompanySearch.jsp?search=" +
        arg[2].toUpperCase(), {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Referer: "https://www.nseindia.com/ChartApp/install/charts/mainpage.jsp",
            Host: "www.nseindia.com",
          },
         transformResponse: searchTransformer(false),
        }
      )
      .then((response) => {
       
        if (response.error) {
          console.log("err")
        } else {
          console.log(response)
          response.data.forEach((element) => {
            msg ="*Search Result* 🔎\n"+
              "\n\n📈 " +
              "*" +
              element.symbol +
              "*\n\n" +
              "NAME      : ```" +
              element.name +
              "```\n" +
              "SYMBOL  : ```" +
              element.symbol +
              "```";
          });

          xreply(from,msg,xxxx)
        }
      }).catch(err=>{
        console.log("err")
      })
    break;

  case "details":
  case "detail":
    axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?series=EQ&symbol=" +
        arg[2].toUpperCase(), {
          headers: {
            Referer:  "https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?series=EQ&symbol=" + arg[2].toUpperCase(),
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      )
      .then((response) => {

        if (response.error) {
          console.log("err") }
          else if (response.data.data.length==0) {
           msg = "```Not Found```";
           console.log(msg)
          } else {
          element = response.data.data[0];

          msg = "📈 " + element.companyName+
            "\n" +
            "\n```pricebandupr  : " +
            element.pricebandupper +
            "```\n" +
            "```applcblMargin : " +
            element.applicableMargin +
            "```\n" +
            "```dayHigh       : " +
            element.dayHigh +
            "```\n" +
            "```dayLow        : " +
            element.dayLow +
            "```\n" +
            "```basePrice     : " +
            element.basePrice +
            "```\n" +
            "```securityVar   : " +
            element.securityVar +
            "```\n" +
            "```pricebandlower: " +
            element.pricebandlower +
            "```\n" +
            "```lastPrice     : " +
            element.lastPrice +
            "```\n" +
            "```varMargin     : " +
            element.varMargin +
            "```\n" +
            "```totalTradedVol: " +
            element.totalTradedVolume +
            "```\n" +
            "```open          : " +
            element.open +
            "```\n" +
            "```closePrice    : " +
            element.closePrice +
            "```\n" +
            "```faceValue     : " +
            element.faceValue +
            "```\n" +
            "```sellPrice1    : " +
            element.sellPrice1 +
            "```\n" +
            "```sellPrice2    : " +
            element.sellPrice2 +
            "```\n" +
            "```buyPrice1     : " +
            element.buyPrice1 +
            "```\n" +
            "```buyPrice2     : " +
            element.buyPrice2 +
            "```\n" +
            "```high52        : " +
            element.high52 +
            "```\n" +
            "```low52         : " +
            element.low52 +
            "```\n" +
            "```Update Time   : " +
            response.data.lastUpdateTime.split(" ")[1] +
            "```";

            xreply(from,msg,xxxx)     }
      }).catch(err=>{
        console.log(err)
      })
    break;

  default:
    msg =
      "*Usage*" +
      " = " +
      "```.market [options]```\n\n" +
      "```OPTIONS=```\n\n" +
      "status  : " +
      " ```stock market status```\n\n" +
      "gainers : " +
      " ```top 10 gainers of NSE```\n\n" +
      "losers  : " +
      " ```top 10 losers of NSE```\n\n" +
      "stocks  : " +
      " ```info of all companies in a single NSE index```\n\n" +
      "search  [stock symbol]: " +
      " ```list of companies in provided NSE index with matching keyword```\n\n" +
      "details  [stock symbol]: " +
      " ```Get the data of the symbol from NSE```\n\n";

     }





};


/*
(async () => {
   response =await xxx(["market", "status"])
console.log( "Market status : ```" + response.data.NormalMktStatus + "```")
})();

*/
//market(["market","search","tatja"])
module.exports.market=market;