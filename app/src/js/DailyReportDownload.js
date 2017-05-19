//-------------------------------------------------------------------
// 日報ダウンロード用モジュール
//  2013/6/27  Ver1.0    Created By M.Nishimura
//  2013/11/25 全件ダウンロード時不具合修正  Modified By M.Nishimura
//  2017/3/2   Ver1.4    ヘッダ固定対応(既存コードではヘッダ部が出力されなくなったため)
//  2017/3/9   Ver1.5    リファクタリング(日付関連、従業員コード関連関数を分離)
//
//  機能：保存されている日報明細データをダウンロードする。
//-------------------------------------------------------------------

var EmpCd=location.search.substring(1);     //ログイン画面から担当者CD取得

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
    //日報検索ボタン制御
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportdayF);
    }
    //画面ダウンロードボタン制御
    document.getElementById("btnViewDownload").onclick = function () {
        ViewDownload("download_Dailyview.csv");
    }
    //全件ダウンロードボタン制御
    document.getElementById("btnAllDownload").onclick = function () {
        AllDownload()
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
//*　報告日に日報登録が存在するかを判別して表示する関数
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
    //日報の登録がなければ画面をクリアする
    if(ret == 0){
        TableClear();
    }
   //日報の登録があればデータを表示する。    
    if (ret != 0) {
        TableClear();
        dataDisplay();
    }
}

//*
//*　日報データを表示する関数(2つのデータを合算して表示させているので切出不可)
//*
function dataDisplay() {
    try {
        var EmpId = EmpCd;
        //作業計画登録なし
        var cWork = "－";
        var ReportdayF = document.getElementById('txtReportdayF').value;
        var ReportdayT = document.getElementById('txtReportdayT').value;
        //検索条件チェック
        var rtnc = txtDayCheacker();
        if (!rtnc){
            return;
        }
        var mySql = " SELECT t_dailyreport.ReportID, t_dailyreport.WorkplanID, m_Administration.AdministrationID, m_Administration.AdministrationDetail,"
                    + " m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan, m_Matter.MatterID, m_Matter.MatterName, m_Task.TaskID, m_Task.taskName,"
                    + " t_dailyreport.Dailymemo, t_dailyreport.Reference, t_dailyreport.Reportday, t_dailyreport.Taskstart, t_dailyreport.Taskend,"
                    + " t_dailyreport.Workinghours, m_Emp.Empid, m_Emp.Empname"
                    + " FROM m_Emp INNER JOIN ((t_dailyreport INNER JOIN (((m_Administration INNER JOIN m_ActionPlan ON m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                    + " INNER JOIN m_Matter ON (m_Matter.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) ON (t_dailyreport.MatterID = m_Matter.MatterID)"
                    + " AND (t_dailyreport.ActionplanID = m_ActionPlan.ActionplanID) AND (t_dailyreport.AdministrationID = m_Administration.AdministrationID))"
                    + " INNER JOIN m_Task ON t_dailyreport.TaskID = m_Task.TaskID) ON m_Emp.Empid = t_dailyreport.Empid"
                    + " WHERE (((t_dailyreport.Reportday)>='" + ReportdayF + "' AND (t_dailyreport.Reportday) <= '" + ReportdayT + "') AND ((m_Emp.Empid)='" + EmpId + "')"
                    + " AND ((t_dailyreport.DeleteFlg)='0') AND ((m_Businessyear.ShowFlg)='0')) ORDER BY t_dailyreport.Reportday DESC,t_dailyreport.ReportID;";
        var recordSet = database.Execute(mySql);
        //console.log(mySql);
        var counter = 1;
        while (!recordSet.EOF) {
            var table1 = document.getElementById("table1");
            var row1 = table1.insertRow(counter);
            var outhtml = new Array(19);
            var cellname = new Array(19);
            //日報明細表示
            for (var i = 0; i < 18; i++) {
                var classname = String('D' + i);
                //そのままレコード表示
                if (i ==0 || i == 1){
                    cellname[i] = row1.insertCell(i);
                    cellname[i].setAttribute("class", classname);
                    cellname[i].className = classname;
                    outhtml[i] = '<span id="' + classname + '-' + counter + '">' + recordSet(i) + '</span>';
                    cellname[i].innerHTML = outhtml[i];
                }
                //作業計画表示
                if (i == 2) {
                    var WPMemo = "";
                    if (recordSet(1) == cWork || recordSet(1) == null || recordSet(1) == undefined) {
                        cellname[i] = row1.insertCell(i);
                        cellname[i].setAttribute("class", classname);
                        cellname[i].className = classname;
                        WPMemo = cWork;
                        outhtml[i] = '<span id="' + classname + '-' + counter + '">' + WPMemo + '</span>';
                    } else {

                        mySubSql = " SELECT t_workplan.WorkplanID, t_workplan.Planmemo, t_workplan.Empid, t_workplan.PlanDate, t_dailyreport.Reportday "
                                  + " FROM t_dailyreport INNER JOIN t_workplan ON (t_dailyreport.MatterID = t_workplan.MatterID) AND (t_dailyreport.ActionplanID = t_workplan.ActionplanID)"
                                  + " AND (t_dailyreport.AdministrationID = t_workplan.AdministrationID) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID)"
                                  + " WHERE (((t_workplan.WorkplanID)='" + recordSet(1) + "') AND ((t_workplan.Empid)='" + EmpId + "') AND ((t_workplan.PlanDate)='" + recordSet(12) + "') AND (t_workplan.DeleteFlg='0'));";
                        SubrecordSet = database.Execute(mySubSql);
                        //alert(mySubSql);
                        //console.log(mySubSql);
                        cellname[i] = row1.insertCell(i);
                        cellname[i].setAttribute("class", classname);
                        cellname[i].className = classname;
                        var WPMemo = SubrecordSet(1);
                        outhtml[i] = '<span id="' + classname + '-' + counter + '">' + WPMemo + '</span>';
                        cellname[i].innerHTML = outhtml[i];
                        SubrecordSet.Close();
                        SubrecordSet = null;
                    }
                }
                //1列ずれるので表示箇所を調整
                if (i >= 2) {
                    var k = i + 1;
                    cellname[k] = row1.insertCell(k);
                    cellname[k].setAttribute("class", classname);
                    cellname[k].className = classname;
                    outhtml[k] = '<span id="' + classname + '-' + counter + '">' + recordSet(i) + '</span>';
                    cellname[k].innerHTML = outhtml[k];
                }
            }
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
    } catch(error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*  全件ダウンロード(2つのデータを合算して表示させているので切出不可)
//*
function AllDownload() {
    if (window.confirm('日報明細の全件データをダウンロードします。\nよろしいですか？')) {
        try {
            //テキストファイルをデスクトップに保存
            var fs = new ActiveXObject("Scripting.FileSystemObject");
            var outf = fs.CreateTextFile("download_DailyAll.csv", true);
            var outputFile = "";
            //作業計画登録なし
            var cWork = "－";
            //タイトル部分
            outputFile = outputFile + "\"" + "日報ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業計画ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業計画" + "\"" + ",";
            outputFile = outputFile + "\"" + "基本方針ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "基本方針" + "\"" + ",";
            outputFile = outputFile + "\"" + "行動計画ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "行動計画" + "\"" + ",";
            outputFile = outputFile + "\"" + "案件ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "案件名" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業ID" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業名" + "\"" + ",";
            outputFile = outputFile + "\"" + "実績・補足" + "\"" + ",";
            outputFile = outputFile + "\"" + "関連資料" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業日" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業開始" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業終了" + "\"" + ",";
            outputFile = outputFile + "\"" + "作業時間" + "\"" + ",";
            outputFile = outputFile + "\"" + "担当者CD" + "\"" + ",";
            outputFile = outputFile + "\"" + "担当者名" + "\"" + "\n";
            //検索日チェック
            var ReportdayF = document.getElementById('txtReportdayF').value;
            var ReportdayT = document.getElementById('txtReportdayT').value;
            var rtnc = txtDayCheacker();
            if (!rtnc){
                return;
            }

            var mySql = " SELECT t_dailyreport.ReportID, t_dailyreport.WorkplanID, m_Administration.AdministrationID, m_Administration.AdministrationDetail,"
                    + " m_ActionPlan.ActionplanID, m_ActionPlan.ActionPlan, m_Matter.MatterID, m_Matter.MatterName, m_Task.TaskID, m_Task.taskName,"
                    + " t_dailyreport.Dailymemo, t_dailyreport.Reference, t_dailyreport.Reportday, t_dailyreport.Taskstart, t_dailyreport.Taskend,"
                    + " t_dailyreport.Workinghours, m_Emp.Empid, m_Emp.Empname"
                    + " FROM m_Emp INNER JOIN ((t_dailyreport INNER JOIN (((m_Administration INNER JOIN m_ActionPlan ON m_Administration.AdministrationID = m_ActionPlan.AdministrationID)"
                    + " INNER JOIN m_Matter ON (m_Matter.AdministrationID = m_Administration.AdministrationID) AND (m_ActionPlan.ActionplanID = m_Matter.ActionplanID))"
                    + " INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) ON (t_dailyreport.MatterID = m_Matter.MatterID)"
                    + " AND (t_dailyreport.ActionplanID = m_ActionPlan.ActionplanID) AND (t_dailyreport.AdministrationID = m_Administration.AdministrationID))"
                    + " INNER JOIN m_Task ON t_dailyreport.TaskID = m_Task.TaskID) ON m_Emp.Empid = t_dailyreport.Empid"
                    + " WHERE ((t_dailyreport.Reportday)>='" + ReportdayF + "' AND (t_dailyreport.Reportday) <= '" + ReportdayT + "')"
                    + " AND (t_dailyreport.DeleteFlg='0') AND (m_Businessyear.ShowFlg='0') " 
                    + "ORDER BY t_dailyreport.Reportday DESC,t_dailyreport.ReportID;";
            var recordSet = database.Execute(mySql);
            //alert(mySql);
            //console.log(mySql);
            var counter = 1;
            while (!recordSet.EOF) {
                //日報明細
                for (var i = 0; i < 18; i++) {
                    //そのままレコード出力
                    if (i == 0 || i == 1) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + ",";
                    }
                    //作業計画
                    if (i == 2) {
                        var WPMemo = "";
                        if (recordSet(1) == cWork || recordSet(1) == null || recordSet(1) == undefined) {
                            outputFile = outputFile + "\"" + cWork + "\"" + ",";
                        } else {
                            mySubSql = " SELECT t_workplan.WorkplanID, t_workplan.Planmemo, t_workplan.Empid, t_workplan.PlanDate, t_dailyreport.Reportday "
                                  + " FROM t_dailyreport INNER JOIN t_workplan ON (t_dailyreport.MatterID = t_workplan.MatterID) AND (t_dailyreport.ActionplanID = t_workplan.ActionplanID)"
                                  + " AND (t_dailyreport.AdministrationID = t_workplan.AdministrationID) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID)"
                                  + " WHERE (((t_workplan.WorkplanID)='" + recordSet(1) + "') AND ((t_workplan.Empid)='" + recordSet(16) + "') AND ((t_workplan.PlanDate)='" + recordSet(12) + "') AND (t_workplan.DeleteFlg='0'));";
                            SubrecordSet = database.Execute(mySubSql);
                            //console.log(mySubSql);
                            outputFile = outputFile + "\"" + SubrecordSet(1) + "\"" + ",";
                            SubrecordSet.Close();
                            SubrecordSet = null;
                        }
                    }
                    if (i >= 3) {
                        var k = i - 1;
                        outputFile = outputFile + "\"" + recordSet(k) + "\"" + ",";
                    }
                    //最終カラムの場合は改行
                    if (i == 17) {
                        outputFile = outputFile + "\"" + recordSet(i) + "\"" + "\n";
                    }
                }
                recordSet.MoveNext();
                counter++;
            }
            outf.Write(outputFile);
        } catch (error) {
            alert(error.number + "\n" + error.description);
        } finally {
            recordSet.Close();
            recordSet = null;
            alert("デスクトップにファイルを保存しました。");
            outf.Close();
        }
    } else {
        alert("ダウンロードをキャンセルしました。");
    }
}