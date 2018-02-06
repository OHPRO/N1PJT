import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular'; // push, pop, setRoot 3가지를 밑에 규정하면된다.
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';


import * as firebase from 'firebase'

//Root Page는 Home Page 클래스 여기가 루트페이지다.

@Component({
  selector: 'page-home', // 필수적이진 않음 페이지만의 고유의 sytling을 위해 필요.
  templateUrl: 'home.html' //텝플릿 URL을 적어서 사용한다. (적어준 해당 html 파일 내용을 갖어와서 기록되고 HTML 구조가 브라우저에서 보이게 된다)
})
export class HomePage {  //HomePage는 컴포넌트인데 하나의 데코레이터로 작식됨

  detailToggle = [];
  objectKeys = Object.keys;
  coins: Object;
  details: Object;
  likedCoins = [];
  chart = [];

  


// 앱이 실행 될 때, 페이지의 constructor()가 호출됨 
  constructor(public navCtrl: NavController, private _data: DataProvider, private storage: Storage,public loading: LoadingController,private alertCtrl : AlertController) { //provider(service)를 page에서 사용하도록 property로 설정. 로딩과정에서 여러 속성들을 정의할 때 사용
    this.storage.remove('likedCoins');   
  }   // @compoent { template:...} 부분이 표시된 것이다. // 다시말해서 data injection이라고 한다. 이것을 사용하기 위해서는 import를 해야지만 사용할 수 있다.

    // movePage() {
    //  this.navCtrl.push(commentPage) //commentPage 대신에 commentPage가 보이게 되는 것이다. 
    //}

    logout(){   //로그아웃
      // alert 창
      let confirm = this.alertCtrl.create({
        title:'Log out',
        message : 'Log out 하시겠습니까?',
        buttons: [
          {
            text: '아니요',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
           text: '예',
           handler: () => {
            firebase.auth().signOut().then(() => {
              console.log("log out");
            }).catch(function (error) {
              console.log("error");
            });
           } 
          }
        ]
      });
      confirm.present();
    }
  

  ionViewDidLoad() {  //위에서 export class HomePage에서 HomePage가 한번 로딩이 될때 로딩이 완료가 되면 그때서야 출력이 되는 함수

  }

  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {

    let loader = this.loading.create({
      content: 'Refreshing..',
      spinner: 'bubbles'
    });

    loader.present().then(() => {

      this.storage.get('likedCoins').then((val) => {

        // If the value is not set, then:
        if(!val) {
          this.likedCoins.push('BTC','ETH','IOT');
          this.storage.set('likedCoins', this.likedCoins);

          this._data.getCoins(this.likedCoins)
            .subscribe(res => {
              this.coins = res;
              loader.dismiss();
            })
        }
        // It's set
        else {
          this.likedCoins = val;

          this._data.getCoins(this.likedCoins)
          .subscribe(res => {
            this.coins = res;
            loader.dismiss();
          })
        }

      });

    });

  }

  coinDetails(coin,index) {

    if (this.detailToggle[index])
      this.detailToggle[index] = false;
    else {
      this.detailToggle.fill(false);
      this._data.getCoin(coin)
        .subscribe(res => {
          this.details = res['DISPLAY'][coin]['USD'];

          this.detailToggle[index] = true;

          this._data.getChart(coin)
          .subscribe(res => {
  
            console.log(res);
  
            let coinHistory = res['Data'].map((a) => (a.close));
            
            setTimeout(()=> {
              this.chart[index] = new Chart('canvas'+index, {
                type: 'line',
                data: {
                  labels: coinHistory,
                  datasets: [{ 
                      data: coinHistory,
                      borderColor: "#3cba9f",
                      fill: false
                    }
                  ]
                },
                options: {
                  tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return "$" + tooltipItems.yLabel.toString();
                        }
                      }
                    },
                    responsive: true, 
                    legend: {
                      display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false
                    }],
                    yAxes: [{
                      display: false
                    }],
                  }
                }
              });
            }, 250);
          
          });


        });


      }

  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item) {
      return item !== coin
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }



}
