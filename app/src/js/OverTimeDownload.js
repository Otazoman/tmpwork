//-------------------------------------------------------------------
// 残業時間ダウンロード用モジュール
//  2013/12/18  Ver1.0    Created By M.Nishimura
//  2017/3/2    Ver1.1    ヘッダ固定対応(既存コードではヘッダ部が出力されなくなったため)
//  2017/3/9    Ver1.2    リファクタリング
//                       (日付関連、従業員コード関連、データダウンロード関連関数を分離)
//
//  機能：保存されている残業時間明細データをダウンロードする。
//-------------------------------------------------------------------

var EmpCd = location.search.substring(1);     //ログイン画面から担当者CD取得

onload = init;
onunload = dbClose;

//*
//*　初期設定をする関数
//*
function init() {
    //検索日(自)、検索日(至)表示
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportdayF = document.getElementById("txtReportdayF");
    FromDaySet(txtReportdayF);
    txtReportdayT = document.getElementById("txtReportdayT");
    var NextDay = DayCalculate(txtdate);
    txtReportdayT.value = NextDay;

    //検索日のテキストボックス制御
    txtReportdayF.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    txtReportdayT.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    //残業時間検索ボタン制御
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //画面ダウンロードボタン制御
    document.getElementById("btnViewDownload").onclick = function () {
        ViewDownload("download_overTimeview.csv");
    }
    //全件ダウンロードボタン制御
    document.getElementById("btnAllDownload").onclick = function () {
        OverTimeDownload();
    }
    dbConnect(); //データベース接続
    // 担当者をセットして画面の初期表示
    EmpCdisplay(EmpCd);
    Drawdata();
}

//*
//*　終了処理
//*
function OperateEnd() {
    dbClose();
    (window.open('', '_self').opener = window).close();
}

//*
//*　報告日更新時の処理
//*
function txtDateUpdate(obj) {
     Drawdata();
     obj.style.backgroundColor = "#ffffff";
}

//*
//*　報告日に残業時間登録が存在するかを判別して表示する
//*
function Drawdata() {
    var EmpID = EmpCd;
    var arryCount = 9;
    //報告日チェック
    var ReportdayF = document.getElementById('txtReportdayF').value;
    var ReportdayT = document.getElementById('txtReportdayT').value;
    var rtnc = txtDayCheacker();
    if (!rtnc){
        return;
    }
    //件数チェック
    var countsql = " SELECT COUNT(WorkplanID) AS WIDCount" + " FROM t_workplan"
                 + " WHERE (PlanDate >='" + ReportdayF + "' AND PlanDate <= '" + ReportdayT + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var ret = DisPlayChecker(countsql)
    //残業時間の登録がなければ画面をクリアする
    if(ret == 0){
        TableClear();
    }
   //残業時間の登録があればデータを表示する。    
    if (ret != 0) {
        TableClear();
        //画面表示用SQL
        var drawsql = " SELECT t_Overtime.Empid, m_Emp.Empname, t_Overtime.Workday, t_Overtime.CauseID, m_Cause.CauseMemo, t_Overtime.Memo, t_Overtime.Planhours, t_Overtime.Workinghours "
                        + " FROM (t_Overtime INNER JOIN m_Emp ON t_Overtime.Empid = m_Emp.Empid) INNER JOIN m_Cause ON t_Overtime.CauseID = m_Cause.CauseID "
                        + " WHERE ((t_Overtime.Workday)>='" + ReportdayF + "' AND (t_Overtime.Workday)<='" + ReportdayT + "') AND ((m_Cause.DeleteFlg)='0') AND ((t_Overtime.Empid)='" + EmpID + "') "
                        + " ORDER BY t_Overtime.Workday; ";
        DataDisplay(drawsql,arryCount);
    }
}

//*
//*　全件ダウンロード(担当者以外分)
//*
function OverTimeDownload(){
            var filename = "download_overTimeAll.csv";
            var arrayCount = 7;
            var outputFile = "";
            //タイトル部分
            outputFile = outputFile + "\"" + "担当者CD" + "\"" + ",";
            outputFile = outputFile + "\"" + "担当者名" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業日" + "\"" + ",";
            outputFile = outputFile + "\"" + "残業理由コード" + "\"" + ",";
            outputFile = outputFile + "\"" + "残業理由" + "\"" + ",";
            outputFile = outputFile + "\"" + "残業理由補足" + "\"" + ",";
            outputFile = outputFile + "\"" + "残業申請時間" + "\"" + ",";
            outputFile = outputFile + "\"" + "残業実績時間" + "\"" + "\n";
            //残業時間部分
            var ReportdayF = document.getElementById('txtReportdayF').value;
            var ReportdayT = document.getElementById('txtReportdayT').value;
            //検索条件チェック
            var rtnc = txtDayCheacker();
            if (!rtnc){
                return;
            }
            var mysql = " SELECT t_Overtime.Empid, m_Emp.Empname, t_Overtime.Workday, t_Overtime.CauseID, m_Cause.CauseMemo, t_Overtime.Memo, t_Overtime.Planhours, t_Overtime.Workinghours "
                        + " FROM (t_Overtime INNER JOIN m_Emp ON t_Overtime.Empid = m_Emp.Empid) INNER JOIN m_Cause ON t_Overtime.CauseID = m_Cause.CauseID "
                        + " WHERE (((t_Overtime.Workday)>='" + ReportdayF + "' And (t_Overtime.Workday)<='" + ReportdayT + "') AND ((m_Cause.DeleteFlg)='0')) "
                        + " ORDER BY t_Overtime.Empid, t_Overtime.Workday; ";
            AllDownload(filename,outputFile,mysql,arrayCount);
}