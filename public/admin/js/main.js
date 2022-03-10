let recorder;
let speechRecognizer;
let isCanSendData = false;
let isCanStop;
let articleName;
$(function () {
    const params = {
        signCallback: signCallback, // 鉴权函数 用户提供鉴权函数，不传则为null
        // 用户参数
        secretid:  config.secretId,
        appid: config.appId,
        // 实时识别接口参数
        engine_model_type : '16k_zh', // 引擎
        voice_format : 1,
        // 以下为非必填参数，可跟据业务自行修改
        hotword_id : '08003a00000000000000000000000000',
        needvad: 1,
        filter_dirty: 1,
        filter_modal: 1,
        filter_punc: 1,
        convert_num_mode : 1,
        word_info: 2
    }
    $('#start').on('click', function () {
      articleName = $('.form-control').prop('value');
      console.log(articleName);
      $('.input-group-lg').css('display','block');
        const areaDom = $('#recognizeText');
        let resultText = '';
        $(this).hide();
        $('#connecting').show();
        speechRecognizer = null;
        isCanSendData = false;
        // 获取录音数据
        recorder = new WebRecorder();
        recorder.OnReceivedData = (res) => {
          // console.log(res) // res 为采集到浏览器数据
          if (isCanSendData) {
            // 发送数据
            speechRecognizer.write(res);
          }
        };
        // 录音失败时
        recorder.OnError = (err) => {
          console.log(err);
          recorder.stop();
        };
        recorder.start();

      if (!speechRecognizer) {
        speechRecognizer = new SpeechRecognizer(params);
      }

      // 开始识别
      speechRecognizer.OnRecognitionStart = (res) => {
        console.log('开始识别', res);
        isCanSendData = true;
        isCanStop = true;
        $('#connecting').hide();
        $('#end').show();
        $('#recognizing').show();
      };
      // 一句话开始
      speechRecognizer.OnSentenceBegin = (res) => {
        console.log('一句话开始', res);
      };
      // 识别变化时
      speechRecognizer.OnRecognitionResultChange = (res) => {
        // console.log('识别变化时', res);
        const currentText = `${resultText}${res.voice_text_str}`;
        areaDom.text(currentText);
      };
      // 一句话结束
      speechRecognizer.OnSentenceEnd = (res) => {
        console.log('一句话结束', res);
        let sentenses = JSON.stringify(res);
        resultText += res.voice_text_str;
            resultText +='。';
        areaDom.text(resultText);
        $.ajax({
          type:'post',
          url:'/admin/uploadWords',
          data:{article:resultText,sentense:sentenses,articleName:articleName},
          success:function(response){
            // console.log(response);
          },
          error:function(xhr){
            // console.log(xhr);
          }
        })
      };
      // 识别结束
      speechRecognizer.OnRecognitionComplete = (res) => {
        console.log('识别结束', res);
        isCanSendData = false;
      };
      // 识别错误
      speechRecognizer.OnError = (res) => {
        console.log('识别失败', res);
        isCanSendData = false;

        $('#end').hide();
        $('#recognizing').hide();
        $('#start').show();
      };

      // 建立连接
      speechRecognizer.start();

    });
    $('#end').on('click', function () {
        $(this).hide();
        $('#start').show();
        $('#recognizing').hide();
        recorder.stop();
        if (isCanStop) {
          speechRecognizer.stop();
        }
    });
    $('#bodycontent').children('div').css('display','none');
    $('#recognizeText').css('display','block');

    $('#showWord').on('click',function(){
      $('.nav-tabs').children('li').removeClass('active');
      $('#showWord').addClass('active');
      $('#bodycontent').children('div').css('display','none');
      $('#recognizeText').css('display','block');
    })
    $('#showTree').on('click',function(){
      $('.nav-tabs').children('li').removeClass('active');
      $('#showTree').addClass('active');
      $('#bodycontent').children('div').css('display','none');
      $('#treecontainer').css('display','block');
$.ajax({
  type:'post',
  url:'/admin/treeShow', 
  success:function(response){
    rootData=JSON.parse(response);
    console.log(rootData);
    
    var child=document.getElementById("product_tree");
    child.innerHTML = '';
    getData(rootData);
  },
  error:function(xhr){
    console.log(xhr);
  }
})
    })
    $('#showFish').on('click',function(){
      $('.nav-tabs').children('li').removeClass('active');
      $('#showFish').addClass('active');
      $('#bodycontent').children('div').css('display','none');
    })
    $('.input-group-lg').on('change',function(){
      $('#audiostart').css('display','block');
    })
});
