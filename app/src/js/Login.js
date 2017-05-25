//-------------------------------------------------------------------
// ログイン用モジュール
//  2013/6/XX  Ver1.0    Created By M.Nishimura
//  2017/5/25  Ver1.1    リファクタリング
//
//  機能：ログイン時に必要となる画面等の制御を行う。
//-------------------------------------------------------------------
var EmpCd;
var OperateDate;
onload = init;
onunload = dbClose;

function init() {
    //初期設定をする関数
    resizeTo(1280, 800);
    dbConnect(); //データベース接続
    //作業予定・日報登録リンクボタン処理
    document.getElementById("linkTaskPlan").onclick = function() {
        winOpen("DailyPlanInput.html");
    }
    document.getElementById("linkDailyReport").onclick = function () {
        winOpen("DailyReport.html");
    }
    document.getElementById("linkReportView").onclick = function () {
        winOpen("DailyReportViewer.html");
    }
    document.getElementById("linkTasksum").onclick = function () {
        winOpen("DailyReportDownload.html");
    }
    document.getElementById("linkOvertimesum").onclick = function () {
        winOpen("OverTimeDownload.html");
    }


    EmpdataDisplay();  
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
//終了処理
    dbClose();
    (window.open('', '_self').opener = window).close();
}