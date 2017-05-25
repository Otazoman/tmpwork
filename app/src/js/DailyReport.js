//-------------------------------------------------------------------
// 日報登録用モジュール
//  2013/6/12           Ver1.0  Created By M.Nishimura
//  2013/7/3            Ver1.1  日報ID表示部分改善(不具合対応)、レコード復活対応
//　2013/12/2           Ver1.2  定型作業登録、呼出機能追加
//　2013/12/18          Ver1.3  残業時間管理機能追加 
//  2017/2/27           Ver1.4  上部メニュー固定化に伴う要素数取得の不具合修正
//  2017/5/25           Ver1.5  別日付登録ロジック不具合修正
//
//  機能：日報登録画面の制御等を行う
//-------------------------------------------------------------------

var EmpCd = location.search.substring(1);     //ログイン画面から担当者CD取得

onload = init;
onunload = dbClose;

//*
//* 追加ボタン押下時に入力項目を追加する。
//*
var ItemField = {
    //div要素の中で最大のitemNOを取得してcurrentNumberにセットする。
    currentNumber: 0,
    itemTemplate: '<table border="1" style ="width:1200px" ><tr><td>日報ID　:<input type="text" name="txtReportCd__count__" id="txtReportCd__count__" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="" \/>'
                 + '作業計画ID　:<input type="text" name="txtPlanCd__count__" id="txtPlanCd__count__" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="－" \/>'
                 + '案件:<span id="MatterCdDisplay__count__"></span>'
                 + '<span id="MatterDisplay__count__"></span>'
                 + '作業:<span id="TaskCdDisplay__count__"></span>'
                 + '<span id="TaskDisplay__count__"></span>'
                 + '<br/>作業予定:<textarea name="txtTaskMemo__count__" id="txtTaskMemo__count__" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">－<\/textarea>'
                 + '実績・補足:<textarea name="txtReportMemo__count__" id="txtReportMemo__count__" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                 + '<input type="button" name="btnStart__count__" id="btnStart__count__" value="開始" onclick="startTimeUpdate(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__)" \/>'
                 + '<input type="button" name="btnEnd__count__" id="btnEnd__count__" value="終了" onclick="endTimeUpdate(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__)" \/>'
                 + '時間:<input type="text" name="txtTime__count__" id="txtTime__count__" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="0" \/>'
                 + '<br/>関連資料:<input type="text" name="txtRefarence__count__" id="txtRefarence__count__" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="－" \/><\/td>'
                 + '<td><input type="button" name="btnInsert__count__" id="btnInsert__count__" value="登録" onclick="btnActionSelect(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__,0)" \/>'
                 + '<input type="button" name="btnDelete__count__" id="btnDelete__count__" value="削除"  onclick="btnActionSelect(txtReportCd__count__.value,txtPlanCd__count__.value,txtReportMemo__count__.value,txtTime__count__.value,txtRefarence__count__.value,__count__,1)" \/>'
                 + '<br/><input type="button" name="btnSTout__count__" id="btnSTout__count__" value="定型作業呼出" onclick="winOpenRoutine(\'Routine.html\',__count__)" \/><\/td><\/tr></table>',
    //項目追加
    add: function () {
        //テキストボックスの最後の要素番号取得
        //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
        var eleNumber = document.getElementsByClassName("table").length - 1;
        this.currentNumber = eleNumber;
        var beforeNumber = eleNumber;
        //テキストフィールド追加
        this.currentNumber++;
        var field = document.getElementById('item' + this.currentNumber);
        var newItem = this.itemTemplate.replace(/__count__/mg, this.currentNumber);
        field.innerHTML = newItem;
        var nextNumber = this.currentNumber + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        new_area.setAttribute("class", "table");
        MatterCdDisplay(this.currentNumber, 0);
        TaskCdDisplay(this.currentNumber, "0");
        field.appendChild(new_area);
        //テキストボックス追加時に作業計画IDにフォーカス
        var nxtfield = document.getElementById('txtReportCd' + this.currentNumber);
        //2番目以降の項目では前行の日報ID値を取得する。
        if (beforeNumber != 0) {
            var beforefield = document.getElementById('txtReportCd' + beforeNumber);
            var befvalue = beforefield.value;
        }
        //最新テキストボックスにテキストボックスに表示されているID+1の値を表示する。
        //データベースに登録されている値と最新番号がずれている場合は、日報IDに+1する。
        if (beforeNumber != 0 && befvalue != beforeNumber) {
            var nextNumber = Number(befvalue) + 1;
            nxtfield.value = nextNumber;
        } else {
            nxtfield.value = this.currentNumber;
        }
        //案件セレクトボックスにフォーカス移動
        var nxtMatter = document.getElementById('selectMatter' + this.currentNumber);
        nxtMatter.focus();
    },
    //項目削除
    remove: function () {
        var chkPCdTxtbox = document.getElementById('txtReportCd' + this.currentNumber);
        var chkMCdTxtbox = document.getElementById('txtReportMemo' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        }
        //入力データ存在時はテキストボックス削除不可
        if (chkPCdTxtbox.value == "" && chkMCdTxtbox.value == '') {
            //テキストフィールド削除
            var field = document.getElementById('item' + this.currentNumber);
            field.removeChild(field.lastChild);
            field.innerHTML = '';
            this.currentNumber--;
            //テキストボックス削除時に案件IDにフォーカス
            var beforefield = document.getElementById('txtReportCd' + this.currentNumber);
            if (this.currentNumber == 0) {
                return;
            } //最終行除外
            beforefield.focus();
        } else {
            alert("入力データが存在します");
            var currentfield = document.getElementById('txtReportCd' + this.currentNumber);
            currentfield.focus();
        }
    },
    clear: function () {
        //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
        var clNumber = document.getElementsByClassName("table").length - 1;
        this.currentNumber = clNumber;
        var clfield = document.getElementById('item' + this.currentNumber);
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        this.currentNumber--;
        var clfield = document.getElementById('item' + this.currentNumber);
        if (this.currentNumber == 0) {
            return;
        } //最終行除外
        clfield.removeChild(clfield.lastChild);
    }
}

//*
//*　初期設定をする関数
//*
function init() {
    //報告日表示
    txtReportday = document.getElementById("txtReportday");
    var txtdate = new DateFormat("yyyy/MM/dd");
    txtdate = txtdate.format(new Date());
    txtReportday.value = txtdate;
    //計画日のテキストボックス制御
    txtReportday.onblur = function () {
        this.style.backgroundColor = "#ffffff";
    }
    document.getElementById("btnDaySearch").onclick = function () {
        txtDateUpdate(txtReportday);
    }
    document.getElementById("btnDailyPlan").onclick = function () {
        winOpen("DailyPlanInput.html");
    }
    document.getElementById("btnSumWorkTime").onclick = function () {
        txtTimeUpdate();
    }
    //前日分日報コピーボタン
    document.getElementById("btnBeforeDataCopy").onclick = function () {
        beforeDairyReportCopy();
    }
    dbConnect(); //データベース接続
    // 担当者をセットして画面の初期表示
    EmpCdisplay(EmpCd);
    DisPlayChecker();
    //作業時間計算
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
    //残業登録ボタン
    document.getElementById("btnovertime").onclick = function () {
        overTimeOperate();
    }
    //残業時間表示
    overTimeinit(EmpCd, txtdate);
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
    DisPlayChecker();
    obj.style.backgroundColor = "#ffffff";
}

//*****************************************************************************
//
// データ操作関連
//
//******************************************************************************

//*
//*　データベースへの追加・削除・更新判断
//*
function btnActionSelect(ReportID, WorkplanID, Memo, whour, Refar, txtCount, selectMode) {
    var sCount = txtCount;        //項目位置取得用
    //報告日を選択していない場合のチェック
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    //担当を選択していない場合のチェック
    var selEmp = document.getElementById('selectEmpId');
    if (ChckEmp(selEmp)) {
        if (selEmp.selectedIndex == 0) {
            alert("担当者を選択してください。");
            selEmp.focus();
            return;
        }
    }
    //案件と作業を選択していない場合のチェック
    var selMatter = document.getElementById('selectMatter' + sCount);
    if (ChckMatter(selMatter, sCount)) {
    } else {
        return;
    }
    var selTask = document.getElementById('selectTask' + sCount);
    if (ChckTask(selTask, sCount)) {
    } else {
        return;
    }

    //    必要項目類セット
    var rId = Number(ReportID);                                                             //日報ID
    var wId = WorkplanID;
    var reMemo = Memo;                                                                      //実績・補足
    var Reportday = document.getElementById('txtReportday').value;                          //報告日
    var EmpID = EmpCd;                                                                      //担当者
    var AdminID = document.getElementById('AdministrationCd' + sCount).innerText;           //基本方針
    var ActionID = document.getElementById('ActionPlanCd' + sCount).innerText;              //行動計画
    var MatterID = document.getElementById('MatterCd' + sCount).innerText;                  //案件ID
    var TaskID = document.getElementById('TaskCd' + sCount).innerText;                      //作業ID
    var Whour = whour;                                                                      //作業時間
    var Refe = Refar;                                                                         //関連資料
    //DB登録状況確認
    var mySql = " SELECT Count(ReportID) AS CountRid "
                + " FROM t_dailyreport "
                + " WHERE ( ReportID =" + rId + ") AND ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //    console.log(mySql);
    if (selectMode == 1) {
        //削除
        dataDelete(rId, EmpID, Reportday, sCount);
        return;
    }
    if (selectMode == 0 && idcount == 0) {
        //追加
        dataInsert(rId, wId, AdminID, ActionID, MatterID, TaskID, Reportday, reMemo, Refe, EmpID, Whour, sCount);
    } else {
        //更新
        dataUpdate(rId, wId, AdminID, ActionID, MatterID, TaskID, Reportday, reMemo, Refe, EmpID, Whour, sCount);
    }
}

//*
//*　報告日に日報登録が存在するかを判別して表示する関数
//*
function DisPlayChecker() {
    //報告日チェック
    var Reportday = document.getElementById('txtReportday').value;
    var EmpID = EmpCd;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    var mySql = " SELECT COUNT(WorkplanID) AS WIDCount" + " FROM t_workplan"
                     + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var wPlanCount = recordSet(0);

    var mySql = " SELECT COUNT(ReportID) AS RIDCount "
           + " FROM t_dailyreport "
           + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var ReportCount = recordSet(0);
    //日報IDの登録がなければ作業計画のみ表示
    if (ReportCount == 0 && wPlanCount == 0) {
        //0件の場合は画面をクリアする。
        var clfield = document.getElementById('item1');
        //子オブジェクトが取得可能な場合は子ツリーを削除してテキストボックス追加
        if (clfield.lastchild) {
            ItemField.clear()
            clfield.removeChild(clfield.lastChild);
            clfield.innerHTML = '';
            ItemField.add();
        }
        //子オブジェクト取得不可の場合は子オブジェクトを無視してテキストボックス追加
        clfield.innerHTML = '';
        ItemField.add();
        //作業時間再計算
        var SumwSubmmit = document.getElementById("btnSumWorkTime");
        SumwSubmmit.click();
        //残業時間表示
        overTimeinit(EmpID, Reportday)
        //残業時間累計計算
        return;
    }
    //日報IDが存在しない場合は作業計画のみを表示する。    
    if (ReportCount == 0) {
        workPlanView();
    } else {
        dataDisplay();
    }
    recordSet.Close();
    recordSet = null;
    //作業時間再計算
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
    //残業時間表示
    overTimeinit(EmpID, Reportday)
    //残業時間累計計算
}

//*
//*　該当日の作業計画を呼出して画面に表示する。
//*
function workPlanView() {
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
    } else {
        return;
    }
    try {
        var EmpID = EmpCd;
        var mySql = " SELECT WorkplanID, AdministrationID, ActionplanID, MatterID, TaskID ,Planmemo " + " FROM t_workplan"
                         + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' ) ORDER BY  WorkplanID ;";
        var recordSet = database.Execute(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>日報ID　:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '"  style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + counter + '" \/>'
                    + '作業計画ID　:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                    + '案件:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '作業:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>作業予定:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(5) + '<\/textarea>'
                    + '実績・補足:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="開始" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="終了" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '時間:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '"  style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="0" \/>'
                    + '<br/>関連資料:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="－" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="定型作業呼出" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
            var field = document.getElementById('item' + counter);
            var workPlanID = recordSet(0);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
            field.appendChild(new_area);
            //案件ID表示
            var Mcd = Number(recordSet(1)) + '-' + Number(recordSet(2)) + '-' + Number(recordSet(3));
            MatterCdDisplay(counter, Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(1) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(2) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(3) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //作業ID表示表示用
            var Tcd = recordSet(4);
            TaskCdDisplay(counter, Tcd);
            var mtSelect = document.getElementById('TaskCdDisplay' + counter);
            mtSelect.innerHTML = "";
            var tempHtml = '<span id="TaskCd' + counter + '"\">' + Tcd + '<\/span>';
            mtSelect.innerHTML = tempHtml;
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
        ItemField.add();
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　日報データを表示する関数
//*
function dataDisplay() {
    try {
        var cWork = "－";
        //日報部分
        var Reportday = document.getElementById('txtReportday').value;
        ChckDate(Reportday);
        var EmpId = EmpCd;
        var mySql = " SELECT ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Workinghours,Reference "
                     + " FROM t_dailyreport "
                     + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  ReportID ;";
        var recordSet = database.Execute(mySql);
        //alert(mySql);
        //console.log(mySql);
        var counter = 1;
        var tempHtml = "";
        while (!recordSet.EOF) {
            tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>日報ID　:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(0) + '" \/>'
                    + '作業計画ID　:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(1) + '" \/>'
                    + '案件:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '作業:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>作業予定:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"><\/textarea>'
                    + '実績・補足:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(7) + '<\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="開始" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="終了" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '時間:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(8) + '" \/>'
                    + '<br/>関連資料:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + recordSet(9) + '" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="定型作業呼出" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
            var field = document.getElementById('item' + counter);
            var workPlanID = recordSet(1);
            var newItem = tempHtml;
            field.innerHTML = newItem;
            var nextNumber = counter + 1;
            var new_area = document.createElement("div");
            new_area.setAttribute("id", "item" + nextNumber);
            new_area.setAttribute("class", "table");
            field.appendChild(new_area);
            //作業予定表示
            if (workPlanID == cWork || workPlanID == null || workPlanID == undefined) {
                var TaskMemo = document.getElementById('txtTaskMemo' + counter);
                TaskMemo.value = cWork;
            } else {
                mySubSql = " SELECT t_dailyreport.ReportID, t_workplan.WorkplanID, t_workplan.AdministrationID, t_workplan.ActionplanID, t_workplan.MatterID, t_workplan.TaskID,Planmemo "
                    + " FROM t_dailyreport INNER JOIN t_workplan ON (t_workplan.PlanDate = t_dailyreport.Reportday) "
                    + " AND (t_dailyreport.Empid = t_workplan.Empid) AND (t_dailyreport.WorkplanID = t_workplan.WorkplanID) "
                    + " WHERE (((t_dailyreport.Empid)='" + EmpId + "') AND ((t_dailyreport.Reportday)='" + Reportday + "') AND ((t_dailyreport.DeleteFlg)='0') AND ((t_workplan.DeleteFlg)='0')) "
                    + "AND ((t_workplan.WorkplanID)='" + workPlanID + "');";
                SubrecordSet = database.Execute(mySubSql);
                //alert(mySubSql);
                //console.log(mySubSql);
                var WPMemo = SubrecordSet(6);
                var TaskMemo = document.getElementById('txtTaskMemo' + counter);
                TaskMemo.value = WPMemo;
                SubrecordSet.Close();
                SubrecordSet = null;
            }
            //案件ID表示
            var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
            MatterCdDisplay(counter, Mcd);
            var mdSelect = document.getElementById('MatterCdDisplay' + counter)
            mdSelect.innerHTML = "";
            var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(2) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(3) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(4) + '<\/span>';
            mdSelect.innerHTML = tempHtml;
            //作業ID表示表示用
            var Tcd = recordSet(5);
            TaskCdDisplay(counter, Tcd);
            var mtSelect = document.getElementById('TaskCdDisplay' + counter);
            mtSelect.innerHTML = "";
            var tempHtml = '<span id="TaskCd' + counter + '"\">' + Tcd + '<\/span>';
            mtSelect.innerHTML = tempHtml;
            recordSet.MoveNext();
            counter++;
        }
        recordSet.Close();
        recordSet = null;
        ItemField.add();
        //作業時間計算
        var SumwSubmmit = document.getElementById("btnSumWorkTime");
        SumwSubmmit.click();
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　データを追加する関数
//*
function dataInsert(ReportID, WorkplanID, AdminID, ActionID, MatterID, TaskID, Reportday, ReportMemo, Reference, EmpID, Workinghours, Chkcount) {
    try {
        //登録用日時取得
        var btnCnt = Chkcount;
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());

        //作業計画が設定されているかの確認
        var cWork = "－";
        var checker = wPlanChecker(WorkplanID,Reportday);
        if (checker==false){
            WorkplanID = cWork;
        }

        //データ追加
        if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
            var mySql = " INSERT INTO t_dailyreport (ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Reference,Empid,Workinghours,Creationdate,DeleteFlg ) "
                         + " VALUES (" + Number(ReportID) + ",'" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + Reportday + "','" + ReportMemo + "','" + Reference + "','" + EmpID + "','" + Workinghours + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            //console.log(mySql);
            alert("データを追加しました。");
            //定型作業として追加するかの確認
            var selRoutine = confirm("定型作業として追加しますか？");
            if (selRoutine == true) {
                RoutineWorkInsert(btnCnt);
            }
            //画面再描画判定
            ViewUpdateChck(btnCnt);
            var nextnum = btnCnt + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //次の案件セレクトボックスがある場合はフォーカス移動
            if (nxtMatter) {
                nxtMatter.focus();
                //作業時間計算
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　データを更新する関数
//*
function dataUpdate(ReportID, WorkplanID, AdminID, ActionID, MatterID, TaskID, Reportday, ReportMemo, Reference, EmpID, Workinghours, Chkcount) {
    try {
        //登録用日時取得
        var btnCnt = Chkcount;
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        if (dataCheck(ReportID, 0, btnCnt) && dataCheck(ReportMemo, 1, btnCnt)) {
            var mySql = " UPDATE t_dailyreport SET WorkplanID = '" + WorkplanID + "', AdministrationID = '" + AdminID + "', ActionplanID = '" + ActionID
                        + "', MatterID = '" + MatterID + "', TaskID = '" + TaskID + "', Reportday = '" + Reportday + "', Dailymemo = '" + ReportMemo
                        + "', Reference = '" + Reference + " ', EmpID = '" + EmpID + " ', Workinghours = '" + Workinghours + " ', UpdateDate = '" + OperateDate + "',"
			            + " DeleteFlg ='0' WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' );";
            //alert(mySql);
            //console.log(mySql);
            database.Execute(mySql);
            alert("更新しました。");
            //追加後に追加した実績・補足を表示する
            var cWork = "－";
            var WkplanId = document.getElementById('txtPlanCd' + btnCnt);
            var ckWk = WkplanId.value;
            var Report = document.getElementById('txtReportMemo' + btnCnt).value;
            var Report = ReportMemo;
            var Refer = document.getElementById('txtRefarence' + btnCnt).value;
            var Refer = Reference;
            var nextnum = btnCnt + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //次の案件セレクトボックスがある場合はフォーカス移動
            if (nxtMatter) {
                nxtMatter.focus();
                //作業時間計算
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
            //画面再描画判定
            ViewUpdateChck(btnCnt);
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　データを削除する関数
//*
function dataDelete(ReportID, EmpID, Reportday, Chkcount) {
    try {
        //登録用日時取得
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        if (dataCheck(ReportID, 0, Chkcount)) {
            var mySql = " UPDATE t_dailyreport SET DeleteFlg ='1', DeleteDate = '" + OperateDate + "'"
			            + " WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' );";
            //console.log(mySql);
            database.Execute(mySql);
            alert("削除しました。");
            ItemField.clear();
            dataDisplay();
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　案件をセレクトボックスに表示する関数
//*
function MatterCdDisplay(Mcounter, MatterCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Administration.AdministrationID, m_ActionPlan.ActionplanID, m_Matter.MatterID, m_Matter.MatterName "
                + " FROM (m_ActionPlan INNER JOIN m_Matter ON m_ActionPlan.ActionplanID = m_Matter.ActionplanID) "
                + " INNER JOIN (m_Administration INNER JOIN m_Businessyear ON m_Administration.Businessyear = m_Businessyear.BusinessYear) "
                + " ON (m_ActionPlan.AdministrationID = m_Administration.AdministrationID) "
                + " AND (m_Matter.AdministrationID = m_Administration.AdministrationID) "
                + " WHERE (m_ActionPlan.DeleteFlg Is Null) AND (m_Businessyear.ShowFlg='0'); ";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    var MatterBox = document.getElementById('MatterDisplay' + labCounter);
    MatterBox.innerHTML = "";
    var tempHtml = '<select name="selectMatter' + labCounter + '" id="selectMatter' + labCounter + '" onchange="MatterCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">選択してください。<\/option>\n';
    while (!recordSet.EOF) {
        var optionval = Number(recordSet(0)) + '-' + Number(recordSet(1)) + '-' + Number(recordSet(2));
        //オプション値指定がある場合はそのオプションを選択状態にする。
        if (optionval == MatterCd) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(3) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(3) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    MatterBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//*　案件セレクトボックス更新時の画面制御
//*
function MatterCdchange(obj, Mcounter) {
    //基本方針CDと行動計画CDと案件CDを分割する。。
    var laMcounter = Mcounter;
    var workCd = obj.value;
    var separator = "-";
    var allayworkCd = workCd.split(separator);
    if (obj.selectedIndex == 0) {
        var selmatter = document.getElementById("selectMatter");
        alert("案件を選択してください。");
        obj.focus();
        return;
    }
    var AdministrationCd = allayworkCd[0];
    var ActionPlanCd = allayworkCd[1];
    var MatterCd = allayworkCd[2];
    var mySql = " SELECT m_Matter.AdministrationID, m_Matter.ActionplanID, m_Matter.MatterID"
                + " FROM m_ActionPlan INNER JOIN (m_Matter INNER JOIN (m_Administration INNER JOIN m_Businessyear"
                + " ON m_Administration.Businessyear = m_Businessyear.BusinessYear)"
                + " ON m_Matter.AdministrationID = m_Administration.AdministrationID)"
                + " ON (m_ActionPlan.ActionplanID = m_Matter.ActionplanID)"
                + " AND (m_ActionPlan.AdministrationID = m_Administration.AdministrationID)"
                + " WHERE ( m_Matter.AdministrationID ='" + AdministrationCd + "')"
                + " AND ( m_Matter.ActionplanID ='" + ActionPlanCd + "')"
                + " AND ( m_Matter.MatterID ='" + MatterCd + "')"
                + " AND (m_ActionPlan.DeleteFlg Is Null)"
                + " AND (m_Businessyear.ShowFlg = '0');"
    var recordSet = database.Execute(mySql);
    var sk1 = recordSet(0); //基本方針ID
    var sk2 = recordSet(1); //行動計画ID
    var sk3 = recordSet(2); //案件ID
    var mdSelect = document.getElementById('MatterCdDisplay' + Mcounter)
    mdSelect.innerHTML = "";
    var tempHtml = '<span id="AdministrationCd' + laMcounter + '"\">' + recordSet(0) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + laMcounter + '\">' + recordSet(1) + '<\/span>' + '-' + '<span id="MatterCd' + laMcounter + '"\">' + recordSet(2) + '<\/span>';
    mdSelect.innerHTML = tempHtml;
}

//*
//*　作業をセレクトボックスに表示する関数
//*
function TaskCdDisplay(Mcounter, TaskCd) {
    var labCounter = Mcounter;
    var mySql = " SELECT m_Task.* FROM m_Task ORDER BY TaskID;";
    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var TaskBox = document.getElementById('TaskDisplay' + labCounter);
    TaskBox.innerHTML = "";
    var tempHtml = '<select name="selectTask' + labCounter + '" id="selectTask' + labCounter + '" onchange="TaskCdchange(this,' + labCounter + ')" \">\n';
    tempHtml = tempHtml + '\t<option value="0">選択してください。<\/option>\n';
    while (!recordSet.EOF) {
        //オプション値指定がある場合はそのオプションを選択状態にする。
        if (recordSet(0) == Number(TaskCd)) {
            tempHtml = tempHtml + '\t<option value=" ' + TaskCd + '" selected \>' + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value=" ' + recordSet(0) + '"\">' + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + '</select>';
    TaskBox.innerHTML = tempHtml;
    recordSet.Close();
    recordSet = null;
}

//*
//*　作業セレクトボックス更新時の画面制御
//*
function TaskCdchange(obj, Mcounter) {
    var laMcounter = Mcounter;
    var workCd = obj.value;
    if (obj.selectedIndex == 0) {
        var seltask = document.getElementById("selectTask");
        alert("作業を選択してください。");
        obj.focus();
        return;
    }
    var mtSelect = document.getElementById('TaskCdDisplay' + laMcounter)
    mtSelect.innerHTML = "";
    var tempHtml = '<span id="TaskCd' + laMcounter + '"\">' + workCd + '<\/span>';
    mtSelect.innerHTML = tempHtml;
}


//*
//*　開始時間をデータベースに登録する。　　　#修正対象(作業計画のチェック)
//*
function startTimeUpdate(ReportID, WorkplanID, Memo, whour, Refar, txtCount) {
    //登録用日時取得
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
    OperateDate = dateFormat.format(new Date());
    var Chkcount = txtCount;        //項目位置取得用
    //報告日および担当を選択していない場合のチェック
    var Reportday = document.getElementById('txtReportday').value;
    var selEmp = document.getElementById('selectEmpId');
    if (ChckDate(Reportday) && ChckEmp(selEmp)) {
    } else {
        return;
    }
    //案件と作業を選択していない場合のチェック
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
    } else {
        return;
    }
    //必要項目類セット
    var rId = Number(ReportID);                                                             　 //日報ID
    var wId = WorkplanID;
    var ReportMemo = Memo;                                                                    //実績・補足
    var Reportday = document.getElementById('txtReportday').value;                            //報告日
    var EmpID = EmpCd;                                                                        //担当者
    var AdminID = document.getElementById('AdministrationCd' + Chkcount).innerText;           //基本方針
    var ActionID = document.getElementById('ActionPlanCd' + Chkcount).innerText;              //行動計画
    var MatterID = document.getElementById('MatterCd' + Chkcount).innerText;                  //案件ID
    var TaskID = document.getElementById('TaskCd' + Chkcount).innerText;                      //作業ID
    var Workinghours = whour;                                                                 //作業時間
    var Reference = Refar;                                                                    //関連資料
    try {
        var mySql = " SELECT Count(ReportID) AS CountRid "
                    + " FROM t_dailyreport "
                    + " WHERE ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "') AND (ReportID=" + rId + ");";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);

        //作業計画が設定されているかの確認
        var cWork = "－";
        var checker = wPlanChecker(WorkplanID,Reportday);
        if (checker==false){
            WorkplanID = cWork;
        }

        if (idcount == 0) {
            if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
                var mySql = " INSERT INTO t_dailyreport (ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Reference,Empid,Workinghours,Taskstart,Creationdate,DeleteFlg ) "
                            + " VALUES (" + Number(ReportID) + ",'" + WorkplanID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + Reportday + "','" + ReportMemo + "','" + Reference + "','" + EmpID + "','" + Workinghours + "','" + OperateDate + "','" + OperateDate + "','0');";
                database.Execute(mySql);
                //console.log(mySql);
                alert("追加しました。");
                //定型作業として追加するかの確認
                var selRoutine = confirm("定型作業として追加しますか？");
                if (selRoutine == true) {
                    RoutineWorkInsert(Chkcount);
                }
                //画面再描画判定
                ViewUpdateChck(Chkcount);
                var nextnum = Chkcount + 1;
                var nxtMatter = document.getElementById('selectMatter' + nextnum);
                //次の案件セレクトボックスがある場合はフォーカス移動
                if (nxtMatter) {
                    nxtMatter.focus();
                }
            }
        } else {
            if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
                var mySql = " UPDATE t_dailyreport SET Taskstart = '" + OperateDate + " ', UpdateDate = '" + OperateDate + "'"
			            + " WHERE ( ReportID = " + Number(ReportID) + " ) AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' ) AND DeleteFlg ='0' ;";
                //alert(mySql);
                //console.log(mySql);
                database.Execute(mySql);
                var nextnum = Chkcount + 1;
                var nxtMatter = document.getElementById('selectMatter' + nextnum);
                //次の案件セレクトボックスがある場合はフォーカス移動
                if (nxtMatter) {
                    nxtMatter.focus();
                }
                alert("更新しました。");
            }
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　終了時間をデータベースに登録し、作業時間を計算する。
//*
function endTimeUpdate(ReportID, WorkplanID, Memo, whour, Refar, txtCount) {
    //登録用日時取得
    var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
    OperateDate = dateFormat.format(new Date());
    var Chkcount = txtCount;        //項目位置取得用
    //報告日および担当を選択していない場合のチェック
    var Reportday = document.getElementById('txtReportday').value;
    var selEmp = document.getElementById('selectEmpId');
    if (ChckDate(Reportday) && ChckEmp(selEmp)) {
    } else {
        return;
    }
    //案件と作業を選択していない場合のチェック
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
    } else {
        return;
    }
    //必要項目類セット
    var rId = Number(ReportID);                                                             //日報ID
    var wId = WorkplanID;
    var ReportMemo = Memo;                                                                  //実績・補足
    var Reportday = document.getElementById('txtReportday').value;                          //報告日
    var EmpID = EmpCd;                                                                      //担当者
    var AdminID = document.getElementById('AdministrationCd' + Chkcount).innerText;         //基本方針
    var ActionID = document.getElementById('ActionPlanCd' + Chkcount).innerText;            //行動計画
    var MatterID = document.getElementById('MatterCd' + Chkcount).innerText;                  //案件ID
    var TaskID = document.getElementById('TaskCd' + Chkcount).innerText;                      //作業ID
    var Workinghours = whour;                                                                 //作業時間
    var Reference = Refar;                                                                    //関連資料
    try {
        var mySql = " SELECT Count(ReportID) AS CountRid "
                    + " FROM t_dailyreport "
                    + " WHERE ( Empid ='" + EmpID + "') AND (Reportday ='" + Reportday + "') AND (ReportID=" + Number(ReportID) + ");";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);
        if (idcount == 0) {
            alert("先に開始ボタンを押してください。")
            return;
        }
        if (dataCheck(ReportID, 0, Chkcount) && dataCheck(ReportMemo, 1, Chkcount)) {
            //開始時刻取得
            var mySql = " SELECT Taskstart  FROM t_dailyreport "
                            + " WHERE (ReportID = " + Number(ReportID) + ") AND (Reportday ='" + Reportday + "') AND "
                            + " (Empid='" + EmpID + "') AND (DeleteFlg='0');";
            //alert(mySql);
            //console.log(mySql);
            var recordSet = database.Execute(mySql);
            var startTime = recordSet(0);
            //終了時刻-開始時刻で作業時間を算出
            WorkTime = DateCalculate(startTime, OperateDate);
            var mySql = " UPDATE t_dailyreport SET Taskend = '" + OperateDate + " ', UpdateDate = '" + OperateDate + " ', Workinghours = '" + WorkTime + "' WHERE ( ReportID = " + Number(ReportID) + " )"
                            + " AND ( Empid = '" + EmpID + "' )  AND ( Reportday = '" + Reportday + "' ) AND DeleteFlg ='0' ;";
            //alert(mySql);
            //console.log(mySql);
            database.Execute(mySql);
            var wkTime = document.getElementById('txtTime' + Chkcount);
            wkTime.value = WorkTime;
            alert("更新しました。");
            var nextnum = Chkcount + 1;
            var nxtMatter = document.getElementById('selectMatter' + nextnum);
            //次の案件セレクトボックスがある場合はフォーカス移動
            if (nxtMatter) {
                nxtMatter.focus();
                //作業時間計算
                var SumwSubmmit = document.getElementById("btnSumWorkTime");
                SumwSubmmit.click();
            }
        }
        recordSet.Close();
        recordSet = null;
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*     作業予定と作業実績を識別し画面更新を判定する関数
//*
function ViewUpdateChck(btnCount) {
    var CurrentNum = btnCount;
    var evntCnt = btnCount;
    var cWork = "－";
    var viewflg = "0";
    //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
    var chkerNumber = document.getElementsByClassName("table").length - 1;
    for (var i = 1; i <= chkerNumber; i++) {
        var j = i;
        var RepNo = document.getElementById('txtReportCd' + i).value;
        var WkplanMemo = document.getElementById('txtTaskMemo' + i).value;
        var DailyRepMemo = document.getElementById('txtReportMemo' + i).value;
        if (WkplanMemo !== cWork && DailyRepMemo == "" || DailyRepMemo == null || DailyRepMemo == undefined) {
            viewflg = "1"
            break;
        }
        if (WkplanMemo == cWork && DailyRepMemo !== "" || DailyRepMemo !== null || DailyRepMemo !== undefined) {
            viewflg = "2"
        }
    }
    //画面更新可能な場合は画面更新
    if (viewflg == "0") {
        dataDisplay();
    }
    if (CurrentNum == chkerNumber) {
        ItemField.add();
    }
}

//*****************************************************************************
//
// エラーチェック関連
//
//******************************************************************************
//*
//* データをチェックする関数
//*
function dataCheck(CheckValue, Chckflg, Chkcount) {
    var focucCnt = Chkcount;
    var tempStr = "は必ず入力してください。";
    var txtCd = document.getElementById('txtReportCd' + Chkcount);
    var txtDetail = document.getElementById('txtReportMemo' + Chkcount);
    var txtovertime = document.getElementById('txtovertime');

    if (Chckflg == 0 && CheckValue == "") {
        alert("日報ID" + tempStr);
        txtCd.focus();
        return false;
    }
    if (Chckflg == 1 && CheckValue == "") {
        alert("実績・補足" + tempStr);
        txtDetail.focus();
        return false;
    }
    //2013/12/16　追加
    if (Chckflg == 2 && CheckValue == "") {
        alert("残業実績" + tempStr);
        txtovertime.focus();
        return false;
    }
    return true;
}

//*
//* 報告日チェック
//*
function ChckDate(Reportday) {
    if (Reportday) {
    } else {
        txtReportday = document.getElementById("txtReportday");
        alert("報告日は必須です。");
        txtReportday.focus();
        return false;
    }
    return true;
}

//*
//* 担当者コードチェック
//*
function ChckEmp(Employ) {
    if (Employ) {
    } else {
        var selEmp = document.getElementById('selectEmpId');
        alert("担当者を選択してください。");
        selEmp.focus();
        return false;
    }
    return true;
}

//*
//* 案件チェック
//*
function ChckMatter(Matter, Chkcount) {
    var selMatter = document.getElementById('selectMatter' + Chkcount);
    if (selMatter.value == 0) {
        alert("案件を選択してください。");
        selMatter.focus();
        return false;
    }
    return true;
}

//*
//* 作業チェック
//*
function ChckTask(Task, Chkcount) {
    var selTask = document.getElementById('selectTask' + Chkcount);
    if (selTask.value == 0) {
        alert("作業を選択してください。");
        selTask.focus();
        return false;
    }
    return true;
}

//*
//* 作業計画チェック
//作業計画IDが「-」でない場合は作業計画IDに「-」をセットして登録する。(作業計画登録有分を別日付で保存する場合の対策)
function wPlanChecker(WorkplanID,Reportday){
    var cWork = "－";
    if (WorkplanID!==cWork){
        var mySql = " SELECT COUNT(WorkplanID) AS WIDCount"
                    + " FROM t_workplan"
                    + " WHERE (PlanDate='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
        //alert(mySql);
        //console.log(mySql);
        var recordSet = database.Execute(mySql);
        var wplanCount = recordSet(0);
        if(wplanCount==0){
            return false;
        }
    }
}


//*
//* 基本方針、行動計画、案件の文字列分割用
//*
function StringSeparator(objString) {
    var sobj = objString;
    var separator = "-";
    var allayworkCd = sobj.split(separator);
    var robj = allayworkCd[1];
    return robj;
}

//*
//* 終了時刻-開始時刻の時間差計算
//*
function DateCalculate(StartTime, EndTime) {

    //時間差を求めて時間、分単位に変換する。
    var s = Date.parse(StartTime);
    var e = Date.parse(EndTime);
    var wkTime = e - s;
    var CTime = wkTime / 3600000;
    var rtn = CTime.toFixed(2)
    return rtn;
}

//*
//* 作業計画呼出
//*
function winOpen(target_site) {
    //社員コードを渡して作業計画画面に遷移
    var selEmp = document.getElementById('selectEmpId');
    var EmpCd = selEmp.value;
    if (ChckEmp(EmpCd)) {
        var child = target_site + "?" + EmpCd;
        subwin = window.open(child, "ChildWin", "top=50,left=500,width=1280,height=800,scrollbars=yes");
    }
}

//*
//* 作業時間再計算
//*
function txtTimeUpdate() {
    //テキストボックスの値取得
    //カレンダーのロジックでdiv要素が2つ使用されていて意図しないdivを拾ってくるのでその対応
    var eleNumber = document.getElementsByClassName("table").length - 1;
    var sumTime = 0;
    //テキストボックス内の時間を集計
    for (var i = 1; i < eleNumber; i++) {
        var Timefield = document.getElementById('txtTime' + i);
        var wktime = parseFloat(Timefield.value);
        sumTime = parseFloat(sumTime) + wktime;
    }
    var sumTimeField = document.getElementById('txtSumWorkTime');
    //時間をX.XX形式に修正して表示
    sumTime = sumTime * 100;
    sumTime = Math.round(sumTime);
    sumTime = sumTime / 100;
    sumTimeField.value = sumTime;
    var overTimeSum = document.getElementById('txtovertime');
    if (sumTime >= 8.0) {
      var diffTime;
      diffTime = sumTime - 8;
      diffTime = diffTime * 100;
      diffTime = Math.round(diffTime);
      diffTime = diffTime / 100;
      overTimeSum.value = diffTime;  
    }
}

//*****************************************************************************
//
// 追加機能
//
//******************************************************************************

//*
//*　前日分日報コピー
//*
function beforeDairyReportCopy() {
    //報告日チェック
    var Reportday = document.getElementById('txtReportday').value;
    var BefDay;
    if (ChckDate(Reportday)) {
        var txtdate = new DateFormat("yyyy/MM/dd");
        txtdate = txtdate.format(new Date(Reportday));
        BefDay = DaymainusCalculate(txtdate);
    } else {
        return;
    }

    var clfield = document.getElementById('item1');
    //子オブジェクトが取得可能な場合は子ツリーを削除してテキストボックス追加
    if (clfield.lastchild) {
        ItemField.clear()
        clfield.removeChild(clfield.lastChild);
        clfield.innerHTML = '';
        ItemField.add();
    }
    //子オブジェクト取得不可の場合は子オブジェクトを無視してテキストボックス追加
    clfield.innerHTML = '';
    ItemField.add();
    //最大10日分確認
    var checker = existReport(BefDay);
    alert("前日入力分の日報の内容を表示します。\n（前日分がなければ過去10日以内の入力データを表示します。）\n画面表示後に登録ボタンを押せば日報データベースに反映されます。");
    for (var i = 1; i <= 11; i++) {
        if (checker == true) {
            BeforeDairyReportView(BefDay);
            break;
        }
        BefDay = DaymainusCalculate(BefDay);
        checker = existReport(BefDay)
    }
}

//*
//*　レコードの存在確認
//*
function existReport(Reportday) {
    var EmpID = EmpCd;
    var mySql = " SELECT COUNT(ReportID) AS RIDCount "
           + " FROM t_dailyreport "
           + " WHERE (Reportday='" + Reportday + "') AND (Empid='" + EmpID + "') AND (DeleteFlg = '0' );";
    var recordSet = database.Execute(mySql);
    var ReportCount = recordSet(0);
    if (ReportCount == 0) {
        return false;
    } else {
        return true;
    }
}


//*
//*　前日分日報画面表示
//*
function BeforeDairyReportView(BefReportday) {
    var cWork = "－";
    //日報部分
    ChckDate(BefReportday);
    var EmpId = EmpCd;
    var mySql = " SELECT ReportID,WorkplanID,AdministrationID,ActionplanID,MatterID,TaskID,Reportday,Dailymemo,Workinghours,Reference "
                         + " FROM t_dailyreport "
                         + " WHERE (Reportday='" + BefReportday + "') AND (Empid='" + EmpId + "') AND (DeleteFlg = '0' ) ORDER BY  ReportID ;";
    var recordSet = database.Execute(mySql);
    //alert(mySql);
    //console.log(mySql);
    var counter = 1;
    var tempHtml = "";
    while (!recordSet.EOF) {
        tempHtml = '<table border="1"  style ="width:1130px" ><tr><td>日報ID　:<input type="text" name="txtReportCd' + counter + '" id="txtReportCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + counter + '" \/>'
                    + '作業計画ID　:<input type="text" name="txtPlanCd' + counter + '" id="txtPlanCd' + counter + '" style ="width:30px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + cWork + '" \/>'
                    + '案件:<span id="MatterCdDisplay' + counter + '"></span>'
                    + '<span id="MatterDisplay' + counter + '"></span>'
                    + '作業:<span id="TaskCdDisplay' + counter + '"></span>'
                    + '<span id="TaskDisplay' + counter + '"></span>'
                    + '<br/>作業予定:<textarea name="txtTaskMemo' + counter + '" id="txtTaskMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + cWork + '<\/textarea>'
                    + '実績・補足:<textarea name="txtReportMemo' + counter + '" id="txtReportMemo' + counter + '" cols="40" rows="4" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'">' + recordSet(7) + '<\/textarea>'
                    + '<input type="button" name="btnStart' + counter + '" id="btnStart' + counter + '" value="開始" onclick="startTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '<input type="button" name="btnEnd' + counter + '" id="btnEnd' + counter + '" value="終了" onclick="endTimeUpdate(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ')" \/>'
                    + '時間:<input type="text" name="txtTime' + counter + '" id="txtTime' + counter + '" style ="width:40px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + 0 + '" \/>'
                    + '<br/>関連資料:<input type="text" name="txtRefarence' + counter + '" id="txtRefarence' + counter + '" style ="width:600px" onFocus="this.style.backgroundColor=\'#ffff00\'" onBlur="this.style.backgroundColor=\'#ffffff\'"  value="' + cWork + '" \/><\/td>'
                    + '<td><input type="button" name="btnInsert' + counter + '" id="btnInsert' + counter + '" value="登録" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',0)" \/>'
                    + '<input type="button" name="btnDelete' + counter + '" id="btnDelete' + counter + '" value="削除" onclick="btnActionSelect(txtReportCd' + counter + '.value,txtPlanCd' + counter + '.value,txtReportMemo' + counter + '.value,txtTime' + counter + '.value,txtRefarence' + counter + '.value,' + counter + ',1)" \/>'
                    + '<br/><input type="button" name="btnSTout' + counter + '" id="btnSTout' + counter + '" value="定型作業呼出" onclick="winOpenRoutine(\'Routine.html\',' + counter + ')" \/><\/td><\/tr><\/table>';
        var field = document.getElementById('item' + counter);
        var newItem = tempHtml;
        field.innerHTML = newItem;
        var nextNumber = counter + 1;
        var new_area = document.createElement("div");
        new_area.setAttribute("id", "item" + nextNumber);
        new_area.setAttribute("class", "table");
        field.appendChild(new_area);
        //案件ID表示
        var Mcd = Number(recordSet(2)) + '-' + Number(recordSet(3)) + '-' + Number(recordSet(4));
        MatterCdDisplay(counter, Mcd);
        var mdSelect = document.getElementById('MatterCdDisplay' + counter)
        mdSelect.innerHTML = "";
        var tempHtml = '<span id="AdministrationCd' + counter + '"\">' + recordSet(2) + '<\/span>' + '-' + '<span id=\"ActionPlanCd' + counter + '\">' + recordSet(3) + '<\/span>' + '-' + '<span id="MatterCd' + counter + '"\">' + recordSet(4) + '<\/span>';
        mdSelect.innerHTML = tempHtml;
        //作業ID表示表示用
        var Tcd = recordSet(5);
        TaskCdDisplay(counter, Tcd);
        var mtSelect = document.getElementById('TaskCdDisplay' + counter);
        mtSelect.innerHTML = "";
        var tempHtml = '<span id="TaskCd' + counter + '"\">' + Tcd + '<\/span>';
        mtSelect.innerHTML = tempHtml;
        recordSet.MoveNext();
        counter++;
    }
    recordSet.Close();
    recordSet = null;
    ItemField.add();
    //作業時間計算
    var SumwSubmmit = document.getElementById("btnSumWorkTime");
    SumwSubmmit.click();
}

//*
//* 前日日付をセットする
//*
function DaymainusCalculate(TargetDay) {
    //時間差を求めて時間、分単位に変換する。
    var tD = Date.parse(TargetDay);
    var after = 1;                             //1日減算する。
    after = after * 24 * 60 * 60 * 1000;     //加算日をミリ秒へ変換
    var wkTime = new Date(tD - after);
    var txtdate = new DateFormat("yyyy/MM/dd");
    var rtnDate = txtdate.format(new Date(wkTime));
    var rtn = rtnDate;
    return rtn;
}

//*
//*　定型作業登録
//*  2013/12/02　AddedBy　M.Nishimura
//*  
function RoutineWorkInsert(counter) {
    try {
        var EmpID = EmpCd;
        //登録用日時取得
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        OperateDate = dateFormat.format(new Date());
        var Chkcount = counter;        //項目位置取得用
        //報告日および担当を選択していない場合のチェック
        var Reportday = document.getElementById('txtReportday').value;
        if (ChckDate(Reportday) && ChckEmp(EmpID)) {
        } else {
            return;
        }
        //案件と作業を選択していない場合のチェック
        var selMatter = document.getElementById('selectMatter' + Chkcount);
        var selTask = document.getElementById('selectTask' + Chkcount);
        if (ChckMatter(selMatter, Chkcount) && ChckTask(selTask, Chkcount)) {
        } else {
            return;
        }
        var RoutineMemo = document.getElementById('txtReportMemo' + counter).value;
        if (dataCheck(RoutineMemo, 1, Chkcount)) {
            //定型作業追加
            var AdminID = document.getElementById('AdministrationCd' + counter).innerText;         //基本方針
            var ActionID = document.getElementById('ActionPlanCd' + counter).innerText;            //行動計画
            var MatterID = document.getElementById('MatterCd' + counter).innerText;                  //案件ID
            var TaskID = document.getElementById('TaskCd' + counter).innerText;                      //作業ID
            var mySql = " INSERT INTO m_RoutineWork (EmpID,AdministrationID,ActionplanID,MatterID,TaskID,RoutineMemo,Creationdate,DeleteFlg ) "
                  + " VALUES ('" + EmpID + "','" + AdminID + "','" + ActionID + "','" + MatterID + "','" + TaskID + "','" + RoutineMemo + "','" + OperateDate + "','0');";
            database.Execute(mySql);
            alert("定型作業として追加しました。");
        } else {
            return;
        }
    } catch (error) {
        alert(error.number + "\n" + error.description);
    }

}
//*
//* 定型作業呼出
//*  2013/12/02　AddedBy　M.Nishimura
//*  
function winOpenRoutine(target_site, TxtCnt) {
    var EmpID = EmpCd;
    var Reportday = document.getElementById('txtReportday').value;
    //社員コードを渡して作業計画画面に遷移
    if (ChckDate(Reportday) && ChckEmp(EmpID)) {
    } else {
        return;
    }
    var child = target_site + "?EmpCd=" + EmpID + "&TxtCnt=" + TxtCnt;
    subwin = window.open(child, "ChildWin", "top=50,left=500,width=1280,height=800,scrollbars=yes");
}

//*
//*　残業理由を表示する関数
//*  2013/12/16　AddedBy　M.Nishimura
//*
function CauseCdisplay(CauseId) {
    var mySql = "SELECT * FROM m_Cause WHERE ( DeleteFlg = '0') ORDER BY CauseID";
    var recordSet = database.Execute(mySql);
    //console.log(mySql);
    document.getElementById("overtimecause").innerHTML = "";
    var tempHtml = "残業理由：　<select name=\"selectCauseCd\" id=\"selectCauseCd\">\n";
    tempHtml = tempHtml + "\t<option value=\"0\">選択してください。</option>\n";
    while (!recordSet.EOF) {
        var optionval = recordSet(0);
        if (optionval == CauseId) {
            tempHtml = tempHtml + '\t<option value="' + optionval + '" selected >' + recordSet(0) + "：" + recordSet(1) + '<\/option>\n';
        } else {
            tempHtml = tempHtml + '\t<option value="' + optionval + '"\">' + recordSet(0) + "：" + recordSet(1) + '<\/option>\n';
        }
        recordSet.MoveNext();
    }
    tempHtml = tempHtml + "</select>";
    //console.log(tempHtml);
    document.getElementById("overtimecause").innerHTML = tempHtml;
    selCauseCd = document.getElementById("selectCauseCd");
    selCauseCd.onchange = function () {
        selectCauseCdCdchange(this);
    }
    recordSet.Close();
    recordSet = null;
}

//*
//*　残業理由選択時の動作
//*  2013/12/16　AddedBy　M.Nishimura
//*
function selectCauseCdCdchange(obj) {
    var wCauseCd = obj.value;
    if (obj.selectedIndex == 0) {
        var selCause = document.getElementById("selectCauseCd");
        alert("残業理由を選択してください。");
        selCause.focus();
        return;
    } else {
        CauseCd = wCauseCd;
    }
}

//*
//* 残業理由コードチェック
//*  2013/12/16　AddedBy　M.Nishimura
//*
function ChckOverTime(Cause) {
    var selCause = document.getElementById('selectCauseCd');
    if (selCause.selectedIndex == 0) {
        alert("残業理由を選択してください。");
        selCause.focus();
        return;
    } else {
        false;
    }
    return true;
}

//*
//*　残業テーブルへの追加・更新
//*  2013/12/16　AddedBy　M.Nishimura
//*
function overTimeOperate() {
    try {
        //残業限度計算用
        var overTimeSum = document.getElementById('txtovtSum').value;
        //報告日付
        var Reportday = document.getElementById('txtReportday').value;
        //担当者
        var EmpID = EmpCd;
        //登録用日時取得
        var dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
        var operateDate = dateFormat.format(new Date());
        //報告日および担当を選択していない場合のチェック
        if (ChckDate(Reportday) && ChckEmp(EmpID)) {
        } else {
            return;
        }
        //残業実績時間が入力されていない場合のチェック
        var overtimeval = document.getElementById('txtovertime').value;
        var ovplanval = document.getElementById('txtovplan').value;
        if (dataCheck(overtimeval, 2, '0')) {
        } else {
            return;
        }
        //残業理由のチェック
        var selCause = document.getElementById("selectCauseCd").value;
        if (ChckOverTime()) {
        } else {
            return;
        }
        //残業実績メモ
        var overtimeMemo = document.getElementById("txtovertimememo").value;

        //申請時間による警告
        var targetTime = Number(ovplanval) + Number(overTimeSum)
        if (15 <= targetTime && targetTime < 30) {
            alert("15時間を突破しています。残日数を確認し、今後の見込み含めて報告してください。");
        } else if (30 <= targetTime && targetTime < 45) {
            alert("残業上限です。これ以上残業すると体に毒です。");
        } else if (45 <= targetTime && targetTime < 60) {
            alert("36協定に引っかかっています。これ以上残業するのは危険です。");
        } else if (60 <= targetTime && targetTime < 100) {
            alert("精神的に危険です。あてにならないかもしれませんが上司に助けを求めましょう。");
        } else if (100 <= targetTime) {
            alert("お家に帰りましょう。このままでは廃人になります");
        } else {
            alert("申請時間内に帰れるようにしましょう。");
        }
        var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + Reportday + "');";
        var recordSet = database.Execute(mySql);
        var idcount = recordSet(0);
        //alert(mySql);
        //console.log(mySql);
        if (idcount == 0) {
            var ovaddmySql = "INSERT INTO t_Overtime ([Empid],[Workday],[Planhours],[Workinghours],[CauseID],[Memo],[Creationdate]) "
                            + " VALUES ('" + EmpID + "','" + Reportday + "','" + ovplanval + "','" + overtimeval + "'," + Number(selCause) + ",'" + overtimeMemo + "','" + operateDate + "');";
            //console.log(ovaddmySql);
            database.Execute(ovaddmySql);
            alert("残業を追加しました。")
        } else {
            var ovupmySql = " UPDATE t_Overtime SET [Planhours] = '" + ovplanval + "', [Workinghours] = '" + overtimeval + "', [CauseID]=" + Number(selCause) + ",[UpdateDate] = '" + operateDate + "',[Memo] ='" + overtimeMemo + "'"
                            + " WHERE ( [Empid] = '" + EmpID + "' )  AND ( [Workday] = '" + Reportday + "' );";
            //console.log(ovupmySql);
            database.Execute(ovupmySql);
            alert("残業時間を更新しました。")
        }
        overTimeinit(EmpCd, Reportday)
        recordSet.Close();
        recordSet = null;

    } catch (error) {
        alert(error.number + "\n" + error.description);
    }
}

//*
//*　残業時間表示初期化
//*  2013/12/16　AddedBy　M.Nishimura
//*
function overTimeinit(EmpCd, txtdate) {
    var cWork = "－";
    var overTime = document.getElementById('txtovertime');
    var ovPlan = document.getElementById('txtovplan');
    var overtimeMemo = document.getElementById('txtovertimememo');
    var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + txtdate + "');";
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);
    //alert(mySql);
    //console.log(mySql);
    if (idcount == 0) {
        //残業時間なしの場合の表示　
        ovPlan.value = '0.00';
        overTime.value = '0.00';
        CauseCdisplay(Number(0));
        overtimeMemo.value = '－';
    } else {
        //登録済残業時間表示
        var ovmySql = " SELECT  Empid, Planhours ,Workinghours , CauseID ,Memo "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday ='" + txtdate + "');";
        //alert(ovmySql);
        //console.log(ovmySql);
        var recordSet = database.Execute(ovmySql);
        ovPlan.value = recordSet(1);
        overTime.value = recordSet(2);
        var CauseId = Number(recordSet(3));
        CauseCdisplay(CauseId);
        var CauseMemo = recordSet(4);
        if (CauseMemo == cWork || CauseMemo == null || CauseMemo == undefined) {
            overtimeMemo.value = cWork;
        } else {
            overtimeMemo.value = CauseMemo;
        }
    }
    recordSet.Close();
    recordSet = null;
    //残業時間合計表示
    overTimeMonthSum(EmpCd, txtdate)
}

//*
//*　残業時間合計計算
//*  2013/12/17　AddedBy　M.Nishimura
//*
function overTimeMonthSum(EmpCd, txtdate) {
    var ovPlanSum = document.getElementById('txtovpSum');
    var overTimeSum = document.getElementById('txtovtSum');
    //報告日から月を取得し、月末日と1日を取得する。
    //参照URL:http://www.happyquality.com/2013/07/24/2680.htm
    var Reportday = document.getElementById('txtReportday').value;
    if (ChckDate(Reportday)) {
        var dy = new DateFormat("yyyy");
        var ReportYear = dy.format(new Date(Reportday));
        var dm = new DateFormat("MM");
        var ReportMonth = dm.format(new Date(Reportday));
        lastDay = new Date(ReportYear, (ReportMonth - 1) + 1, 0).getDate();
        var qfD = ReportYear + "/" + ReportMonth + "/" + "01";
        var qlD = ReportYear + "/" + ReportMonth + "/" + lastDay;
    } else {
        return;
    }
    //当月日付を抽出し残業時間合計を計算する。
    var mySql = " SELECT Count(EmpID) AS Countovertime "
                    + " FROM  t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday >='" + qfD + "' AND  Workday <='" + qlD + "');";
    //alert(mySql);
    //console.log(mySql);
    var recordSet = database.Execute(mySql);
    var idcount = recordSet(0);

    if (idcount == 0) {
        //レコードなしの場合の表示　
        ovPlanSum.value = '0.00';
        overTimeSum.value = '0.00';
    } else {
        //累計時間表示
        var sumSql = "SELECT Sum(t_Overtime.Planhours) AS PlanSum, Sum(t_Overtime.Workinghours) AS WorkiSum "
                    + " FROM t_Overtime "
                    + " WHERE ( Empid ='" + EmpCd + "') AND (Workday >='" + qfD + "' AND  Workday <='" + qlD + "');";
        //alert(ovmySql);
        //console.log(ovmySql);
        var recordSet = database.Execute(sumSql);
        //残業申請累計
        var ovPSum = recordSet(0);
        ovPSum = ovPSum * 100;
        ovPSum = Math.round(ovPSum);
        ovPSum = ovPSum / 100;
        ovPlanSum.value = ovPSum;
        //残業実績累計
        var ovTSum = recordSet(1);
        ovTSum = ovTSum * 100;
        ovTSum = Math.round(ovTSum);
        ovTSum = ovTSum / 100;
        overTimeSum.value = ovTSum;
    }
    recordSet.Close();
    recordSet = null;
}