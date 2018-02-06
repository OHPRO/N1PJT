import { Injectable } from '@angular/core'; //data인젝션을 위해서 필요 (data injection ; DI)
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

//import {LoadingController} from 'ionic-angular'; 


// 앱 전체에 적용되면 좋을 value, function들을 여기에 적는다. 


@Injectable()
export class DataProvider {

  result:any;
 // private loading : any; // loading은 전역변수로 설정을 해줍니다.(firebase)

  constructor(public _http: HttpClient) {
    
  }

  /* show() {
    this.loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요...'
    });
    this.loading.present();
  }

  hide() {
    this.loading.dismiss();
    }
  } */



  getCoins(coins) {
    let coinlist = '';

    coinlist = coins.join();

    return this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+coinlist+"&tsyms=USD")
      .map(result => this.result = result);
  }

  // Price
    // 하나 이상의 통화 목록에 대한 최신 가격을 확인하십시오. 정말로 빠르다, 20-60 ms. 매 10 초마다 캐시됩니다..
    // CryptoCompare에 API를 사용하고 있다고 보내야 한다.! 
  getCoin(coin) {
    return this._http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+coin+"&tsyms=USD")
      .map(result => this.result = result);
  }

  //HIstoDay
    //개방형, 고가형, 저가형, 폐쇄 형, 볼륨 및 볼륨의 일일 기록 데이터를 가져옵니다. 
    //값은 00:00 GMT 시간을 기준으로합니다. 
    //동전이 지정된 통화로 거래되지 않기 때문에 데이터를 사용할 수없는 경우 BTC 변환을 사용합니다.
    //  //data를 histody에사 갖고옴 USD기준 30일 그리고 1일 
  getChart(coin) {
    return this._http.get("https://min-api.cryptocompare.com/data/histoday?fsym="+coin+"&tsym=USD&limit=30&aggregate=1")
    .map(result => this.result = result);
  }

  allCoins() {
    let headers = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*");

      return this._http.get("https://www.cryptocompare.com/api/data/coinlist/", {headers: headers})
        .map(result => this.result = result);
  }

}