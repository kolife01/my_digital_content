// import contractABI from './contract_abi.js';

let userAccount;
async function startApp(){
    var contractAddress = "0x87Bde3670587e2B013fd2CdFb830c09F60e3Fc30";
    contract = new web3js.eth.Contract(contractABI, contractAddress);

    const result = await sampleResolve();
    $('.segment').dimmer('show');
    $('.segment').dimmer('hide');
};

function sampleResolve(userAccount) {
    return new Promise(resolve => {
        web3.eth.getAccounts((error, accounts) => {
            if (accounts[0] !== userAccount) {
                userAccount = accounts[0];
                console.log(userAccount);
                // userAccount = "";
                resolve(userAccount);
            };
        });  
    });
};

window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log("MetamaskOK")
        web3js = new Web3(web3.currentProvider);
    } else {
        console.log("NG")
        alert("Please start up the Metamask and connect to the Mainnet.")
    }
    startApp()
    $('.segment').dimmer('show');
    $('.segment').dimmer('hide');

})


//スマートコントラクト部
$(document).on("click", "#confirm", function () {
    token(); 
});

async function token(account){
  const result = await sampleResolve();
  const img_url = await readFile(this);
  const url = await ipfs_test(img_url);
  
  
  contract.methods.mintTokenCollection(url)
      .send({ from: result, gasLimit: "340000" })
      .on("transactionHash", function (_receipt) {
          alert("Now your Token Collection is being published. txhash:" + _receipt);
          console.log("txhash: " + _receipt)
      })
      .on("receipt", function (_receipt) {
          console.log(_receipt);
      })
      .on("error", function (_error) {
          console.log(_error);
      })
      $('.segment').dimmer('hide');
};



var ipfs = window.IpfsApi({ host: 'ipfs.infura.io', protocol: 'https' });


function readFile(input) {
  return new Promise(resolve => {

  var digitalArt = document.getElementById("publish");
  var idxDot = digitalArt.value.lastIndexOf(".") + 1;
  var extFile = digitalArt.value.substr(idxDot, digitalArt.value.length).toLowerCase();
  if (extFile == "jpeg" || extFile == "png"|| extFile == "jpg" || extFile == "gif") {
      
    $('.segment').dimmer('show');
      var reader = new FileReader();
      reader.readAsArrayBuffer(digitalArt.files[0]);
      reader.onloadend = function (event) {
          console.log(reader.result)
          var buf = buffer.Buffer(reader.result)
          ipfs.add(buf, (err, result) => {
            imageHash = result[0].hash;
            var url = "https://ipfs.io/ipfs/" + imageHash;
            console.log(url);
            resolve(url)
          });
      }
  } else {
      alert("Only jpeg/gif/png files are allowed!");
      $('.segment').dimmer('hide');
  }
  })
}

//IPFSにトークンURIを登録
function ipfs_test(img_url){
  return new Promise(resolve => {
  
  var e_name = document.getElementById('e_name').value;
  var e_desc = document.getElementById('e_desc').value;
//   console.log(e_name);
//   console.log(e_desc);
  
  var text ='{\n'
  +'"name": "'+ e_name +'",\n'
  +'"image": "' + img_url + '",\n'
  + '"description": "'+ e_desc + '"\n'
  +'}'  
  
  console.log(text);
  var buf = buffer.Buffer(string_to_utf8_bytes(text));
  ipfs.add(buf, (err, result) => {
          textHash = result[0].hash;
          var url = "https://ipfs.io/ipfs/" + textHash;
          message.innerHTML = "You can share your image by following link";

          console.log("Metadata: " + url)
          resolve(url)
      });
  })
}

function string_to_utf8_bytes(text){
  var result = [];
  if (text == null)
      return result;
  for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c <= 0x7f) {
          result.push(c);
      } else if (c <= 0x07ff) {
          result.push(((c >> 6) & 0x1F) | 0xC0);
          result.push((c & 0x3F) | 0x80);
      } else {
          result.push(((c >> 12) & 0x0F) | 0xE0);
          result.push(((c >> 6) & 0x3F) | 0x80);
          result.push((c & 0x3F) | 0x80);
      }
  }
  return result;
}

function check(){

    $('.form')
    //後で
    .form({
        on: 'blur',
        fields: {
        name: {
            identifier  : 'name',
            rules: [
            {
                type   : 'empty',
                prompt : 'Please enter a value'
            }
            ]
        },
        desc: {
            identifier  : 'desc',
            rules: [
            {
                type   : 'empty',
                prompt : 'Please select a dropdown value'
            }
            ]
        },
        checkbox: {
            identifier  : 'checkbox',
            rules: [
            {
                type   : 'checked',
                prompt : 'Please check the checkbox'
            }
            ]
        }
        }
    });
}



//----------------------market----------------------//


function get() {
  
  for(var i = 1; i <= 5; i++){
    //tokenidの最後をどのように取得するか
    console.log("i=" +i)
    console.log("go")
    // await geturi(i);

    contract.methods.tokenURI(i).call().then(function (_val) {
      // return new Promise(resolve => {
      console.log(_val);
      array.push(_val);
      console.log(array)
    // })
    });
  }
  // resolve(array.length)
  // console.log(array.length)

}



function geturi(){
  contract.methods.tokenURI(1).call().then(function (_val) {
    
    console.log(_val);
  });
}

function get2() {
    var v = 3;
    contract.methods.tokenURI(v).call().then(function (_val) {
      // array.push(_val);
      console.log(_val);
      // console.log(array)
    });
  }

// var link = document.getElementById("link");
// var link3 = document.getElementById("link3");
// var text3 = link3.innerHTML;
  
var array = [
]

// $("#show").click(function () {
//     // readFile(this);
    
    
//     await getJSON2();
    
// });

$("#show").on("click",function(){
    getJSON2();
});

async function getJSON2(){
  await get();
}

$("#test").click(async function () {

var len = array.length;
    console.log(len)
    console.log(1)
    for(var i=0; i < 5; i++){
    getJSON(array[i]);
}
});




function getJSON(url) {
  console.log("hey")
  var req = new XMLHttpRequest();		  // XMLHttpRequest オブジェクトを生成する
  req.onreadystatechange = function() {		  // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
    if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
      // alert(req.responseText);		          // 取得した JSON ファイルの中身を表示
      var data = JSON.parse(req.responseText);
      console.log(data.name)
      console.log(data.image)
      console.log(data.description)

      var str ="";

      str += '<div class="ui card" >';
      str +=  '<a class="image" href="" >';
      str +=      '<img src="'+ data.image +'">';
      str +=   '</a>';
      str +=  '<div class="content">';
      str +=    '<a class="header">'+ data.name +'</a>';
      str +=  '<div class="meta">';
      str +=   '<span class="date">カテゴリー</span>';
      str +=  '</div>';
      str +=  '<div class="description">'+ data.description+'</div>';
      str +=  '</div>';
      str +=   '<div class="extra content"><span class="right floated"> <i class="heart outline like icon"></i> 17 likes </span> <p class="price">㆔0.1</p></div>';
      str += '</div>'

      $("#output").append(str);
      console.log(3)
    }
  };
  req.open("GET", url, false); // HTTPメソッドとアクセスするサーバーのURLを指定
  req.send(null);					    // 実際にサーバーへリクエストを送信
}
