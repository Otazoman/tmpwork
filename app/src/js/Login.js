//-------------------------------------------------------------------
// ログイン用モジュール
//  2013/6/XX  Ver1.0    Created By M.Nishimura
//　2013/12/18          Ver1.3  残業時間管理機能追加 
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


    EmpCdisplay();
//    dataDisplay();  
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss"); //登録用日時取得
    OperateDate = dateFormat.format(new Date());
}

function OperateEnd() {
//終了処理
    dbClose();
    (window.open('', '_self').opener = window).close();
}


function EmpCdisplay() {
//登録されている社員を表示する関数
    var mySql = "SELECT * FROM m_Emp WHERE ( DeleteFlg Is Null) ORDER BY EmpID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("EmpID").innerHTML = "";
    var tempHtml = "担当者ID：　<select name=\"selectEmpId\" id=\"selectEmpId\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        tempHtml = tempHtml + "\t<option value=\"" + recordSet(0) + "\">" + recordSet(0) + "：" + recordSet(1) + "</option>\n";
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //	console.log(tempHtml);
    document.getElementById("EmpID").innerHTML = tempHtml;
    var selEmpid = document.getElementById("selectEmpId");
    selEmpid.onchange = function () {
        selectEmpIdCdchange(this);
    }
    selEmpid.focus();
    recordSet.Close();
    recordSet = null;
}

function selectEmpIdCdchange(obj) {
//担当者セレクトボックス更新時の処理
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var selEmp = document.getElementById("EmpID");
        alert("担当者を選択してください。");
        selEmp.focus();
        return;
    } else {
        EmpCd = workCd;
    }
}

function winOpen(target_site){
//社員コードを渡して作業計画画面に遷移
    var selEmpid = document.getElementById("selectEmpId");
    if (selEmpid.selectedIndex == 0) {
        alert("担当者を選択してください。");
        selEmpid.focus();
        return;
    } else {
        var child = target_site + "?" + EmpCd;
//        subwin = window.open(child, "subWin", "top=50,left=500,width=1280");
        subwin = window.open(child, "subWin");
    }
}