import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import {SignupPage } from '../../pages/signup/signup';

import * as firebase from 'firebase';

import {DataProvider} from "../../providers/data/data";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private account : any = {
    email : '',               //변수를 선언하고 html에 ngModel에서 입력받은 값을 저장받는다.
    password : ''
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private loader: DataProvider, 
    public alertCtrl: AlertController) {
  } //레퍼렌스를 만들어줌()안에

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){

    this.loader.show();
    firebase.auth().signInWithEmailAndPassword(this.account.email, this.account.password)
     .then((result) => {
      console.log(result);
      })
      .catch((error) => {
        var errorCode = error.code; 
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-passworkd'){
          alert('잘못된 패스워드입니다')
        } else {
          alert(errorMessage);
        }
      console.log(errorMessage);
    });
    this.loader.hide();
  }

  signup(){
   this.navCtrl.push(SignupPage); //이렇게 하면 사인업페이지로 이동하게 된다. ionic에서는 기본적으로 push(가야할페이지)와 pop(반대로 갔던페이지에서 돌아올때 쓰임)을 사용한다
  }                               //navCtrl에 있는 navController에서 제공하는 기능이다. //pop은 로그인페이지에서 다시 

  resetEmail(){
    let alert = this.alertCtrl.create({
      title: 'Reset password',
      message : '패스워드를 재설정 링크를 받을 이메일을 주소를 입력하여 주세요.',
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '확인',
          handler: data => {
           var auth = firebase.auth();
           var emailAddress = data.email;

           auth.sendPasswordResetEmail(emailAddress).then(() => {
            let alert = this.alertCtrl.create({
              title: 'Password Reset email',
              subTitle: '사용자가 입력한 이메일로 패스워드 재설정 메일이 전송되었습니다. 확인해 주시기 바랍니다.',
              buttons: ['Dismiss']
            });
            alert.present();
           }). catch((error) => {

           });
            }
          }
      ]
    });
    alert.present();


 }
}

//아이오닉에서는 페이지 이동은 Push와 풋을 사용합니다. NavController에서 제공한다